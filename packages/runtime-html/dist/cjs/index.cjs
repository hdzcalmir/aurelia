"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var e = require("@aurelia/metadata");

var s = require("@aurelia/runtime");

var i = require("@aurelia/platform");

var n = require("@aurelia/platform-browser");

function r(t, e, s, i) {
    var n = arguments.length, r = n < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, s) : i, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, e, s, i); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (n < 3 ? o(r) : n > 3 ? o(e, s, r) : o(e, s)) || r;
    return n > 3 && r && Object.defineProperty(e, s, r), r;
}

function o(t, e) {
    return function(s, i) {
        e(s, i, t);
    };
}

const l = e.Metadata.getOwn;

const h = e.Metadata.hasOwn;

const a = e.Metadata.define;

const {annotation: c, resource: u} = t.Protocol;

const f = c.keyFor;

const d = u.keyFor;

const p = u.appendTo;

const x = c.appendTo;

const m = c.getKeys;

const g = Object;

const v = String;

const w = g.prototype;

const b = () => g.create(null);

const y = t => new Error(t);

const k = w.hasOwnProperty;

const A = g.freeze;

const C = g.assign;

const B = g.getOwnPropertyNames;

const R = g.keys;

const S = b();

const I = (t, e, s) => {
    if (true === S[e]) return true;
    if (!P(e)) return false;
    const i = e.slice(0, 5);
    return S[e] = "aria-" === i || "data-" === i || s.isStandardSvgAttribute(t, e);
};

const T = t => t instanceof Promise;

const E = t => t instanceof Array;

const L = t => "function" === typeof t;

const P = t => "string" === typeof t;

const _ = g.defineProperty;

const q = t => {
    throw t;
};

const $ = g.is;

const U = Reflect.defineProperty;

const D = (t, e, s) => {
    U(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
};

function M(t, e) {
    let s;
    function i(t, e) {
        if (arguments.length > 1) s.property = e;
        a(O, BindableDefinition.create(e, t, s), t.constructor, e);
        x(t.constructor, V.keyFrom(e));
    }
    if (arguments.length > 1) {
        s = {};
        i(t, e);
        return;
    } else if (P(t)) {
        s = {};
        return i;
    }
    s = void 0 === t ? {} : t;
    return i;
}

function F(t) {
    return t.startsWith(O);
}

const O = f("bindable");

const V = A({
    name: O,
    keyFrom: t => `${O}:${t}`,
    from(t, ...e) {
        const s = {};
        const i = Array.isArray;
        function n(e) {
            s[e] = BindableDefinition.create(e, t);
        }
        function r(e, i) {
            s[e] = i instanceof BindableDefinition ? i : BindableDefinition.create(e, t, i);
        }
        function o(t) {
            if (i(t)) t.forEach(n); else if (t instanceof BindableDefinition) s[t.property] = t; else if (void 0 !== t) R(t).forEach((e => r(e, t[e])));
        }
        e.forEach(o);
        return s;
    },
    for(t) {
        let e;
        const s = {
            add(i) {
                let n;
                let r;
                if (P(i)) {
                    n = i;
                    r = {
                        property: n
                    };
                } else {
                    n = i.property;
                    r = i;
                }
                e = BindableDefinition.create(n, t, r);
                if (!h(O, t, n)) x(t, V.keyFrom(n));
                a(O, e, t, n);
                return s;
            },
            mode(t) {
                e.mode = t;
                return s;
            },
            callback(t) {
                e.callback = t;
                return s;
            },
            attribute(t) {
                e.attribute = t;
                return s;
            },
            primary() {
                e.primary = true;
                return s;
            },
            set(t) {
                e.set = t;
                return s;
            }
        };
        return s;
    },
    getAll(e) {
        const s = O.length + 1;
        const i = [];
        const n = t.getPrototypeChain(e);
        let r = n.length;
        let o = 0;
        let h;
        let a;
        let c;
        let u;
        while (--r >= 0) {
            c = n[r];
            h = m(c).filter(F);
            a = h.length;
            for (u = 0; u < a; ++u) i[o++] = l(O, c, h[u].slice(s));
        }
        return i;
    }
});

class BindableDefinition {
    constructor(t, e, s, i, n, r) {
        this.attribute = t;
        this.callback = e;
        this.mode = s;
        this.primary = i;
        this.property = n;
        this.set = r;
    }
    static create(e, s, i = {}) {
        return new BindableDefinition(t.firstDefined(i.attribute, t.kebabCase(e)), t.firstDefined(i.callback, `${e}Changed`), t.firstDefined(i.mode, 2), t.firstDefined(i.primary, false), t.firstDefined(i.property, e), t.firstDefined(i.set, H(e, s, i)));
    }
}

function N(t, e, s) {
    j.define(t, e);
}

const j = {
    key: f("coercer"),
    define(t, e) {
        a(j.key, t[e].bind(t), t);
    },
    for(t) {
        return l(j.key, t);
    }
};

function H(s, i, n = {}) {
    const r = n.type ?? e.Metadata.get("design:type", i, s) ?? null;
    if (null == r) return t.noop;
    let o;
    switch (r) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        o = r;
        break;

      default:
        {
            const e = r.coerce;
            o = "function" === typeof e ? e.bind(r) : j.for(r) ?? t.noop;
            break;
        }
    }
    return o === t.noop ? o : W(o, n.nullable);
}

function W(t, e) {
    return function(s, i) {
        if (!i?.enableCoercion) return s;
        return (e ?? (i?.coerceNullish ?? false ? false : true)) && null == s ? s : t(s, i);
    };
}

class BindableObserver {
    get type() {
        return 1;
    }
    constructor(e, s, i, n, r, o) {
        this.set = n;
        this.$controller = r;
        this.i = o;
        this.v = void 0;
        this.ov = void 0;
        const l = e[i];
        const h = e.propertyChanged;
        const a = this.u = L(l);
        const c = this.A = L(h);
        const u = this.hs = n !== t.noop;
        let f;
        this.o = e;
        this.k = s;
        this.C = c ? h : t.noop;
        this.cb = a ? l : t.noop;
        if (void 0 === this.cb && !c && !u) this.iO = false; else {
            this.iO = true;
            f = e[s];
            this.v = u && void 0 !== f ? n(f, this.i) : f;
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
            if ($(t, e)) return;
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

s.subscriberCollection(BindableObserver);

const z = function(e) {
    function s(e, i, n) {
        t.DI.inject(s)(e, i, n);
    }
    s.$isResolver = true;
    s.resolve = function(t, s) {
        if (s.root === s) return s.get(e);
        return s.has(e, false) ? s.get(e) : s.root.get(e);
    };
    return s;
};

const G = function(e) {
    function s(e, i, n) {
        t.DI.inject(s)(e, i, n);
    }
    s.$isResolver = true;
    s.resolve = function(t, s) {
        if (s.root === s) return s.getAll(e, false);
        return s.has(e, false) ? s.getAll(e, false).concat(s.root.getAll(e, false)) : s.root.getAll(e, false);
    };
    return s;
};

const X = t.DI.createInterface;

const K = t.Registration.singleton;

const Q = t.Registration.aliasTo;

const Y = t.Registration.instance;

t.Registration.callback;

const Z = t.Registration.transient;

const J = (t, e, s) => t.registerResolver(e, s);

function tt(...t) {
    return function(e) {
        const s = f("aliases");
        const i = l(s, e);
        if (void 0 === i) a(s, t, e); else i.push(...t);
    };
}

function et(e, s, i, n) {
    for (let r = 0, o = e.length; r < o; ++r) t.Registration.aliasTo(i, s.keyFrom(e[r])).register(n);
}

class CharSpec {
    constructor(t, e, s, i) {
        this.chars = t;
        this.repeat = e;
        this.isSymbol = s;
        this.isInverted = i;
        if (i) switch (t.length) {
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
        this.parts = t.emptyArray;
        this.q = "";
        this.$ = {};
        this.U = {};
    }
    get pattern() {
        const t = this.q;
        if ("" === t) return null; else return t;
    }
    set pattern(e) {
        if (null == e) {
            this.q = "";
            this.parts = t.emptyArray;
        } else {
            this.q = e;
            this.parts = this.U[e];
        }
    }
    append(t, e) {
        const s = this.$;
        if (void 0 === s[t]) s[t] = e; else s[t] += e;
    }
    next(t) {
        const e = this.$;
        let s;
        if (void 0 !== e[t]) {
            s = this.U;
            if (void 0 === s[t]) s[t] = [ e[t] ]; else s[t].push(e[t]);
            e[t] = void 0;
        }
    }
}

class AttrParsingState {
    get q() {
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
        const s = e.length;
        let i = null;
        let n = 0;
        for (;n < s; ++n) {
            i = e[n];
            if (t.equals(i.charSpec)) return i;
        }
        return null;
    }
    append(t, e) {
        const s = this.F;
        if (!s.includes(e)) s.push(e);
        let i = this.findChild(t);
        if (null == i) {
            i = new AttrParsingState(t, e);
            this.O.push(i);
            if (t.repeat) i.O.push(i);
        }
        return i;
    }
    findMatches(t, e) {
        const s = [];
        const i = this.O;
        const n = i.length;
        let r = 0;
        let o = null;
        let l = 0;
        let h = 0;
        for (;l < n; ++l) {
            o = i[l];
            if (o.charSpec.has(t)) {
                s.push(o);
                r = o.F.length;
                h = 0;
                if (o.charSpec.isSymbol) for (;h < r; ++h) e.next(o.F[h]); else for (;h < r; ++h) e.append(o.F[h], t);
            }
        }
        return s;
    }
}

class StaticSegment {
    constructor(t) {
        this.text = t;
        const e = this.N = t.length;
        const s = this.j = [];
        let i = 0;
        for (;e > i; ++i) s.push(new CharSpec(t[i], false, false, false));
    }
    eachChar(t) {
        const e = this.N;
        const s = this.j;
        let i = 0;
        for (;e > i; ++i) t(s[i]);
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

const st = X("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.W = new AttrParsingState(null);
        this.G = [ this.W ];
    }
    add(t) {
        t = t.slice(0).sort(((t, e) => t.pattern > e.pattern ? 1 : -1));
        const e = t.length;
        let s;
        let i;
        let n;
        let r;
        let o;
        let l;
        let h;
        let a = 0;
        let c;
        while (e > a) {
            s = this.W;
            i = t[a];
            n = i.pattern;
            r = new SegmentTypes;
            o = this.X(i, r);
            l = o.length;
            h = t => s = s.append(t, n);
            for (c = 0; l > c; ++c) o[c].eachChar(h);
            s.V = r;
            s.M = true;
            ++a;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const s = t.length;
        let i = this.G;
        let n = 0;
        let r;
        for (;n < s; ++n) {
            i = this.K(i, t.charAt(n), e);
            if (0 === i.length) break;
        }
        i = i.filter(it);
        if (i.length > 0) {
            i.sort(nt);
            r = i[0];
            if (!r.charSpec.isSymbol) e.next(r.q);
            e.pattern = r.q;
        }
        return e;
    }
    K(t, e, s) {
        const i = [];
        let n = null;
        const r = t.length;
        let o = 0;
        for (;o < r; ++o) {
            n = t[o];
            i.push(...n.findMatches(e, s));
        }
        return i;
    }
    X(t, e) {
        const s = [];
        const i = t.pattern;
        const n = i.length;
        const r = t.symbols;
        let o = 0;
        let l = 0;
        let h = "";
        while (o < n) {
            h = i.charAt(o);
            if (0 === r.length || !r.includes(h)) if (o === l) if ("P" === h && "PART" === i.slice(o, o + 4)) {
                l = o += 4;
                s.push(new DynamicSegment(r));
                ++e.dynamics;
            } else ++o; else ++o; else if (o !== l) {
                s.push(new StaticSegment(i.slice(l, o)));
                ++e.statics;
                l = o;
            } else {
                s.push(new SymbolSegment(i.slice(l, o + 1)));
                ++e.symbols;
                l = ++o;
            }
        }
        if (l !== o) {
            s.push(new StaticSegment(i.slice(l, o)));
            ++e.statics;
        }
        return s;
    }
}

function it(t) {
    return t.M;
}

function nt(t, e) {
    const s = t.V;
    const i = e.V;
    if (s.statics !== i.statics) return i.statics - s.statics;
    if (s.dynamics !== i.dynamics) return i.dynamics - s.dynamics;
    if (s.symbols !== i.symbols) return i.symbols - s.symbols;
    return 0;
}

class AttrSyntax {
    constructor(t, e, s, i) {
        this.rawName = t;
        this.rawValue = e;
        this.target = s;
        this.command = i;
    }
}

const rt = X("IAttributePattern");

const ot = X("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(e, s) {
        this.Y = {};
        this.Z = e;
        const i = this.F = {};
        const n = s.reduce(((t, e) => {
            const s = ct(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), t.emptyArray);
        e.add(n);
    }
    parse(t, e) {
        let s = this.Y[t];
        if (null == s) s = this.Y[t] = this.Z.interpret(t);
        const i = s.pattern;
        if (null == i) return new AttrSyntax(t, e, t, null); else return this.F[i][i](t, e, s.parts);
    }
}

AttributeParser.inject = [ st, t.all(rt) ];

function lt(...t) {
    return function e(s) {
        return ut.define(t, s);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        K(rt, this.Type).register(t);
    }
}

const ht = d("attribute-pattern");

const at = "attribute-pattern-definitions";

const ct = e => t.Protocol.annotation.get(e, at);

const ut = A({
    name: ht,
    definitionAnnotationKey: at,
    define(e, s) {
        const i = new AttributePatternResourceDefinition(s);
        a(ht, i, s);
        p(s, ht);
        t.Protocol.annotation.set(s, at, e);
        x(s, at);
        return s;
    },
    getPatternDefinitions: ct
});

exports.DotSeparatedAttributePattern = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], s[1]);
    }
    "PART.PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, `${s[0]}.${s[1]}`, s[2]);
    }
};

exports.DotSeparatedAttributePattern = r([ lt({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], exports.DotSeparatedAttributePattern);

exports.RefAttributePattern = class RefAttributePattern {
    ref(t, e, s) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "ref");
    }
};

exports.RefAttributePattern = r([ lt({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], exports.RefAttributePattern);

exports.ColonPrefixedBindAttributePattern = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "bind");
    }
};

exports.ColonPrefixedBindAttributePattern = r([ lt({
    pattern: ":PART",
    symbols: ":"
}) ], exports.ColonPrefixedBindAttributePattern);

exports.AtPrefixedTriggerAttributePattern = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger");
    }
};

exports.AtPrefixedTriggerAttributePattern = r([ lt({
    pattern: "@PART",
    symbols: "@"
}) ], exports.AtPrefixedTriggerAttributePattern);

let ft = class SpreadAttributePattern {
    "...$attrs"(t, e, s) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

ft = r([ lt({
    pattern: "...$attrs",
    symbols: ""
}) ], ft);

class AttributeObserver {
    constructor(t, e, s) {
        this.type = 2 | 1 | 4;
        this.v = null;
        this.ov = null;
        this.J = false;
        this.o = t;
        this.tt = e;
        this.et = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        this.v = t;
        this.J = t !== this.ov;
        this.st();
    }
    st() {
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
                    if (P(e) && e.includes("!important")) {
                        t = "important";
                        e = e.replace("!important", "");
                    }
                    this.o.style.setProperty(this.tt, e, t);
                    break;
                }

              default:
                if (null == this.v) this.o.removeAttribute(this.et); else this.o.setAttribute(this.et, v(this.v));
            }
        }
    }
    handleMutation(t) {
        let e = false;
        for (let s = 0, i = t.length; i > s; ++s) {
            const i = t[s];
            if ("attributes" === i.type && i.attributeName === this.tt) {
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
                throw y(`AUR0651:${this.et}`);
            }
            if (t !== this.v) {
                this.ov = this.v;
                this.v = t;
                this.J = false;
                this.it();
            }
        }
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            this.v = this.ov = this.o.getAttribute(this.tt);
            dt(this.o.ownerDocument.defaultView.MutationObserver, this.o, this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) pt(this.o, this);
    }
    it() {
        gt = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, gt);
    }
}

s.subscriberCollection(AttributeObserver);

const dt = (t, e, s) => {
    if (void 0 === e.$eMObs) e.$eMObs = new Set;
    if (void 0 === e.$mObs) (e.$mObs = new t(xt)).observe(e, {
        attributes: true
    });
    e.$eMObs.add(s);
};

const pt = (t, e) => {
    const s = t.$eMObs;
    if (s && s.delete(e)) {
        if (0 === s.size) {
            t.$mObs.disconnect();
            t.$mObs = void 0;
        }
        return true;
    }
    return false;
};

const xt = t => {
    t[0].target.$eMObs.forEach(mt, t);
};

function mt(t) {
    t.handleMutation(this);
}

let gt;

function vt(t) {
    return function(e) {
        return yt.define(t, e);
    };
}

class BindingBehaviorDefinition {
    constructor(t, e, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
    }
    static create(e, s) {
        let i;
        let n;
        if (P(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new BindingBehaviorDefinition(s, t.firstDefined(bt(s, "name"), i), t.mergeArrays(bt(s, "aliases"), n.aliases, s.aliases), yt.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        K(s, e).register(t);
        Q(s, e).register(t);
        et(i, yt, s, t);
    }
}

const wt = d("binding-behavior");

const bt = (t, e) => l(f(e), t);

const yt = A({
    name: wt,
    keyFrom(t) {
        return `${wt}:${t}`;
    },
    isType(t) {
        return L(t) && h(wt, t);
    },
    define(t, e) {
        const s = BindingBehaviorDefinition.create(t, e);
        a(wt, s, s.Type);
        a(wt, s, s);
        p(e, wt);
        return s.Type;
    },
    getDefinition(t) {
        const e = l(wt, t);
        if (void 0 === e) throw y(`AUR0151:${t.name}`);
        return e;
    },
    annotate(t, e, s) {
        a(f(e), s, t);
    },
    getAnnotation: bt
});

function kt(t) {
    return function(e) {
        return Bt.define(t, e);
    };
}

class ValueConverterDefinition {
    constructor(t, e, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
    }
    static create(e, s) {
        let i;
        let n;
        if (P(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new ValueConverterDefinition(s, t.firstDefined(Ct(s, "name"), i), t.mergeArrays(Ct(s, "aliases"), n.aliases, s.aliases), Bt.keyFrom(i));
    }
    register(e) {
        const {Type: s, key: i, aliases: n} = this;
        t.Registration.singleton(i, s).register(e);
        t.Registration.aliasTo(i, s).register(e);
        et(n, Bt, i, e);
    }
}

const At = d("value-converter");

const Ct = (t, e) => l(f(e), t);

const Bt = A({
    name: At,
    keyFrom: t => `${At}:${t}`,
    isType(t) {
        return L(t) && h(At, t);
    },
    define(t, e) {
        const s = ValueConverterDefinition.create(t, e);
        a(At, s, s.Type);
        a(At, s, s);
        p(e, At);
        return s.Type;
    },
    getDefinition(t) {
        const e = l(At, t);
        if (void 0 === e) throw y(`AUR0152:${t.name}`);
        return e;
    },
    annotate(t, e, s) {
        a(f(e), s, t);
    },
    getAnnotation: Ct
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
        if (t !== s.astEvaluate(i.ast, i.s, i, null)) {
            this.v = t;
            this.nt.add(this);
        }
    }
}

const Rt = t => {
    D(t.prototype, "useScope", (function(t) {
        this.s = t;
    }));
};

const St = (t, e = true) => i => {
    const n = i.prototype;
    if (null != t) U(n, "strict", {
        enumerable: true,
        get: function() {
            return t;
        }
    });
    U(n, "strictFnCall", {
        enumerable: true,
        get: function() {
            return e;
        }
    });
    D(n, "get", (function(t) {
        return this.l.get(t);
    }));
    D(n, "getSignaler", (function() {
        return this.l.root.get(s.ISignaler);
    }));
    D(n, "getConverter", (function(t) {
        const e = Bt.keyFrom(t);
        let s = It.get(this);
        if (null == s) It.set(this, s = new ResourceLookup);
        return s[e] ?? (s[e] = this.l.get(z(e)));
    }));
    D(n, "getBehavior", (function(t) {
        const e = yt.keyFrom(t);
        let s = It.get(this);
        if (null == s) It.set(this, s = new ResourceLookup);
        return s[e] ?? (s[e] = this.l.get(z(e)));
    }));
};

const It = new WeakMap;

class ResourceLookup {}

const Tt = X("IFlushQueue", (t => t.singleton(FlushQueue)));

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
            this.ot.forEach(Et);
        } finally {
            this.rt = false;
        }
    }
    clear() {
        this.ot.clear();
        this.rt = false;
    }
}

function Et(t, e, s) {
    s.delete(t);
    t.flush();
}

const Lt = new WeakSet;

const Pt = (t, e) => {
    D(t.prototype, "limit", (function(t) {
        if (Lt.has(this)) throw y(`AURXXXX: a rate limit has already been applied.`);
        Lt.add(this);
        const s = e(this, t);
        const i = this[s];
        const n = (...t) => i.call(this, ...t);
        const r = "debounce" === t.type ? _t(t, n, this) : qt(t, n, this);
        this[s] = r;
        return {
            dispose: () => {
                Lt.delete(this);
                r.dispose();
                delete this[s];
            }
        };
    }));
};

const _t = (t, e, s) => {
    let i;
    let n;
    let r;
    const o = t.queue;
    const l = l => {
        r = l;
        if (s.isBound) {
            n = i;
            i = o.queueTask((() => e(r)), {
                delay: t.delay,
                reusable: false
            });
            n?.cancel();
        } else e(r);
    };
    l.dispose = () => {
        n?.cancel();
        i?.cancel();
    };
    return l;
};

const qt = (t, e, s) => {
    let i;
    let n;
    let r = 0;
    let o = 0;
    let l;
    const h = t.queue;
    const a = () => t.now();
    const c = c => {
        l = c;
        if (s.isBound) {
            o = a() - r;
            n = i;
            if (o > t.delay) {
                r = a();
                e(l);
            } else i = h.queueTask((() => {
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
        i?.cancel();
    };
    return c;
};

const $t = {
    reusable: false,
    preempt: true
};

class AttributeBinding {
    constructor(t, e, s, i, n, r, o, l, h) {
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
        this.oL = s;
        this.ct = i;
    }
    updateTarget(t) {
        this.ut.setValue(t, this.target, this.targetProperty);
    }
    handleChange() {
        if (!this.isBound) return;
        let t;
        this.obs.version++;
        const e = s.astEvaluate(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = 1 !== this.ht.state && (4 & this.ut.type) > 0;
            if (s) {
                t = this.lt;
                this.lt = this.ct.queueTask((() => {
                    this.lt = null;
                    this.updateTarget(e);
                }), $t);
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
        s.astBind(this.ast, t, this);
        this.ut ?? (this.ut = new AttributeObserver(this.target, this.targetProperty, this.targetAttribute));
        if (this.mode & (2 | 1)) this.updateTarget(this.v = s.astEvaluate(this.ast, t, this, (2 & this.mode) > 0 ? this : null));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.lt?.cancel();
        this.lt = null;
        this.obs.clearAll();
    }
}

Rt(AttributeBinding);

Pt(AttributeBinding, (() => "updateTarget"));

s.connectable(AttributeBinding);

St(true)(AttributeBinding);

const Ut = {
    reusable: false,
    preempt: true
};

class InterpolationBinding {
    constructor(t, e, s, i, n, r, o, l) {
        this.ast = n;
        this.target = r;
        this.targetProperty = o;
        this.mode = l;
        this.isBound = false;
        this.s = void 0;
        this.lt = null;
        this.ht = t;
        this.oL = s;
        this.ct = i;
        this.ut = s.getAccessor(r, o);
        const h = n.expressions;
        const a = this.partBindings = Array(h.length);
        const c = h.length;
        let u = 0;
        for (;c > u; ++u) a[u] = new InterpolationPartBinding(h[u], r, o, e, s, this);
    }
    ft() {
        this.updateTarget();
    }
    updateTarget() {
        const t = this.partBindings;
        const e = this.ast.parts;
        const s = t.length;
        let i = "";
        let n = 0;
        if (1 === s) i = e[0] + t[0].v + e[1]; else {
            i = e[0];
            for (;s > n; ++n) i += t[n].v + e[n + 1];
        }
        const r = this.ut;
        const o = 1 !== this.ht.state && (4 & r.type) > 0;
        let l;
        if (o) {
            l = this.lt;
            this.lt = this.ct.queueTask((() => {
                this.lt = null;
                r.setValue(i, this.target, this.targetProperty);
            }), Ut);
            l?.cancel();
            l = null;
        } else r.setValue(i, this.target, this.targetProperty);
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        const e = this.partBindings;
        const s = e.length;
        let i = 0;
        for (;s > i; ++i) e[i].bind(t);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.s = void 0;
        const t = this.partBindings;
        const e = t.length;
        let s = 0;
        for (;e > s; ++s) t[s].unbind();
        this.lt?.cancel();
        this.lt = null;
    }
}

class InterpolationPartBinding {
    constructor(t, e, s, i, n, r) {
        this.ast = t;
        this.target = e;
        this.targetProperty = s;
        this.owner = r;
        this.mode = 2;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = i;
        this.oL = n;
    }
    updateTarget() {
        this.owner.ft();
    }
    handleChange() {
        if (!this.isBound) return;
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        this.obs.clear();
        if (t != this.v) {
            this.v = t;
            if (E(t)) this.observeCollection(t);
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
        s.astBind(this.ast, t, this);
        this.v = s.astEvaluate(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        if (E(this.v)) this.observeCollection(this.v);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

Rt(InterpolationPartBinding);

Pt(InterpolationPartBinding, (() => "updateTarget"));

s.connectable(InterpolationPartBinding);

St(true)(InterpolationPartBinding);

class ContentBinding {
    constructor(t, e, s, i, n, r, o, l) {
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
        this.oL = s;
        this.ct = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.p.Node;
        const i = this.v;
        this.v = t;
        if (i instanceof s) i.parentNode?.removeChild(i);
        if (t instanceof s) {
            e.textContent = "";
            e.parentNode?.insertBefore(t, e);
        } else e.textContent = v(t);
    }
    handleChange() {
        if (!this.isBound) return;
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
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
        const t = this.v = s.astEvaluate(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        this.obs.clear();
        if (E(t)) this.observeCollection(t);
        const e = 1 !== this.ht.state;
        if (e) this.dt(t); else this.updateTarget(t);
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        s.astBind(this.ast, t, this);
        const e = this.v = s.astEvaluate(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        if (E(e)) this.observeCollection(e);
        this.updateTarget(e);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
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
        }), Ut);
        e?.cancel();
    }
}

Rt(ContentBinding);

Pt(ContentBinding, (() => "updateTarget"));

s.connectable()(ContentBinding);

St(void 0, false)(ContentBinding);

class LetBinding {
    constructor(t, e, s, i, n = false) {
        this.ast = s;
        this.targetProperty = i;
        this.isBound = false;
        this.s = void 0;
        this.target = null;
        this.boundFn = false;
        this.l = t;
        this.oL = e;
        this.xt = n;
    }
    updateTarget() {
        this.target[this.targetProperty] = this.v;
    }
    handleChange() {
        if (!this.isBound) return;
        this.obs.version++;
        this.v = s.astEvaluate(this.ast, this.s, this, this);
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
        this.target = this.xt ? t.bindingContext : t.overrideContext;
        s.astBind(this.ast, t, this);
        this.v = s.astEvaluate(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

Rt(LetBinding);

Pt(LetBinding, (() => "updateTarget"));

s.connectable(LetBinding);

St(true)(LetBinding);

class PropertyBinding {
    constructor(t, e, s, i, n, r, o, l) {
        this.ast = n;
        this.target = r;
        this.targetProperty = o;
        this.mode = l;
        this.isBound = false;
        this.s = void 0;
        this.ut = void 0;
        this.lt = null;
        this.gt = null;
        this.boundFn = false;
        this.l = e;
        this.ht = t;
        this.ct = i;
        this.oL = s;
    }
    updateTarget(t) {
        this.ut.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        s.astAssign(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) return;
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        this.obs.clear();
        const e = 1 !== this.ht.state && (4 & this.ut.type) > 0;
        if (e) {
            Dt = this.lt;
            this.lt = this.ct.queueTask((() => {
                this.updateTarget(t);
                this.lt = null;
            }), Mt);
            Dt?.cancel();
            Dt = null;
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
        s.astBind(this.ast, t, this);
        const e = this.oL;
        const i = this.mode;
        let n = this.ut;
        if (!n) {
            if (4 & i) n = e.getObserver(this.target, this.targetProperty); else n = e.getAccessor(this.target, this.targetProperty);
            this.ut = n;
        }
        const r = (2 & i) > 0;
        if (i & (2 | 1)) this.updateTarget(s.astEvaluate(this.ast, this.s, this, r ? this : null));
        if (4 & i) {
            n.subscribe(this.gt ?? (this.gt = new BindingTargetSubscriber(this, this.l.get(Tt))));
            if (!r) this.updateSource(n.getValue(this.target, this.targetProperty));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        if (this.gt) {
            this.ut.unsubscribe(this.gt);
            this.gt = null;
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
        if (null != this.gt) throw y(`AURxxxx: binding already has a target subscriber`);
        this.gt = t;
    }
}

Rt(PropertyBinding);

Pt(PropertyBinding, (t => 4 & t.mode ? "updateSource" : "updateTarget"));

s.connectable(PropertyBinding);

St(true, false)(PropertyBinding);

let Dt = null;

const Mt = {
    reusable: false,
    preempt: true
};

class RefBinding {
    constructor(t, e, s) {
        this.ast = e;
        this.target = s;
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
        s.astBind(this.ast, t, this);
        s.astAssign(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        if (s.astEvaluate(this.ast, this.s, this, null) === this.target) s.astAssign(this.ast, this.s, this, null);
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
    }
}

St(false)(RefBinding);

class ListenerBindingOptions {
    constructor(t, e = false) {
        this.prevent = t;
        this.capture = e;
    }
}

class ListenerBinding {
    constructor(t, e, s, i, n) {
        this.ast = e;
        this.target = s;
        this.targetEvent = i;
        this.isBound = false;
        this.self = false;
        this.boundFn = true;
        this.l = t;
        this.vt = n;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = s.astEvaluate(this.ast, this.s, this, null);
        delete e.$event;
        if (L(i)) i = i(t);
        if (true !== i && this.vt.prevent) t.preventDefault();
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
        s.astBind(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.vt);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.vt);
    }
}

Rt(ListenerBinding);

Pt(ListenerBinding, (() => "callSource"));

St(true, true)(ListenerBinding);

const Ft = X("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(Y(Ft, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return null === t ? e() : e(this.c.get(t));
    }
}

const Ot = A({
    creating: Vt("creating"),
    hydrating: Vt("hydrating"),
    hydrated: Vt("hydrated"),
    activating: Vt("activating"),
    activated: Vt("activated"),
    deactivating: Vt("deactivating"),
    deactivated: Vt("deactivated")
});

function Vt(t) {
    function e(e, s) {
        if (L(s)) return new $AppTask(t, e, s);
        return new $AppTask(t, null, e);
    }
    return e;
}

function Nt(t, e) {
    if (null == t) throw y(`AUR0772`);
    return function s(i, n, r) {
        const o = null == n;
        const l = o ? i : i.constructor;
        const h = new WatchDefinition(t, o ? e : r.value);
        if (o) {
            if (!L(e) && (null == e || !(e in l.prototype))) throw y(`AUR0773:${v(e)}@${l.name}}`);
        } else if (!L(r?.value)) throw y(`AUR0774:${v(n)}`);
        Wt.add(l, h);
        if (Yt(l)) te(l).watches.push(h);
        if (Hs(l)) Gs(l).watches.push(h);
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const jt = t.emptyArray;

const Ht = f("watch");

const Wt = A({
    name: Ht,
    add(t, e) {
        let s = l(Ht, t);
        if (null == s) a(Ht, s = [], t);
        s.push(e);
    },
    getAnnotation(t) {
        return l(Ht, t) ?? jt;
    }
});

function zt(t) {
    return function(e) {
        return Jt(t, e);
    };
}

function Gt(t) {
    return function(e) {
        return Jt(P(t) ? {
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
    constructor(t, e, s, i, n, r, o, l, h, a) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
        this.defaultBindingMode = n;
        this.isTemplateController = r;
        this.bindables = o;
        this.noMultiBindings = l;
        this.watches = h;
        this.dependencies = a;
    }
    static create(e, s) {
        let i;
        let n;
        if (P(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new CustomAttributeDefinition(s, t.firstDefined(Qt(s, "name"), i), t.mergeArrays(Qt(s, "aliases"), n.aliases, s.aliases), Kt(i), t.firstDefined(Qt(s, "defaultBindingMode"), n.defaultBindingMode, s.defaultBindingMode, 2), t.firstDefined(Qt(s, "isTemplateController"), n.isTemplateController, s.isTemplateController, false), V.from(s, ...V.getAll(s), Qt(s, "bindables"), s.bindables, n.bindables), t.firstDefined(Qt(s, "noMultiBindings"), n.noMultiBindings, s.noMultiBindings, false), t.mergeArrays(Wt.getAnnotation(s), s.watches), t.mergeArrays(Qt(s, "dependencies"), n.dependencies, s.dependencies));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        Z(s, e).register(t);
        Q(s, e).register(t);
        et(i, ee, s, t);
    }
}

const Xt = d("custom-attribute");

const Kt = t => `${Xt}:${t}`;

const Qt = (t, e) => l(f(e), t);

const Yt = t => L(t) && h(Xt, t);

const Zt = (t, e) => ds(t, Kt(e)) ?? void 0;

const Jt = (t, e) => {
    const s = CustomAttributeDefinition.create(t, e);
    a(Xt, s, s.Type);
    a(Xt, s, s);
    p(e, Xt);
    return s.Type;
};

const te = t => {
    const e = l(Xt, t);
    if (void 0 === e) throw y(`AUR0759:${t.name}`);
    return e;
};

const ee = A({
    name: Xt,
    keyFrom: Kt,
    isType: Yt,
    for: Zt,
    define: Jt,
    getDefinition: te,
    annotate(t, e, s) {
        a(f(e), s, t);
    },
    getAnnotation: Qt
});

const se = t.IPlatform;

const ie = (t, e, s, i) => {
    t.addEventListener(e, s, i);
};

const ne = (t, e, s, i) => {
    t.removeEventListener(e, s, i);
};

const re = t => {
    let e;
    const s = t.prototype;
    D(s, "subscribe", (function(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            for (e of this.cf.events) ie(this.wt, e, this);
            this.bt = true;
            this.yt?.();
        }
    }));
    D(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) {
            for (e of this.cf.events) ne(this.wt, e, this);
            this.bt = false;
            this.kt?.();
        }
    }));
    D(s, "useConfig", (function(t) {
        this.cf = t;
        if (this.bt) {
            for (e of this.cf.events) ne(this.wt, e, this);
            for (e of this.cf.events) ie(this.wt, e, this);
        }
    }));
};

const oe = e => {
    D(e.prototype, "subscribe", t.noop);
    D(e.prototype, "unsubscribe", t.noop);
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
        this.st();
    }
    st() {
        if (this.J) {
            this.J = false;
            const t = this.value;
            const e = this.At;
            const s = le(t);
            let i = this.Ct;
            this.ov = t;
            if (s.length > 0) this.Bt(s);
            this.Ct += 1;
            if (0 === i) return;
            i -= 1;
            for (const t in e) {
                if (!k.call(e, t) || e[t] !== i) continue;
                this.obj.classList.remove(t);
            }
        }
    }
    Bt(t) {
        const e = this.obj;
        const s = t.length;
        let i = 0;
        let n;
        for (;i < s; i++) {
            n = t[i];
            if (0 === n.length) continue;
            this.At[n] = this.Ct;
            e.classList.add(n);
        }
    }
}

function le(e) {
    if (P(e)) return he(e);
    if ("object" !== typeof e) return t.emptyArray;
    if (e instanceof Array) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) t.push(...le(e[i]));
            return t;
        } else return t.emptyArray;
    }
    const s = [];
    let i;
    for (i in e) if (Boolean(e[i])) if (i.includes(" ")) s.push(...he(i)); else s.push(i);
    return s;
}

function he(e) {
    const s = e.match(/\S+/g);
    if (null === s) return t.emptyArray;
    return s;
}

oe(ClassAttributeAccessor);

function ae(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        var e;
        const s = C({}, ...this.modules);
        const i = Jt({
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
                this.Rt.setValue(this.value?.split(/\s+/g).map((t => s[t] || t)) ?? "");
            }
        }, e.inject = [ xs ], e));
        t.register(i, Y(vs, s));
    }
}

function ce(...t) {
    return new ShadowDOMRegistry(t);
}

const ue = X("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(se))) return t.get(AdoptedStyleSheetsStylesFactory);
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(de);
        const s = t.get(ue);
        t.register(Y(fe, s.createStyles(this.css, e)));
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

AdoptedStyleSheetsStylesFactory.inject = [ se ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ se ];

const fe = X("IShadowDOMStyles");

const de = X("IShadowDOMGlobalStyles", (e => e.instance({
    applyTo: t.noop
})));

class AdoptedStyleSheetsStyles {
    constructor(t, e, s, i = null) {
        this.sharedStyles = i;
        this.styleSheets = e.map((e => {
            let i;
            if (e instanceof t.CSSStyleSheet) i = e; else {
                i = s.get(e);
                if (void 0 === i) {
                    i = new t.CSSStyleSheet;
                    i.replaceSync(e);
                    s.set(e, i);
                }
            }
            return i;
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
    constructor(t, e, s = null) {
        this.p = t;
        this.localStyles = e;
        this.sharedStyles = s;
    }
    applyTo(t) {
        const e = this.localStyles;
        const s = this.p;
        for (let i = e.length - 1; i > -1; --i) {
            const n = s.document.createElement("style");
            n.innerHTML = e[i];
            t.prepend(n);
        }
        if (null !== this.sharedStyles) this.sharedStyles.applyTo(t);
    }
}

const pe = {
    shadowDOM(e) {
        return Ot.creating(t.IContainer, (t => {
            if (null != e.sharedStyles) {
                const s = t.get(ue);
                t.register(Y(de, s.createStyles(e.sharedStyles, null)));
            }
        }));
    }
};

const {enter: xe, exit: me} = s.ConnectableSwitcher;

const {wrap: ge, unwrap: ve} = s.ProxyObservable;

class ComputedWatcher {
    get value() {
        return this.v;
    }
    constructor(t, e, s, i, n) {
        this.obj = t;
        this.$get = s;
        this.useProxy = n;
        this.isBound = false;
        this.running = false;
        this.v = void 0;
        this.cb = i;
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
        const s = this.compute();
        if (!$(s, e)) this.cb.call(t, s, e, t);
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            xe(this);
            return this.v = ve(this.$get.call(void 0, this.useProxy ? ge(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            me(this);
        }
    }
}

class ExpressionWatcher {
    get value() {
        return this.v;
    }
    constructor(t, e, s, i, n) {
        this.scope = t;
        this.l = e;
        this.oL = s;
        this.isBound = false;
        this.boundFn = false;
        this.obj = t.bindingContext;
        this.St = i;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.St;
        const i = this.obj;
        const n = this.v;
        const r = 1 === e.$kind && 1 === this.obs.count;
        if (!r) {
            this.obs.version++;
            t = s.astEvaluate(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!$(t, n)) {
            this.v = t;
            this.cb.call(i, t, n, i);
        }
    }
    bind() {
        if (this.isBound) return;
        this.obs.version++;
        this.v = s.astEvaluate(this.St, this.scope, this, this);
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

s.connectable(ComputedWatcher);

s.connectable(ExpressionWatcher);

St(true)(ExpressionWatcher);

const we = X("ILifecycleHooks");

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
        const s = new Set;
        let i = e.prototype;
        while (i !== w) {
            for (const t of B(i)) if ("constructor" !== t && !t.startsWith("_")) s.add(t);
            i = Object.getPrototypeOf(i);
        }
        return new LifecycleHooksDefinition(e, s);
    }
    register(t) {
        K(we, this.Type).register(t);
    }
}

const be = new WeakMap;

const ye = f("lifecycle-hooks");

const ke = A({
    name: ye,
    define(t, e) {
        const s = LifecycleHooksDefinition.create(t, e);
        a(ye, s, e);
        p(e, ye);
        return s.Type;
    },
    resolve(t) {
        let e = be.get(t);
        if (void 0 === e) {
            be.set(t, e = new LifecycleHooksLookupImpl);
            const s = t.root;
            const i = s.id === t.id ? t.getAll(we) : t.has(we, false) ? s.getAll(we).concat(t.getAll(we)) : s.getAll(we);
            let n;
            let r;
            let o;
            let h;
            let a;
            for (n of i) {
                r = l(ye, n.constructor);
                o = new LifecycleHooksEntry(r, n);
                for (h of r.propertyNames) {
                    a = e[h];
                    if (void 0 === a) e[h] = [ o ]; else a.push(o);
                }
            }
        }
        return e;
    }
});

class LifecycleHooksLookupImpl {}

function Ae() {
    return function t(e) {
        return ke.define({}, e);
    };
}

const Ce = X("IViewFactory");

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
            if ("*" === t) t = ViewFactory.maxCacheSize; else if (P(t)) t = parseInt(t, 10);
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
        let s;
        if (null != e && e.length > 0) {
            s = e.pop();
            return s;
        }
        s = Controller.$view(this, t);
        return s;
    }
}

ViewFactory.maxCacheSize = 65535;

const Be = X("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.Tt ?? (this.Tt = this.Et.getAll(oi, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), b()));
    }
    constructor(t) {
        this.Lt = new WeakMap;
        this.Pt = new WeakMap;
        const e = t.root;
        this.p = (this.Et = e).get(se);
        this.ep = e.get(s.IExpressionParser);
        this.oL = e.get(s.IObserverLocator);
        this._t = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, s) {
        if (false !== t.needsCompile) {
            const i = this.Lt;
            const n = e.get(ri);
            let r = i.get(t);
            if (null == r) i.set(t, r = n.compile(t, e, s)); else e.register(...r.dependencies);
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
        let s = false;
        const i = this.Pt;
        const n = this.p;
        const r = n.document;
        if (i.has(t)) e = i.get(t); else {
            const o = t.template;
            let l;
            if (null === o) e = null; else if (o instanceof n.Node) if ("TEMPLATE" === o.nodeName) {
                e = o.content;
                s = true;
            } else (e = r.createDocumentFragment()).appendChild(o.cloneNode(true)); else {
                l = r.createElement("template");
                if (P(o)) l.innerHTML = o;
                e = l.content;
                s = true;
            }
            i.set(t, e);
        }
        return null == e ? this._t : new FragmentNodeSequence(this.p, s ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
    }
    render(t, e, s, i) {
        const n = s.instructions;
        const r = this.renderers;
        const o = e.length;
        if (e.length !== n.length) throw y(`AUR0757:${o}<>${n.length}`);
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
        if (null != i) {
            c = s.surrogates;
            if ((a = c.length) > 0) {
                h = 0;
                while (a > h) {
                    u = c[h];
                    r[u.type].render(t, i, u, this.p, this.ep, this.oL);
                    ++h;
                }
            }
        }
    }
}

Rendering.inject = [ t.IContainer ];

var Re;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Re || (Re = {}));

const Se = {
    optional: true
};

const Ie = new WeakMap;

class Controller {
    get lifecycleHooks() {
        return this.qt;
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
        return this.$t;
    }
    get viewModel() {
        return this.Ut;
    }
    set viewModel(t) {
        this.Ut = t;
        this.$t = null == t || 2 === this.vmKind ? HooksDefinition.none : new HooksDefinition(t);
    }
    constructor(t, e, s, i, n, r, o) {
        this.container = t;
        this.vmKind = e;
        this.definition = s;
        this.viewFactory = i;
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
        this.qt = null;
        this.state = 0;
        this.Dt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Mt = 0;
        this.Ft = 0;
        this.Ot = 0;
        this.Ut = n;
        this.$t = 2 === e ? HooksDefinition.none : new HooksDefinition(n);
        this.location = o;
        this.r = t.root.get(Be);
    }
    static getCached(t) {
        return Ie.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (void 0 === e) throw y(`AUR0500:${t}`);
        return e;
    }
    static $el(e, s, i, n, r = void 0, o = null) {
        if (Ie.has(s)) return Ie.get(s);
        r = r ?? Gs(s.constructor);
        const l = new Controller(e, 0, r, null, s, i, o);
        const h = e.get(t.optional(Fe));
        if (r.dependencies.length > 0) e.register(...r.dependencies);
        J(e, Fe, new t.InstanceProvider("IHydrationContext", new HydrationContext(l, n, h)));
        Ie.set(s, l);
        if (null == n || false !== n.hydrate) l.hE(n, h);
        return l;
    }
    static $attr(t, e, s, i) {
        if (Ie.has(e)) return Ie.get(e);
        i = i ?? te(e.constructor);
        const n = new Controller(t, 1, i, null, e, s, null);
        if (i.dependencies.length > 0) t.register(...i.dependencies);
        Ie.set(e, n);
        n.Vt();
        return n;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, 2, null, t, null, null, null);
        s.parent = e ?? null;
        s.Nt();
        return s;
    }
    hE(e, i) {
        const n = this.container;
        const r = this.Ut;
        let o = this.definition;
        this.scope = s.Scope.create(r, null, true);
        if (o.watches.length > 0) _e(this, n, o, r);
        Ee(this, o, r);
        if (this.$t.hasDefine) {
            const t = r.define(this, i, o);
            if (void 0 !== t && t !== o) o = CustomElementDefinition.getOrCreate(t);
        }
        this.qt = ke.resolve(n);
        o.register(n);
        if (null !== o.injectable) J(n, o.injectable, new t.InstanceProvider("definition.injectable", r));
        if (null == e || false !== e.hydrate) {
            this.hS(e);
            this.hC();
        }
    }
    hS(t) {
        if (null != this.qt.hydrating) this.qt.hydrating.forEach(Ne, this);
        if (this.$t.hasHydrating) this.Ut.hydrating(this);
        const e = this.jt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: s, isStrictBinding: i, hasSlots: n, containerless: r} = e;
        let o = this.location;
        this.isStrictBinding = i;
        if (null !== (this.hostController = Ws(this.host, Se))) {
            this.host = this.container.root.get(se).document.createElement(this.definition.name);
            if (r && null == o) o = this.location = ks(this.host);
        }
        ps(this.host, Fs, this);
        ps(this.host, this.definition.key, this);
        if (null !== s || n) {
            if (null != o) throw y(`AUR0501`);
            ps(this.shadowRoot = this.host.attachShadow(s ?? Ue), Fs, this);
            ps(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (null != o) {
            ps(o, Fs, this);
            ps(o, this.definition.key, this);
            this.mountTarget = 3;
        } else this.mountTarget = 1;
        this.Ut.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (void 0 !== this.qt.hydrated) this.qt.hydrated.forEach(je, this);
        if (this.$t.hasHydrated) this.Ut.hydrated(this);
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.jt, this.host);
        if (void 0 !== this.qt.created) this.qt.created.forEach(Ve, this);
        if (this.$t.hasCreated) this.Ut.created(this);
    }
    Vt() {
        const t = this.definition;
        const e = this.Ut;
        if (t.watches.length > 0) _e(this, this.container, t, e);
        Ee(this, t, e);
        e.$controller = this;
        this.qt = ke.resolve(this.container);
        if (void 0 !== this.qt.created) this.qt.created.forEach(Ve, this);
        if (this.$t.hasCreated) this.Ut.created(this);
    }
    Nt() {
        this.jt = this.r.compile(this.viewFactory.def, this.container, null);
        this.isStrictBinding = this.jt.isStrictBinding;
        this.r.render(this, (this.nodes = this.r.createNodes(this.jt)).findTargets(), this.jt, void 0);
    }
    activate(e, s, i) {
        switch (this.state) {
          case 0:
          case 8:
            if (!(null === s || s.isActive)) return;
            this.state = 1;
            break;

          case 2:
            return;

          case 32:
            throw y(`AUR0502:${this.name}`);

          default:
            throw y(`AUR0503:${this.name} ${De(this.state)}`);
        }
        this.parent = s;
        switch (this.vmKind) {
          case 0:
            this.scope.parent = i ?? null;
            break;

          case 1:
            this.scope = i ?? null;
            break;

          case 2:
            if (void 0 === i || null === i) throw y(`AUR0504`);
            if (!this.hasLockedScope) this.scope = i;
            break;
        }
        if (this.isStrictBinding) ;
        this.$initiator = e;
        this.Ht();
        let n;
        if (2 !== this.vmKind && null != this.qt.binding) n = t.resolveAll(...this.qt.binding.map(He, this));
        if (this.$t.hasBinding) n = t.resolveAll(n, this.Ut.binding(this.$initiator, this.parent));
        if (T(n)) {
            this.Wt();
            n.then((() => {
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
        let e = 0;
        let s = 0;
        let i;
        if (null !== this.bindings) {
            e = 0;
            s = this.bindings.length;
            while (s > e) {
                this.bindings[e].bind(this.scope);
                ++e;
            }
        }
        if (2 !== this.vmKind && null != this.qt.bound) i = t.resolveAll(...this.qt.bound.map(We, this));
        if (this.$t.hasBound) i = t.resolveAll(i, this.Ut.bound(this.$initiator, this.parent));
        if (T(i)) {
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
                const e = t.has(fe, false) ? t.get(fe) : t.get(de);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case 3:
            this.nodes.insertBefore(this.location);
            break;
        }
        let e = 0;
        let s;
        if (2 !== this.vmKind && null != this.qt.attaching) s = t.resolveAll(...this.qt.attaching.map(ze, this));
        if (this.$t.hasAttaching) s = t.resolveAll(s, this.Ut.attaching(this.$initiator, this.parent));
        if (T(s)) {
            this.Wt();
            this.Ht();
            s.then((() => {
                this.Kt();
            })).catch((t => {
                this.zt(t);
            }));
        }
        if (null !== this.children) for (;e < this.children.length; ++e) void this.children[e].activate(this.$initiator, this, this.scope);
        this.Kt();
    }
    deactivate(e, s) {
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
            throw y(`AUR0505:${this.name} ${De(this.state)}`);
        }
        this.$initiator = e;
        if (e === this) this.Qt();
        let i = 0;
        let n;
        if (null !== this.children) for (i = 0; i < this.children.length; ++i) void this.children[i].deactivate(e, this);
        if (2 !== this.vmKind && null != this.qt.detaching) n = t.resolveAll(...this.qt.detaching.map(Xe, this));
        if (this.$t.hasDetaching) n = t.resolveAll(n, this.Ut.detaching(this.$initiator, this.parent));
        if (T(n)) {
            this.Wt();
            e.Qt();
            n.then((() => {
                e.Yt();
            })).catch((t => {
                e.zt(t);
            }));
        }
        if (null === e.head) e.head = this; else e.tail.next = this;
        e.tail = this;
        if (e !== this) return;
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
            Qe = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            Qe();
            Qe = void 0;
        }
    }
    zt(t) {
        if (void 0 !== this.$promise) {
            Ye = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            Ye(t);
            Ye = void 0;
        }
        if (this.$initiator !== this) this.parent.zt(t);
    }
    Ht() {
        ++this.Mt;
        if (this.$initiator !== this) this.parent.Ht();
    }
    Kt() {
        if (0 === --this.Mt) {
            if (2 !== this.vmKind && null != this.qt.attached) Ze = t.resolveAll(...this.qt.attached.map(Ge, this));
            if (this.$t.hasAttached) Ze = t.resolveAll(Ze, this.Ut.attached(this.$initiator));
            if (T(Ze)) {
                this.Wt();
                Ze.then((() => {
                    this.state = 2;
                    this.Zt();
                    if (this.$initiator !== this) this.parent.Kt();
                })).catch((t => {
                    this.zt(t);
                }));
                Ze = void 0;
                return;
            }
            Ze = void 0;
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
            let e = this.$initiator.head;
            let s;
            while (null !== e) {
                if (e !== this) {
                    if (e.debug) e.logger.trace(`detach()`);
                    e.removeNodes();
                }
                if (2 !== e.vmKind && null != e.qt.unbinding) s = t.resolveAll(...e.qt.unbinding.map(Ke, this));
                if (e.$t.hasUnbinding) {
                    if (e.debug) e.logger.trace("unbinding()");
                    s = t.resolveAll(s, e.viewModel.unbinding(e.$initiator, e.parent));
                }
                if (T(s)) {
                    this.Wt();
                    this.Jt();
                    s.then((() => {
                        this.te();
                    })).catch((t => {
                        this.zt(t);
                    }));
                }
                s = void 0;
                e = e.next;
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
            return te(this.Ut.constructor).name === t;

          case 0:
            return Gs(this.Ut.constructor).name === t;

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
            ps(t, Fs, this);
            ps(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (0 === this.vmKind) {
            ps(t, Fs, this);
            ps(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (0 === this.vmKind) {
            ps(t, Fs, this);
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
        if (this.$t.hasDispose) this.Ut.dispose();
        if (null !== this.children) {
            this.children.forEach(Oe);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (null !== this.Ut) {
            Ie.delete(this.Ut);
            this.Ut = null;
        }
        this.Ut = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(t) {
        if (true === t(this)) return true;
        if (this.$t.hasAccept && true === this.Ut.accept(t)) return true;
        if (null !== this.children) {
            const {children: e} = this;
            for (let s = 0, i = e.length; s < i; ++s) if (true === e[s].accept(t)) return true;
        }
    }
}

function Te(t) {
    let e = t.$observers;
    if (void 0 === e) Reflect.defineProperty(t, "$observers", {
        enumerable: false,
        value: e = {}
    });
    return e;
}

function Ee(t, e, i) {
    const n = e.bindables;
    const r = B(n);
    const o = r.length;
    if (o > 0) {
        let e;
        let l;
        let h = 0;
        const a = Te(i);
        const c = t.container;
        const u = c.has(s.ICoercionConfiguration, true) ? c.get(s.ICoercionConfiguration) : null;
        for (;h < o; ++h) {
            e = r[h];
            if (void 0 === a[e]) {
                l = n[e];
                a[e] = new BindableObserver(i, e, l.callback, l.set, t, u);
            }
        }
    }
}

const Le = new Map;

const Pe = t => {
    let e = Le.get(t);
    if (null == e) {
        e = new s.AccessScopeExpression(t, 0);
        Le.set(t, e);
    }
    return e;
};

function _e(t, e, i, n) {
    const r = e.get(s.IObserverLocator);
    const o = e.get(s.IExpressionParser);
    const l = i.watches;
    const h = 0 === t.vmKind ? t.scope : s.Scope.create(n, null, true);
    const a = l.length;
    let c;
    let u;
    let f;
    let d = 0;
    for (;a > d; ++d) {
        ({expression: c, callback: u} = l[d]);
        u = L(u) ? u : Reflect.get(n, u);
        if (!L(u)) throw y(`AUR0506:${v(u)}`);
        if (L(c)) t.addBinding(new ComputedWatcher(n, r, c, u, true)); else {
            f = P(c) ? o.parse(c, 16) : Pe(c);
            t.addBinding(new ExpressionWatcher(h, e, r, f, u));
        }
    }
}

function qe(t) {
    return t instanceof Controller && 0 === t.vmKind;
}

function $e(t) {
    return e.isObject(t) && Hs(t.constructor);
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

const Ue = {
    mode: "open"
};

exports.ViewModelKind = void 0;

(function(t) {
    t[t["customElement"] = 0] = "customElement";
    t[t["customAttribute"] = 1] = "customAttribute";
    t[t["synthetic"] = 2] = "synthetic";
})(exports.ViewModelKind || (exports.ViewModelKind = {}));

exports.State = void 0;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["activating"] = 1] = "activating";
    t[t["activated"] = 2] = "activated";
    t[t["deactivating"] = 4] = "deactivating";
    t[t["deactivated"] = 8] = "deactivated";
    t[t["released"] = 16] = "released";
    t[t["disposed"] = 32] = "disposed";
})(exports.State || (exports.State = {}));

function De(t) {
    const e = [];
    if (1 === (1 & t)) e.push("activating");
    if (2 === (2 & t)) e.push("activated");
    if (4 === (4 & t)) e.push("deactivating");
    if (8 === (8 & t)) e.push("deactivated");
    if (16 === (16 & t)) e.push("released");
    if (32 === (32 & t)) e.push("disposed");
    return 0 === e.length ? "none" : e.join("|");
}

const Me = X("IController");

const Fe = X("IHydrationContext");

class HydrationContext {
    constructor(t, e, s) {
        this.instruction = e;
        this.parent = s;
        this.controller = t;
    }
}

function Oe(t) {
    t.dispose();
}

function Ve(t) {
    t.instance.created(this.Ut, this);
}

function Ne(t) {
    t.instance.hydrating(this.Ut, this);
}

function je(t) {
    t.instance.hydrated(this.Ut, this);
}

function He(t) {
    return t.instance.binding(this.Ut, this["$initiator"], this.parent);
}

function We(t) {
    return t.instance.bound(this.Ut, this["$initiator"], this.parent);
}

function ze(t) {
    return t.instance.attaching(this.Ut, this["$initiator"], this.parent);
}

function Ge(t) {
    return t.instance.attached(this.Ut, this["$initiator"]);
}

function Xe(t) {
    return t.instance.detaching(this.Ut, this["$initiator"], this.parent);
}

function Ke(t) {
    return t.instance.unbinding(this.Ut, this["$initiator"], this.parent);
}

let Qe;

let Ye;

let Ze;

const Je = X("IAppRoot");

class AppRoot {
    constructor(e, s, i, n) {
        this.config = e;
        this.platform = s;
        this.container = i;
        this.controller = void 0;
        this.ee = void 0;
        this.host = e.host;
        n.prepare(this);
        J(i, s.HTMLElement, J(i, s.Element, J(i, xs, new t.InstanceProvider("ElementResolver", e.host))));
        this.ee = t.onResolve(this.se("creating"), (() => {
            const s = e.component;
            const n = i.createChild();
            let r;
            if (Hs(s)) r = this.container.get(s); else r = e.component;
            const o = {
                hydrate: false,
                projections: null
            };
            const l = this.controller = Controller.$el(n, r, this.host, o);
            l.hE(o, null);
            return t.onResolve(this.se("hydrating"), (() => {
                l.hS(null);
                return t.onResolve(this.se("hydrated"), (() => {
                    l.hC();
                    this.ee = void 0;
                }));
            }));
        }));
    }
    activate() {
        return t.onResolve(this.ee, (() => t.onResolve(this.se("activating"), (() => t.onResolve(this.controller.activate(this.controller, null, void 0), (() => this.se("activated")))))));
    }
    deactivate() {
        return t.onResolve(this.se("deactivating"), (() => t.onResolve(this.controller.deactivate(this.controller, null), (() => this.se("deactivated")))));
    }
    se(e) {
        return t.resolveAll(...this.container.getAll(Ft).reduce(((t, s) => {
            if (s.slot === e) t.push(s.run());
            return t;
        }), []));
    }
    dispose() {
        this.controller?.dispose();
    }
}

const ts = "au-start";

const es = "au-end";

const ss = (t, e) => t.document.createElement(e);

const is = (t, e) => t.document.createComment(e);

const ns = t => {
    const e = is(t, es);
    e.$start = is(t, ts);
    return e;
};

const rs = (t, e) => t.document.createTextNode(e);

const os = (t, e, s) => t.insertBefore(e, s);

const ls = (t, e, s) => {
    if (null === t) return;
    const i = s.length;
    let n = 0;
    while (i > n) {
        t.insertBefore(s[n], e);
        ++n;
    }
};

const hs = t => t.previousSibling;

const as = (t, e) => t.content.appendChild(e);

const cs = (t, e) => {
    const s = e.length;
    let i = 0;
    while (s > i) {
        t.content.appendChild(e[i]);
        ++i;
    }
};

const us = t => {
    const e = t.previousSibling;
    let s;
    if (8 === e?.nodeType && "au-end" === e.textContent) {
        s = e;
        if (null == (s.$start = s.previousSibling)) throw fs();
        t.parentNode?.removeChild(t);
        return s;
    } else throw fs();
};

const fs = () => y(`AURxxxx`);

class Refs {}

function ds(t, e) {
    return t.$au?.[e] ?? null;
}

function ps(t, e, s) {
    var i;
    ((i = t).$au ?? (i.$au = new Refs))[e] = s;
}

const xs = X("INode");

const ms = X("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(Je, true)) return t.get(Je).host;
    return t.get(se).document;
}))));

const gs = X("IRenderLocation");

const vs = X("CssModules");

const ws = new WeakMap;

function bs(t) {
    if (ws.has(t)) return ws.get(t);
    let e = 0;
    let s = t.nextSibling;
    while (null !== s) {
        if (8 === s.nodeType) switch (s.textContent) {
          case "au-start":
            ++e;
            break;

          case "au-end":
            if (0 === e--) return s;
        }
        s = s.nextSibling;
    }
    if (null === t.parentNode && 11 === t.nodeType) {
        const e = Ws(t);
        if (void 0 === e) return null;
        if (2 === e.mountTarget) return bs(e.host);
    }
    return t.parentNode;
}

function ys(t, e) {
    if (void 0 !== t.platform && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) ws.set(s[t], e);
    } else ws.set(t, e);
}

function ks(t) {
    if (As(t)) return t;
    const e = t.ownerDocument.createComment("au-end");
    const s = e.$start = t.ownerDocument.createComment("au-start");
    const i = t.parentNode;
    if (null !== i) {
        i.replaceChild(e, t);
        i.insertBefore(s, e);
    }
    return e;
}

function As(t) {
    return "au-end" === t.textContent;
}

class FragmentNodeSequence {
    get firstChild() {
        return this.ie;
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
        const s = e.querySelectorAll(".au");
        let i = 0;
        let n = s.length;
        let r;
        let o = this.t = Array(n);
        while (n > i) {
            r = s[i];
            if ("AU-M" === r.nodeName) o[i] = us(r); else o[i] = r;
            ++i;
        }
        const l = e.childNodes;
        const h = this.childNodes = Array(n = l.length);
        i = 0;
        while (n > i) {
            h[i] = l[i];
            ++i;
        }
        this.ie = e.firstChild;
        this.ne = e.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(t) {
        if (this.oe && !!this.ref) this.addToLinked(); else {
            const e = t.parentNode;
            if (this.re) {
                let s = this.ie;
                let i;
                const n = this.ne;
                while (null != s) {
                    i = s.nextSibling;
                    e.insertBefore(s, t);
                    if (s === n) break;
                    s = i;
                }
            } else {
                this.re = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.re) {
            let e = this.ie;
            let s;
            const i = this.ne;
            while (null != e) {
                s = e.nextSibling;
                t.appendChild(e);
                if (e === i) break;
                e = s;
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
            let s;
            let i = this.ie;
            while (null !== i) {
                s = i.nextSibling;
                t.appendChild(i);
                if (i === e) break;
                i = s;
            }
        }
    }
    addToLinked() {
        const t = this.ref;
        const e = t.parentNode;
        if (this.re) {
            let s = this.ie;
            let i;
            const n = this.ne;
            while (null != s) {
                i = s.nextSibling;
                e.insertBefore(s, t);
                if (s === n) break;
                s = i;
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
        if (As(t)) this.ref = t; else {
            this.next = t;
            this.le();
        }
    }
    le() {
        if (void 0 !== this.next) this.ref = this.next.firstChild; else this.ref = void 0;
    }
}

const Cs = X("IWindow", (t => t.callback((t => t.get(se).window))));

const Bs = X("ILocation", (t => t.callback((t => t.get(Cs).location))));

const Rs = X("IHistory", (t => t.callback((t => t.get(Cs).history))));

function Ss(t) {
    return function(e) {
        return js(t, e);
    };
}

function Is(t) {
    if (void 0 === t) return function(t) {
        Ns(t, "shadowOptions", {
            mode: "open"
        });
    };
    if (!L(t)) return function(e) {
        Ns(e, "shadowOptions", t);
    };
    Ns(t, "shadowOptions", {
        mode: "open"
    });
}

function Ts(t) {
    if (void 0 === t) return function(t) {
        Es(t);
    };
    Es(t);
}

function Es(t) {
    const e = l(Fs, t);
    if (void 0 === e) {
        Ns(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

function Ls(t) {
    if (void 0 === t) return function(t) {
        Ns(t, "isStrictBinding", true);
    };
    Ns(t, "isStrictBinding", true);
}

const Ps = new WeakMap;

class CustomElementDefinition {
    get type() {
        return 1;
    }
    constructor(t, e, s, i, n, r, o, l, h, a, c, u, f, d, p, x, m, g, v, w) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
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
        this.isStrictBinding = p;
        this.shadowOptions = x;
        this.hasSlots = m;
        this.enhance = g;
        this.watches = v;
        this.processContent = w;
    }
    static create(e, s = null) {
        if (null === s) {
            const i = e;
            if (P(i)) throw y(`AUR0761:${e}`);
            const n = t.fromDefinitionOrDefault("name", i, Vs);
            if (L(i.Type)) s = i.Type; else s = Ks(t.pascalCase(n));
            return new CustomElementDefinition(s, n, t.mergeArrays(i.aliases), t.fromDefinitionOrDefault("key", i, (() => Os(n))), t.fromDefinitionOrDefault("cache", i, qs), t.fromDefinitionOrDefault("capture", i, Us), t.fromDefinitionOrDefault("template", i, $s), t.mergeArrays(i.instructions), t.mergeArrays(i.dependencies), t.fromDefinitionOrDefault("injectable", i, $s), t.fromDefinitionOrDefault("needsCompile", i, Ds), t.mergeArrays(i.surrogates), V.from(s, i.bindables), t.fromDefinitionOrDefault("containerless", i, Us), t.fromDefinitionOrDefault("isStrictBinding", i, Us), t.fromDefinitionOrDefault("shadowOptions", i, $s), t.fromDefinitionOrDefault("hasSlots", i, Us), t.fromDefinitionOrDefault("enhance", i, Us), t.fromDefinitionOrDefault("watches", i, Ms), t.fromAnnotationOrTypeOrDefault("processContent", s, $s));
        }
        if (P(e)) return new CustomElementDefinition(s, e, t.mergeArrays(zs(s, "aliases"), s.aliases), Os(e), t.fromAnnotationOrTypeOrDefault("cache", s, qs), t.fromAnnotationOrTypeOrDefault("capture", s, Us), t.fromAnnotationOrTypeOrDefault("template", s, $s), t.mergeArrays(zs(s, "instructions"), s.instructions), t.mergeArrays(zs(s, "dependencies"), s.dependencies), t.fromAnnotationOrTypeOrDefault("injectable", s, $s), t.fromAnnotationOrTypeOrDefault("needsCompile", s, Ds), t.mergeArrays(zs(s, "surrogates"), s.surrogates), V.from(s, ...V.getAll(s), zs(s, "bindables"), s.bindables), t.fromAnnotationOrTypeOrDefault("containerless", s, Us), t.fromAnnotationOrTypeOrDefault("isStrictBinding", s, Us), t.fromAnnotationOrTypeOrDefault("shadowOptions", s, $s), t.fromAnnotationOrTypeOrDefault("hasSlots", s, Us), t.fromAnnotationOrTypeOrDefault("enhance", s, Us), t.mergeArrays(Wt.getAnnotation(s), s.watches), t.fromAnnotationOrTypeOrDefault("processContent", s, $s));
        const i = t.fromDefinitionOrDefault("name", e, Vs);
        return new CustomElementDefinition(s, i, t.mergeArrays(zs(s, "aliases"), e.aliases, s.aliases), Os(i), t.fromAnnotationOrDefinitionOrTypeOrDefault("cache", e, s, qs), t.fromAnnotationOrDefinitionOrTypeOrDefault("capture", e, s, Us), t.fromAnnotationOrDefinitionOrTypeOrDefault("template", e, s, $s), t.mergeArrays(zs(s, "instructions"), e.instructions, s.instructions), t.mergeArrays(zs(s, "dependencies"), e.dependencies, s.dependencies), t.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", e, s, $s), t.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", e, s, Ds), t.mergeArrays(zs(s, "surrogates"), e.surrogates, s.surrogates), V.from(s, ...V.getAll(s), zs(s, "bindables"), s.bindables, e.bindables), t.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", e, s, Us), t.fromAnnotationOrDefinitionOrTypeOrDefault("isStrictBinding", e, s, Us), t.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", e, s, $s), t.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", e, s, Us), t.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", e, s, Us), t.mergeArrays(e.watches, Wt.getAnnotation(s), s.watches), t.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", e, s, $s));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) return t;
        if (Ps.has(t)) return Ps.get(t);
        const e = CustomElementDefinition.create(t);
        Ps.set(t, e);
        a(Fs, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        if (!t.has(s, false)) {
            Z(s, e).register(t);
            Q(s, e).register(t);
            et(i, Qs, s, t);
        }
    }
}

const _s = {
    name: void 0,
    searchParents: false,
    optional: false
};

const qs = () => 0;

const $s = () => null;

const Us = () => false;

const Ds = () => true;

const Ms = () => t.emptyArray;

const Fs = d("custom-element");

const Os = t => `${Fs}:${t}`;

const Vs = (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const Ns = (t, e, s) => {
    a(f(e), s, t);
};

const js = (t, e) => {
    const s = CustomElementDefinition.create(t, e);
    a(Fs, s, s.Type);
    a(Fs, s, s);
    p(s.Type, Fs);
    return s.Type;
};

const Hs = t => L(t) && h(Fs, t);

const Ws = (t, e = _s) => {
    if (void 0 === e.name && true !== e.searchParents) {
        const s = ds(t, Fs);
        if (null === s) {
            if (true === e.optional) return null;
            throw y(`AUR0762`);
        }
        return s;
    }
    if (void 0 !== e.name) {
        if (true !== e.searchParents) {
            const s = ds(t, Fs);
            if (null === s) throw y(`AUR0763`);
            if (s.is(e.name)) return s;
            return;
        }
        let s = t;
        let i = false;
        while (null !== s) {
            const t = ds(s, Fs);
            if (null !== t) {
                i = true;
                if (t.is(e.name)) return t;
            }
            s = bs(s);
        }
        if (i) return;
        throw y(`AUR0764`);
    }
    let s = t;
    while (null !== s) {
        const t = ds(s, Fs);
        if (null !== t) return t;
        s = bs(s);
    }
    throw y(`AUR0765`);
};

const zs = (t, e) => l(f(e), t);

const Gs = t => {
    const e = l(Fs, t);
    if (void 0 === e) throw y(`AUR0760:${t.name}`);
    return e;
};

const Xs = () => {
    const e = function(s, i, n) {
        const r = t.DI.getOrCreateAnnotationParamTypes(s);
        r[n] = e;
        return s;
    };
    e.register = function(t) {
        return {
            resolve(t, s) {
                if (s.has(e, true)) return s.get(e); else return null;
            }
        };
    };
    return e;
};

const Ks = function() {
    const t = {
        value: "",
        writable: false,
        enumerable: false,
        configurable: true
    };
    const e = {};
    return function(s, i = e) {
        const n = class {};
        t.value = s;
        Reflect.defineProperty(n, "name", t);
        if (i !== e) C(n.prototype, i);
        return n;
    };
}();

const Qs = A({
    name: Fs,
    keyFrom: Os,
    isType: Hs,
    for: Ws,
    define: js,
    getDefinition: Gs,
    annotate: Ns,
    getAnnotation: zs,
    generateName: Vs,
    createInjectable: Xs,
    generateType: Ks
});

const Ys = f("processContent");

function Zs(t) {
    return void 0 === t ? function(t, e, s) {
        a(Ys, Js(t, e), t);
    } : function(e) {
        t = Js(e, t);
        const s = l(Fs, e);
        if (void 0 !== s) s.processContent = t; else a(Ys, t, e);
        return e;
    };
}

function Js(t, e) {
    if (P(e)) e = t[e];
    if (!L(e)) throw y(`AUR0766:${typeof e}`);
    return e;
}

function ti(t) {
    return function(e) {
        const s = L(t) ? t : true;
        Ns(e, "capture", s);
        if (Hs(e)) Gs(e).capture = s;
    };
}

const ei = X("IProjections");

const si = X("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

exports.InstructionType = void 0;

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
})(exports.InstructionType || (exports.InstructionType = {}));

const ii = X("Instruction");

function ni(t) {
    const e = t.type;
    return P(e) && 2 === e.length;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = "rf";
    }
}

class PropertyBindingInstruction {
    constructor(t, e, s) {
        this.from = t;
        this.to = e;
        this.mode = s;
        this.type = "rg";
    }
}

class IteratorBindingInstruction {
    constructor(t, e, s) {
        this.forOf = t;
        this.to = e;
        this.props = s;
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
    constructor(t, e, s) {
        this.value = t;
        this.to = e;
        this.command = s;
        this.type = "rl";
    }
}

class HydrateElementInstruction {
    constructor(t, e, s, i, n, r) {
        this.res = t;
        this.alias = e;
        this.props = s;
        this.projections = i;
        this.containerless = n;
        this.captures = r;
        this.type = "ra";
        this.auSlot = null;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, s) {
        this.res = t;
        this.alias = e;
        this.props = s;
        this.type = "rb";
    }
}

class HydrateTemplateController {
    constructor(t, e, s, i) {
        this.def = t;
        this.res = e;
        this.alias = s;
        this.props = i;
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
    constructor(t, e, s, i) {
        this.from = t;
        this.to = e;
        this.preventDefault = s;
        this.capture = i;
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
    constructor(t, e, s) {
        this.attr = t;
        this.from = e;
        this.to = s;
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

const ri = X("ITemplateCompiler");

const oi = X("IRenderer");

function li(t) {
    return function e(s) {
        s.register = function(t) {
            K(oi, this).register(t);
        };
        _(s.prototype, "target", {
            configurable: true,
            get: function() {
                return t;
            }
        });
        return s;
    };
}

function hi(t, e, s) {
    if (P(e)) return t.parse(e, s);
    return e;
}

function ai(t) {
    if (null != t.viewModel) return t.viewModel;
    return t;
}

function ci(t, e) {
    if ("element" === e) return t;
    switch (e) {
      case "controller":
        return Ws(t);

      case "view":
        throw y(`AUR0750`);

      case "view-model":
        return Ws(t).viewModel;

      default:
        {
            const s = Zt(t, e);
            if (void 0 !== s) return s.viewModel;
            const i = Ws(t, {
                name: e
            });
            if (void 0 === i) throw y(`AUR0751:${e}`);
            return i.viewModel;
        }
    }
}

exports.SetPropertyRenderer = class SetPropertyRenderer {
    render(t, e, s) {
        const i = ai(e);
        if (void 0 !== i.$observers?.[s.to]) i.$observers[s.to].setValue(s.value); else i[s.to] = s.value;
    }
};

exports.SetPropertyRenderer = r([ li("re") ], exports.SetPropertyRenderer);

exports.CustomElementRenderer = class CustomElementRenderer {
    static get inject() {
        return [ Be ];
    }
    constructor(t) {
        this.r = t;
    }
    render(e, s, i, n, r, o) {
        let l;
        let h;
        let a;
        let c;
        const u = i.res;
        const f = i.projections;
        const d = e.container;
        switch (typeof u) {
          case "string":
            l = d.find(Qs, u);
            if (null == l) throw y(`AUR0752:${u}@${e["name"]}`);
            break;

          default:
            l = u;
        }
        const p = i.containerless || l.containerless;
        const x = p ? ks(s) : null;
        const m = gi(n, e, s, i, x, null == f ? void 0 : new AuSlotsInfo(R(f)));
        h = l.Type;
        a = m.invoke(h);
        J(m, h, new t.InstanceProvider(l.key, a));
        c = Controller.$el(m, a, s, i, l, x);
        ps(s, l.key, c);
        const g = this.r.renderers;
        const v = i.props;
        const w = v.length;
        let b = 0;
        let k;
        while (w > b) {
            k = v[b];
            g[k.type].render(e, c, k, n, r, o);
            ++b;
        }
        e.addChild(c);
    }
};

exports.CustomElementRenderer = r([ li("ra") ], exports.CustomElementRenderer);

exports.CustomAttributeRenderer = class CustomAttributeRenderer {
    static get inject() {
        return [ Be ];
    }
    constructor(t) {
        this.r = t;
    }
    render(t, e, s, i, n, r) {
        let o = t.container;
        let l;
        switch (typeof s.res) {
          case "string":
            l = o.find(ee, s.res);
            if (null == l) throw y(`AUR0753:${s.res}@${t["name"]}`);
            break;

          default:
            l = s.res;
        }
        const h = vi(i, l, t, e, s, void 0, void 0);
        const a = Controller.$attr(h.ctn, h.vm, e, l);
        ps(e, l.key, a);
        const c = this.r.renderers;
        const u = s.props;
        const f = u.length;
        let d = 0;
        let p;
        while (f > d) {
            p = u[d];
            c[p.type].render(t, a, p, i, n, r);
            ++d;
        }
        t.addChild(a);
    }
};

exports.CustomAttributeRenderer = r([ li("rb") ], exports.CustomAttributeRenderer);

exports.TemplateControllerRenderer = class TemplateControllerRenderer {
    static get inject() {
        return [ Be, se ];
    }
    constructor(t, e) {
        this.r = t;
        this.p = e;
    }
    render(t, e, s, i, n, r) {
        let o = t.container;
        let l;
        switch (typeof s.res) {
          case "string":
            l = o.find(ee, s.res);
            if (null == l) throw y(`AUR0754:${s.res}@${t["name"]}`);
            break;

          default:
            l = s.res;
        }
        const h = this.r.getViewFactory(s.def, o);
        const a = ks(e);
        const c = vi(this.p, l, t, e, s, h, a);
        const u = Controller.$attr(c.ctn, c.vm, e, l);
        ps(a, l.key, u);
        c.vm.link?.(t, u, e, s);
        const f = this.r.renderers;
        const d = s.props;
        const p = d.length;
        let x = 0;
        let m;
        while (p > x) {
            m = d[x];
            f[m.type].render(t, u, m, i, n, r);
            ++x;
        }
        t.addChild(u);
    }
};

exports.TemplateControllerRenderer = r([ li("rc") ], exports.TemplateControllerRenderer);

exports.LetElementRenderer = class LetElementRenderer {
    render(t, e, s, i, n, r) {
        e.remove();
        const o = s.instructions;
        const l = s.toBindingContext;
        const h = t.container;
        const a = o.length;
        let c;
        let u;
        let f = 0;
        while (a > f) {
            c = o[f];
            u = hi(n, c.from, 16);
            t.addBinding(new LetBinding(h, r, u, c.to, l));
            ++f;
        }
    }
};

exports.LetElementRenderer = r([ li("rd") ], exports.LetElementRenderer);

exports.RefBindingRenderer = class RefBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, hi(n, s.from, 16), ci(e, s.to)));
    }
};

exports.RefBindingRenderer = r([ li("rj") ], exports.RefBindingRenderer);

exports.InterpolationBindingRenderer = class InterpolationBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, hi(n, s.from, 1), ai(e), s.to, 2));
    }
};

exports.InterpolationBindingRenderer = r([ li("rf") ], exports.InterpolationBindingRenderer);

exports.PropertyBindingRenderer = class PropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, hi(n, s.from, 16), ai(e), s.to, s.mode));
    }
};

exports.PropertyBindingRenderer = r([ li("rg") ], exports.PropertyBindingRenderer);

exports.IteratorBindingRenderer = class IteratorBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, hi(n, s.forOf, 2), ai(e), s.to, 2));
    }
};

exports.IteratorBindingRenderer = r([ li("rk") ], exports.IteratorBindingRenderer);

exports.TextBindingRenderer = class TextBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, hi(n, s.from, 16), os(e.parentNode, rs(i, ""), e), s.strict));
    }
};

exports.TextBindingRenderer = r([ li("ha") ], exports.TextBindingRenderer);

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, hi(n, s.from, 8), e, s.to, new ListenerBindingOptions(s.preventDefault, s.capture)));
    }
};

exports.ListenerBindingRenderer = r([ li("hb") ], exports.ListenerBindingRenderer);

exports.SetAttributeRenderer = class SetAttributeRenderer {
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
};

exports.SetAttributeRenderer = r([ li("he") ], exports.SetAttributeRenderer);

exports.SetClassAttributeRenderer = class SetClassAttributeRenderer {
    render(t, e, s) {
        ui(e.classList, s.value);
    }
};

exports.SetClassAttributeRenderer = r([ li("hf") ], exports.SetClassAttributeRenderer);

exports.SetStyleAttributeRenderer = class SetStyleAttributeRenderer {
    render(t, e, s) {
        e.style.cssText += s.value;
    }
};

exports.SetStyleAttributeRenderer = r([ li("hg") ], exports.SetStyleAttributeRenderer);

exports.StylePropertyBindingRenderer = class StylePropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, hi(n, s.from, 16), e.style, s.to, 2));
    }
};

exports.StylePropertyBindingRenderer = r([ li("hd") ], exports.StylePropertyBindingRenderer);

exports.AttributeBindingRenderer = class AttributeBindingRenderer {
    render(t, e, s, i, n, r) {
        const o = t.container;
        const l = o.has(vs, false) ? o.get(vs) : null;
        t.addBinding(new AttributeBinding(t, o, r, i.domWriteQueue, hi(n, s.from, 16), e, s.attr, null == l ? s.to : s.to.split(/\s/g).map((t => l[t] ?? t)).join(" "), 2));
    }
};

exports.AttributeBindingRenderer = r([ li("hc") ], exports.AttributeBindingRenderer);

exports.SpreadRenderer = class SpreadRenderer {
    static get inject() {
        return [ ri, Be ];
    }
    constructor(t, e) {
        this.he = t;
        this.r = e;
    }
    render(e, s, i, n, r, o) {
        const l = e.container;
        const h = l.get(Fe);
        const a = this.r.renderers;
        const c = t => {
            let e = t;
            let s = h;
            while (null != s && e > 0) {
                s = s.parent;
                --e;
            }
            if (null == s) throw y("No scope context for spread binding.");
            return s;
        };
        const u = i => {
            const l = c(i);
            const h = fi(l);
            const f = this.he.compileSpread(l.controller.definition, l.instruction?.captures ?? t.emptyArray, l.controller.container, s);
            let d;
            for (d of f) switch (d.type) {
              case "hs":
                u(i + 1);
                break;

              case "hp":
                a[d.instructions.type].render(h, Ws(s), d.instructions, n, r, o);
                break;

              default:
                a[d.type].render(h, s, d, n, r, o);
            }
            e.addBinding(h);
        };
        u(0);
    }
};

exports.SpreadRenderer = r([ li("hs") ], exports.SpreadRenderer);

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
        if (null == e) throw y("Invalid spreading. Context scope is null/undefined");
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
        if (1 !== t.vmKind) throw y("Spread binding does not support spreading custom attributes/template controllers");
        this.ctrl.addChild(t);
    }
    limit() {
        throw y("not implemented");
    }
    useScope() {
        throw y("not implemented");
    }
}

function ui(t, e) {
    const s = e.length;
    let i = 0;
    for (let n = 0; n < s; ++n) if (32 === e.charCodeAt(n)) {
        if (n !== i) t.add(e.slice(i, n));
        i = n + 1;
    } else if (n + 1 === s) t.add(e.slice(i));
}

const fi = t => new SpreadBinding([], t);

const di = "IController";

const pi = "IInstruction";

const xi = "IRenderLocation";

const mi = "IAuSlotsInfo";

function gi(e, s, i, n, r, o) {
    const l = s.container.createChild();
    J(l, e.HTMLElement, J(l, e.Element, J(l, xs, new t.InstanceProvider("ElementResolver", i))));
    J(l, Me, new t.InstanceProvider(di, s));
    J(l, ii, new t.InstanceProvider(pi, n));
    J(l, gs, null == r ? wi : new RenderLocationProvider(r));
    J(l, Ce, bi);
    J(l, si, null == o ? yi : new t.InstanceProvider(mi, o));
    return l;
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
        if (null === t) throw y(`AUR7055`);
        if (!P(t.name) || 0 === t.name.length) throw y(`AUR0756`);
        return t;
    }
}

function vi(e, s, i, n, r, o, l, h) {
    const a = i.container.createChild();
    J(a, e.HTMLElement, J(a, e.Element, J(a, xs, new t.InstanceProvider("ElementResolver", n))));
    i = i instanceof Controller ? i : i.ctrl;
    J(a, Me, new t.InstanceProvider(di, i));
    J(a, ii, new t.InstanceProvider(pi, r));
    J(a, gs, null == l ? wi : new t.InstanceProvider(xi, l));
    J(a, Ce, null == o ? bi : new ViewFactoryProvider(o));
    J(a, si, null == h ? yi : new t.InstanceProvider(mi, h));
    return {
        vm: a.invoke(s.Type),
        ctn: a
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

const wi = new RenderLocationProvider(null);

const bi = new ViewFactoryProvider(null);

const yi = new t.InstanceProvider(mi, new AuSlotsInfo(t.emptyArray));

exports.CommandType = void 0;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(exports.CommandType || (exports.CommandType = {}));

function ki(t) {
    return function(e) {
        return Ri.define(t, e);
    };
}

class BindingCommandDefinition {
    constructor(t, e, s, i, n) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
        this.type = n;
    }
    static create(e, s) {
        let i;
        let n;
        if (P(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new BindingCommandDefinition(s, t.firstDefined(Bi(s, "name"), i), t.mergeArrays(Bi(s, "aliases"), n.aliases, s.aliases), Ci(i), t.firstDefined(Bi(s, "type"), n.type, s.type, null));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        K(s, e).register(t);
        Q(s, e).register(t);
        et(i, Ri, s, t);
    }
}

const Ai = d("binding-command");

const Ci = t => `${Ai}:${t}`;

const Bi = (t, e) => l(f(e), t);

const Ri = A({
    name: Ai,
    keyFrom: Ci,
    define(t, e) {
        const s = BindingCommandDefinition.create(t, e);
        a(Ai, s, s.Type);
        a(Ai, s, s);
        p(e, Ai);
        return s.Type;
    },
    getAnnotation: Bi
});

exports.OneTimeBindingCommand = class OneTimeBindingCommand {
    get type() {
        return 0;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let o = e.attr.rawValue;
        if (null == e.bindable) r = i.map(e.node, r) ?? t.camelCase(r); else {
            if ("" === o && 1 === e.def.type) o = t.camelCase(r);
            r = e.bindable.property;
        }
        return new PropertyBindingInstruction(s.parse(o, 16), r, 1);
    }
};

exports.OneTimeBindingCommand = r([ ki("one-time") ], exports.OneTimeBindingCommand);

exports.ToViewBindingCommand = class ToViewBindingCommand {
    get type() {
        return 0;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let o = e.attr.rawValue;
        if (null == e.bindable) r = i.map(e.node, r) ?? t.camelCase(r); else {
            if ("" === o && 1 === e.def.type) o = t.camelCase(r);
            r = e.bindable.property;
        }
        return new PropertyBindingInstruction(s.parse(o, 16), r, 2);
    }
};

exports.ToViewBindingCommand = r([ ki("to-view") ], exports.ToViewBindingCommand);

exports.FromViewBindingCommand = class FromViewBindingCommand {
    get type() {
        return 0;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let o = n.rawValue;
        if (null == e.bindable) r = i.map(e.node, r) ?? t.camelCase(r); else {
            if ("" === o && 1 === e.def.type) o = t.camelCase(r);
            r = e.bindable.property;
        }
        return new PropertyBindingInstruction(s.parse(o, 16), r, 4);
    }
};

exports.FromViewBindingCommand = r([ ki("from-view") ], exports.FromViewBindingCommand);

exports.TwoWayBindingCommand = class TwoWayBindingCommand {
    get type() {
        return 0;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let o = n.rawValue;
        if (null == e.bindable) r = i.map(e.node, r) ?? t.camelCase(r); else {
            if ("" === o && 1 === e.def.type) o = t.camelCase(r);
            r = e.bindable.property;
        }
        return new PropertyBindingInstruction(s.parse(o, 16), r, 6);
    }
};

exports.TwoWayBindingCommand = r([ ki("two-way") ], exports.TwoWayBindingCommand);

exports.DefaultBindingCommand = class DefaultBindingCommand {
    get type() {
        return 0;
    }
    build(e, s, i) {
        const n = e.attr;
        const r = e.bindable;
        let o;
        let l;
        let h = n.target;
        let a = n.rawValue;
        if (null == r) {
            l = i.isTwoWay(e.node, h) ? 6 : 2;
            h = i.map(e.node, h) ?? t.camelCase(h);
        } else {
            if ("" === a && 1 === e.def.type) a = t.camelCase(h);
            o = e.def.defaultBindingMode;
            l = 8 === r.mode || null == r.mode ? null == o || 8 === o ? 2 : o : r.mode;
            h = r.property;
        }
        return new PropertyBindingInstruction(s.parse(a, 16), h, l);
    }
};

exports.DefaultBindingCommand = r([ ki("bind") ], exports.DefaultBindingCommand);

exports.ForBindingCommand = class ForBindingCommand {
    get type() {
        return 0;
    }
    static get inject() {
        return [ ot ];
    }
    constructor(t) {
        this.ue = t;
    }
    build(e, s) {
        const i = null === e.bindable ? t.camelCase(e.attr.target) : e.bindable.property;
        const n = s.parse(e.attr.rawValue, 2);
        let r = t.emptyArray;
        if (n.semiIdx > -1) {
            const t = e.attr.rawValue.slice(n.semiIdx + 1);
            const s = t.indexOf(":");
            if (s > -1) {
                const e = t.slice(0, s).trim();
                const i = t.slice(s + 1).trim();
                const n = this.ue.parse(e, i);
                r = [ new MultiAttrInstruction(i, n.target, n.command) ];
            }
        }
        return new IteratorBindingInstruction(n, i, r);
    }
};

exports.ForBindingCommand = r([ ki("for") ], exports.ForBindingCommand);

exports.TriggerBindingCommand = class TriggerBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, true, false);
    }
};

exports.TriggerBindingCommand = r([ ki("trigger") ], exports.TriggerBindingCommand);

exports.CaptureBindingCommand = class CaptureBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false, true);
    }
};

exports.CaptureBindingCommand = r([ ki("capture") ], exports.CaptureBindingCommand);

exports.AttrBindingCommand = class AttrBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

exports.AttrBindingCommand = r([ ki("attr") ], exports.AttrBindingCommand);

exports.StyleBindingCommand = class StyleBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

exports.StyleBindingCommand = r([ ki("style") ], exports.StyleBindingCommand);

exports.ClassBindingCommand = class ClassBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

exports.ClassBindingCommand = r([ ki("class") ], exports.ClassBindingCommand);

let Si = class RefBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Si = r([ ki("ref") ], Si);

let Ii = class SpreadBindingCommand {
    get type() {
        return 1;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

Ii = r([ ki("...$attrs") ], Ii);

const Ti = X("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

const Ei = t => {
    const e = b();
    t = P(t) ? t.split(" ") : t;
    let s;
    for (s of t) e[s] = true;
    return e;
};

class NoopSVGAnalyzer {
    isStandardSvgAttribute(t, e) {
        return false;
    }
}

class SVGAnalyzer {
    static register(t) {
        return K(Ti, this).register(t);
    }
    constructor(t) {
        this.fe = C(b(), {
            a: Ei("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage target transform xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            altGlyph: Ei("class dx dy externalResourcesRequired format glyphRef id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            altglyph: b(),
            altGlyphDef: Ei("id xml:base xml:lang xml:space"),
            altglyphdef: b(),
            altGlyphItem: Ei("id xml:base xml:lang xml:space"),
            altglyphitem: b(),
            animate: Ei("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateColor: Ei("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateMotion: Ei("accumulate additive begin by calcMode dur end externalResourcesRequired fill from id keyPoints keySplines keyTimes max min onbegin onend onload onrepeat origin path repeatCount repeatDur requiredExtensions requiredFeatures restart rotate systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateTransform: Ei("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to type values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            circle: Ei("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup r requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            clipPath: Ei("class clipPathUnits externalResourcesRequired id requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            "color-profile": Ei("id local name rendering-intent xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            cursor: Ei("externalResourcesRequired id requiredExtensions requiredFeatures systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            defs: Ei("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            desc: Ei("class id style xml:base xml:lang xml:space"),
            ellipse: Ei("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform xml:base xml:lang xml:space"),
            feBlend: Ei("class height id in in2 mode result style width x xml:base xml:lang xml:space y"),
            feColorMatrix: Ei("class height id in result style type values width x xml:base xml:lang xml:space y"),
            feComponentTransfer: Ei("class height id in result style width x xml:base xml:lang xml:space y"),
            feComposite: Ei("class height id in in2 k1 k2 k3 k4 operator result style width x xml:base xml:lang xml:space y"),
            feConvolveMatrix: Ei("bias class divisor edgeMode height id in kernelMatrix kernelUnitLength order preserveAlpha result style targetX targetY width x xml:base xml:lang xml:space y"),
            feDiffuseLighting: Ei("class diffuseConstant height id in kernelUnitLength result style surfaceScale width x xml:base xml:lang xml:space y"),
            feDisplacementMap: Ei("class height id in in2 result scale style width x xChannelSelector xml:base xml:lang xml:space y yChannelSelector"),
            feDistantLight: Ei("azimuth elevation id xml:base xml:lang xml:space"),
            feFlood: Ei("class height id result style width x xml:base xml:lang xml:space y"),
            feFuncA: Ei("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncB: Ei("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncG: Ei("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncR: Ei("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feGaussianBlur: Ei("class height id in result stdDeviation style width x xml:base xml:lang xml:space y"),
            feImage: Ei("class externalResourcesRequired height id preserveAspectRatio result style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            feMerge: Ei("class height id result style width x xml:base xml:lang xml:space y"),
            feMergeNode: Ei("id xml:base xml:lang xml:space"),
            feMorphology: Ei("class height id in operator radius result style width x xml:base xml:lang xml:space y"),
            feOffset: Ei("class dx dy height id in result style width x xml:base xml:lang xml:space y"),
            fePointLight: Ei("id x xml:base xml:lang xml:space y z"),
            feSpecularLighting: Ei("class height id in kernelUnitLength result specularConstant specularExponent style surfaceScale width x xml:base xml:lang xml:space y"),
            feSpotLight: Ei("id limitingConeAngle pointsAtX pointsAtY pointsAtZ specularExponent x xml:base xml:lang xml:space y z"),
            feTile: Ei("class height id in result style width x xml:base xml:lang xml:space y"),
            feTurbulence: Ei("baseFrequency class height id numOctaves result seed stitchTiles style type width x xml:base xml:lang xml:space y"),
            filter: Ei("class externalResourcesRequired filterRes filterUnits height id primitiveUnits style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            font: Ei("class externalResourcesRequired horiz-adv-x horiz-origin-x horiz-origin-y id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            "font-face": Ei("accent-height alphabetic ascent bbox cap-height descent font-family font-size font-stretch font-style font-variant font-weight hanging id ideographic mathematical overline-position overline-thickness panose-1 slope stemh stemv strikethrough-position strikethrough-thickness underline-position underline-thickness unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical widths x-height xml:base xml:lang xml:space"),
            "font-face-format": Ei("id string xml:base xml:lang xml:space"),
            "font-face-name": Ei("id name xml:base xml:lang xml:space"),
            "font-face-src": Ei("id xml:base xml:lang xml:space"),
            "font-face-uri": Ei("id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            foreignObject: Ei("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xml:base xml:lang xml:space y"),
            g: Ei("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            glyph: Ei("arabic-form class d glyph-name horiz-adv-x id lang orientation style unicode vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            glyphRef: Ei("class dx dy format glyphRef id style x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            glyphref: b(),
            hkern: Ei("g1 g2 id k u1 u2 xml:base xml:lang xml:space"),
            image: Ei("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            line: Ei("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform x1 x2 xml:base xml:lang xml:space y1 y2"),
            linearGradient: Ei("class externalResourcesRequired gradientTransform gradientUnits id spreadMethod style x1 x2 xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y1 y2"),
            marker: Ei("class externalResourcesRequired id markerHeight markerUnits markerWidth orient preserveAspectRatio refX refY style viewBox xml:base xml:lang xml:space"),
            mask: Ei("class externalResourcesRequired height id maskContentUnits maskUnits requiredExtensions requiredFeatures style systemLanguage width x xml:base xml:lang xml:space y"),
            metadata: Ei("id xml:base xml:lang xml:space"),
            "missing-glyph": Ei("class d horiz-adv-x id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            mpath: Ei("externalResourcesRequired id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            path: Ei("class d externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup pathLength requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            pattern: Ei("class externalResourcesRequired height id patternContentUnits patternTransform patternUnits preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage viewBox width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            polygon: Ei("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            polyline: Ei("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            radialGradient: Ei("class cx cy externalResourcesRequired fx fy gradientTransform gradientUnits id r spreadMethod style xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            rect: Ei("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform width x xml:base xml:lang xml:space y"),
            script: Ei("externalResourcesRequired id type xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            set: Ei("attributeName attributeType begin dur end externalResourcesRequired fill id max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            stop: Ei("class id offset style xml:base xml:lang xml:space"),
            style: Ei("id media title type xml:base xml:lang xml:space"),
            svg: Ei("baseProfile class contentScriptType contentStyleType externalResourcesRequired height id onabort onactivate onclick onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onresize onscroll onunload onzoom preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage version viewBox width x xml:base xml:lang xml:space y zoomAndPan"),
            switch: Ei("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            symbol: Ei("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio style viewBox xml:base xml:lang xml:space"),
            text: Ei("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength transform x xml:base xml:lang xml:space y"),
            textPath: Ei("class externalResourcesRequired id lengthAdjust method onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures spacing startOffset style systemLanguage textLength xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            title: Ei("class id style xml:base xml:lang xml:space"),
            tref: Ei("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y"),
            tspan: Ei("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xml:base xml:lang xml:space y"),
            use: Ei("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            view: Ei("externalResourcesRequired id preserveAspectRatio viewBox viewTarget xml:base xml:lang xml:space zoomAndPan"),
            vkern: Ei("g1 g2 id k u1 u2 xml:base xml:lang xml:space")
        });
        this.de = Ei("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.pe = Ei("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
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
        return true === this.de[t.nodeName] && true === this.pe[e] || true === this.fe[t.nodeName]?.[e];
    }
}

SVGAnalyzer.inject = [ se ];

const Li = X("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    static get inject() {
        return [ Ti ];
    }
    constructor(t) {
        this.svg = t;
        this.fns = [];
        this.xe = b();
        this.me = b();
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
        let s;
        let i;
        let n;
        let r;
        for (n in t) {
            s = t[n];
            i = (e = this.xe)[n] ?? (e[n] = b());
            for (r in s) {
                if (void 0 !== i[r]) throw _i(r, n);
                i[r] = s[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.me;
        for (const s in t) {
            if (void 0 !== e[s]) throw _i(s, "*");
            e[s] = t[s];
        }
    }
    useTwoWay(t) {
        this.fns.push(t);
    }
    isTwoWay(t, e) {
        return Pi(t, e) || this.fns.length > 0 && this.fns.some((s => s(t, e)));
    }
    map(t, e) {
        return this.xe[t.nodeName]?.[e] ?? this.me[e] ?? (I(t, e, this.svg) ? e : null);
    }
}

function Pi(t, e) {
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

function _i(t, e) {
    return y(`Attribute ${t} has been already registered for ${"*" === e ? "all elements" : `<${e}/>`}`);
}

const qi = X("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const $i = {};

class TemplateElementFactory {
    constructor(t) {
        this.p = t;
        this.ge = Ui(this.p);
    }
    createTemplate(t) {
        if (P(t)) {
            let e = $i[t];
            if (void 0 === e) {
                const s = this.ge;
                s.innerHTML = t;
                const i = s.content.firstElementChild;
                if (null == i || "TEMPLATE" !== i.nodeName || null != i.nextElementSibling) {
                    this.ge = Ui(this.p);
                    e = s;
                } else {
                    s.content.removeChild(i);
                    e = i;
                }
                $i[t] = e;
            }
            return e.cloneNode(true);
        }
        if ("TEMPLATE" !== t.nodeName) {
            const e = Ui(this.p);
            e.content.appendChild(t);
            return e;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
    }
}

TemplateElementFactory.inject = [ se ];

const Ui = t => t.document.createElement("template");

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        return K(ri, this).register(t);
    }
    compile(e, s, i) {
        const n = CustomElementDefinition.getOrCreate(e);
        if (null === n.template || void 0 === n.template) return n;
        if (false === n.needsCompile) return n;
        i ?? (i = zi);
        const r = new CompilationContext(e, s, i, null, null, void 0);
        const o = P(n.template) || !e.enhance ? r.ve.createTemplate(n.template) : n.template;
        const l = o.nodeName === Fi && null != o.content;
        const h = l ? o.content : o;
        const a = s.get(G(sn));
        const c = a.length;
        let u = 0;
        if (c > 0) while (c > u) {
            a[u].compiling?.(o);
            ++u;
        }
        if (o.hasAttribute(Ji)) throw y(`AUR0701`);
        this.we(h, r);
        this.be(h, r);
        return CustomElementDefinition.create({
            ...e,
            name: e.name || Vs(),
            dependencies: (e.dependencies ?? t.emptyArray).concat(r.deps ?? t.emptyArray),
            instructions: r.rows,
            surrogates: l ? this.ye(o, r) : t.emptyArray,
            template: o,
            hasSlots: r.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(e, s, i, n) {
        const r = new CompilationContext(e, i, zi, null, null, void 0);
        const o = [];
        const l = r.ke(n.nodeName.toLowerCase());
        const h = null !== l;
        const a = r.ep;
        const c = s.length;
        let u = 0;
        let f;
        let d = null;
        let p;
        let x;
        let m;
        let g;
        let v;
        let w = null;
        let b;
        let k;
        let A;
        let C;
        for (;c > u; ++u) {
            f = s[u];
            A = f.target;
            C = f.rawValue;
            w = r.Ae(f);
            if (null !== w && (1 & w.type) > 0) {
                Xi.node = n;
                Xi.attr = f;
                Xi.bindable = null;
                Xi.def = null;
                o.push(w.build(Xi, r.ep, r.m));
                continue;
            }
            d = r.Ce(A);
            if (null !== d) {
                if (d.isTemplateController) throw y(`AUR0703:${A}`);
                m = BindablesInfo.from(d, true);
                k = false === d.noMultiBindings && null === w && Hi(C);
                if (k) x = this.Be(n, C, d, r); else {
                    v = m.primary;
                    if (null === w) {
                        b = a.parse(C, 1);
                        x = [ null === b ? new SetPropertyInstruction(C, v.property) : new InterpolationInstruction(b, v.property) ];
                    } else {
                        Xi.node = n;
                        Xi.attr = f;
                        Xi.bindable = v;
                        Xi.def = d;
                        x = [ w.build(Xi, r.ep, r.m) ];
                    }
                }
                (p ?? (p = [])).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, null != d.aliases && d.aliases.includes(A) ? A : void 0, x));
                continue;
            }
            if (null === w) {
                b = a.parse(C, 1);
                if (h) {
                    m = BindablesInfo.from(l, false);
                    g = m.attrs[A];
                    if (void 0 !== g) {
                        b = a.parse(C, 1);
                        o.push(new SpreadElementPropBindingInstruction(null == b ? new SetPropertyInstruction(C, g.property) : new InterpolationInstruction(b, g.property)));
                        continue;
                    }
                }
                if (null != b) o.push(new InterpolationInstruction(b, r.m.map(n, A) ?? t.camelCase(A))); else switch (A) {
                  case "class":
                    o.push(new SetClassAttributeInstruction(C));
                    break;

                  case "style":
                    o.push(new SetStyleAttributeInstruction(C));
                    break;

                  default:
                    o.push(new SetAttributeInstruction(C, A));
                }
            } else {
                if (h) {
                    m = BindablesInfo.from(l, false);
                    g = m.attrs[A];
                    if (void 0 !== g) {
                        Xi.node = n;
                        Xi.attr = f;
                        Xi.bindable = g;
                        Xi.def = l;
                        o.push(new SpreadElementPropBindingInstruction(w.build(Xi, r.ep, r.m)));
                        continue;
                    }
                }
                Xi.node = n;
                Xi.attr = f;
                Xi.bindable = null;
                Xi.def = null;
                o.push(w.build(Xi, r.ep, r.m));
            }
        }
        Wi();
        if (null != p) return p.concat(o);
        return o;
    }
    ye(e, s) {
        const i = [];
        const n = e.attributes;
        const r = s.ep;
        let o = n.length;
        let l = 0;
        let h;
        let a;
        let c;
        let u;
        let f = null;
        let d;
        let p;
        let x;
        let m;
        let g = null;
        let v;
        let w;
        let b;
        let k;
        for (;o > l; ++l) {
            h = n[l];
            a = h.name;
            c = h.value;
            u = s.ue.parse(a, c);
            b = u.target;
            k = u.rawValue;
            if (Ki[b]) throw y(`AUR0702:${a}`);
            g = s.Ae(u);
            if (null !== g && (1 & g.type) > 0) {
                Xi.node = e;
                Xi.attr = u;
                Xi.bindable = null;
                Xi.def = null;
                i.push(g.build(Xi, s.ep, s.m));
                continue;
            }
            f = s.Ce(b);
            if (null !== f) {
                if (f.isTemplateController) throw y(`AUR0703:${b}`);
                x = BindablesInfo.from(f, true);
                w = false === f.noMultiBindings && null === g && Hi(k);
                if (w) p = this.Be(e, k, f, s); else {
                    m = x.primary;
                    if (null === g) {
                        v = r.parse(k, 1);
                        p = [ null === v ? new SetPropertyInstruction(k, m.property) : new InterpolationInstruction(v, m.property) ];
                    } else {
                        Xi.node = e;
                        Xi.attr = u;
                        Xi.bindable = m;
                        Xi.def = f;
                        p = [ g.build(Xi, s.ep, s.m) ];
                    }
                }
                e.removeAttribute(a);
                --l;
                --o;
                (d ?? (d = [])).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, null != f.aliases && f.aliases.includes(b) ? b : void 0, p));
                continue;
            }
            if (null === g) {
                v = r.parse(k, 1);
                if (null != v) {
                    e.removeAttribute(a);
                    --l;
                    --o;
                    i.push(new InterpolationInstruction(v, s.m.map(e, b) ?? t.camelCase(b)));
                } else switch (a) {
                  case "class":
                    i.push(new SetClassAttributeInstruction(k));
                    break;

                  case "style":
                    i.push(new SetStyleAttributeInstruction(k));
                    break;

                  default:
                    i.push(new SetAttributeInstruction(k, a));
                }
            } else {
                Xi.node = e;
                Xi.attr = u;
                Xi.bindable = null;
                Xi.def = null;
                i.push(g.build(Xi, s.ep, s.m));
            }
        }
        Wi();
        if (null != d) return d.concat(i);
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
                let s = t.firstChild;
                while (null !== s) s = this.be(s, e);
                break;
            }
        }
        return t.nextSibling;
    }
    Re(e, i) {
        const n = e.attributes;
        const r = n.length;
        const o = [];
        const l = i.ep;
        let h = false;
        let a = 0;
        let c;
        let u;
        let f;
        let d;
        let p;
        let x;
        let m;
        let g;
        for (;r > a; ++a) {
            c = n[a];
            f = c.name;
            d = c.value;
            if ("to-binding-context" === f) {
                h = true;
                continue;
            }
            u = i.ue.parse(f, d);
            x = u.target;
            m = u.rawValue;
            p = i.Ae(u);
            if (null !== p) {
                if ("bind" === u.command) o.push(new LetBindingInstruction(l.parse(m, 16), t.camelCase(x))); else throw y(`AUR0704:${u.command}`);
                continue;
            }
            g = l.parse(m, 1);
            o.push(new LetBindingInstruction(null === g ? new s.PrimitiveLiteralExpression(m) : g, t.camelCase(x)));
        }
        i.rows.push([ new HydrateLetElementInstruction(o, h) ]);
        return this.Te(e).nextSibling;
    }
    Se(e, s) {
        var i, n, r, o;
        const l = e.nextSibling;
        const h = (e.getAttribute("as-element") ?? e.nodeName).toLowerCase();
        const a = s.ke(h);
        const c = null !== a;
        const u = c && null != a.shadowOptions;
        const f = a?.capture;
        const d = null != f && "boolean" !== typeof f;
        const p = f ? [] : t.emptyArray;
        const x = s.ep;
        const m = this.debug ? t.noop : () => {
            e.removeAttribute(A);
            --b;
            --w;
        };
        let g = e.attributes;
        let v;
        let w = g.length;
        let b = 0;
        let k;
        let A;
        let C;
        let B;
        let R;
        let S;
        let I = null;
        let T = false;
        let E;
        let L;
        let P;
        let _;
        let q;
        let $;
        let U;
        let D = null;
        let M;
        let F;
        let O;
        let V;
        let N = true;
        let j = false;
        let H = false;
        if ("slot" === h) {
            if (null == s.root.def.shadowOptions) throw y(`AUR0717:${s.root.def.name}`);
            s.root.hasSlot = true;
        }
        if (c) {
            N = a.processContent?.call(a.Type, e, s.p);
            g = e.attributes;
            w = g.length;
        }
        if (s.root.def.enhance && e.classList.contains("au")) throw y(`AUR0705`);
        for (;w > b; ++b) {
            k = g[b];
            A = k.name;
            C = k.value;
            switch (A) {
              case "as-element":
              case "containerless":
                m();
                if (!j) j = "containerless" === A;
                continue;
            }
            B = s.ue.parse(A, C);
            D = s.Ae(B);
            O = B.target;
            V = B.rawValue;
            if (f && (!d || d && f(O))) {
                if (null != D && 1 & D.type) {
                    m();
                    p.push(B);
                    continue;
                }
                H = O !== an && "slot" !== O;
                if (H) {
                    M = BindablesInfo.from(a, false);
                    if (null == M.attrs[O] && !s.Ce(O)?.isTemplateController) {
                        m();
                        p.push(B);
                        continue;
                    }
                }
            }
            if (null !== D && 1 & D.type) {
                Xi.node = e;
                Xi.attr = B;
                Xi.bindable = null;
                Xi.def = null;
                (R ?? (R = [])).push(D.build(Xi, s.ep, s.m));
                m();
                continue;
            }
            I = s.Ce(O);
            if (null !== I) {
                M = BindablesInfo.from(I, true);
                T = false === I.noMultiBindings && null === D && Hi(V);
                if (T) P = this.Be(e, V, I, s); else {
                    F = M.primary;
                    if (null === D) {
                        $ = x.parse(V, 1);
                        P = [ null === $ ? new SetPropertyInstruction(V, F.property) : new InterpolationInstruction($, F.property) ];
                    } else {
                        Xi.node = e;
                        Xi.attr = B;
                        Xi.bindable = F;
                        Xi.def = I;
                        P = [ D.build(Xi, s.ep, s.m) ];
                    }
                }
                m();
                if (I.isTemplateController) (_ ?? (_ = [])).push(new HydrateTemplateController(Gi, this.resolveResources ? I : I.name, void 0, P)); else (L ?? (L = [])).push(new HydrateAttributeInstruction(this.resolveResources ? I : I.name, null != I.aliases && I.aliases.includes(O) ? O : void 0, P));
                continue;
            }
            if (null === D) {
                if (c) {
                    M = BindablesInfo.from(a, false);
                    E = M.attrs[O];
                    if (void 0 !== E) {
                        $ = x.parse(V, 1);
                        (S ?? (S = [])).push(null == $ ? new SetPropertyInstruction(V, E.property) : new InterpolationInstruction($, E.property));
                        m();
                        continue;
                    }
                }
                $ = x.parse(V, 1);
                if (null != $) {
                    m();
                    (R ?? (R = [])).push(new InterpolationInstruction($, s.m.map(e, O) ?? t.camelCase(O)));
                }
                continue;
            }
            m();
            if (c) {
                M = BindablesInfo.from(a, false);
                E = M.attrs[O];
                if (void 0 !== E) {
                    Xi.node = e;
                    Xi.attr = B;
                    Xi.bindable = E;
                    Xi.def = a;
                    (S ?? (S = [])).push(D.build(Xi, s.ep, s.m));
                    continue;
                }
            }
            Xi.node = e;
            Xi.attr = B;
            Xi.bindable = null;
            Xi.def = null;
            (R ?? (R = [])).push(D.build(Xi, s.ep, s.m));
        }
        Wi();
        if (this.Ee(e, R) && null != R && R.length > 1) this.Le(e, R);
        if (c) {
            U = new HydrateElementInstruction(this.resolveResources ? a : a.name, void 0, S ?? t.emptyArray, null, j, p);
            if (h === an) {
                const t = e.getAttribute("name") || hn;
                const i = s.t();
                const n = s.Pe();
                let r = e.firstChild;
                while (null !== r) {
                    if (1 === r.nodeType && r.hasAttribute(an)) e.removeChild(r); else as(i, r);
                    r = e.firstChild;
                }
                this.be(i.content, n);
                U.auSlot = {
                    name: t,
                    fallback: CustomElementDefinition.create({
                        name: Vs(),
                        template: i,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
                e = this._e(e, s);
            }
        }
        if (null != R || null != U || null != L) {
            v = t.emptyArray.concat(U ?? t.emptyArray, L ?? t.emptyArray, R ?? t.emptyArray);
            this.Te(e);
        }
        let W;
        if (null != _) {
            w = _.length - 1;
            b = w;
            q = _[b];
            let t;
            if (Ni(e)) {
                t = s.t();
                cs(t, [ s.qe(Oi), s.qe(Vi), this.Te(s.h(Mi)) ]);
            } else {
                this._e(e, s);
                if ("TEMPLATE" === e.nodeName) t = e; else {
                    t = s.t();
                    as(t, e);
                }
            }
            const r = t;
            const o = s.Pe(null == v ? [] : [ v ]);
            let l;
            let f;
            let d;
            let p;
            let x;
            let m;
            let g;
            let k;
            let A = 0, C = 0;
            let B = e.firstChild;
            let R = false;
            if (false !== N) while (null !== B) {
                f = 1 === B.nodeType ? B.getAttribute(an) : null;
                if (null !== f) B.removeAttribute(an);
                if (c) {
                    l = B.nextSibling;
                    if (!u) {
                        R = 3 === B.nodeType && "" === B.textContent.trim();
                        if (!R) ((i = p ?? (p = {}))[n = f || hn] ?? (i[n] = [])).push(B);
                        e.removeChild(B);
                    }
                    B = l;
                } else {
                    if (null !== f) {
                        f = f || hn;
                        throw y(`AUR0706:${h}[${f}]`);
                    }
                    B = B.nextSibling;
                }
            }
            if (null != p) {
                d = {};
                for (f in p) {
                    t = s.t();
                    x = p[f];
                    for (A = 0, C = x.length; C > A; ++A) {
                        m = x[A];
                        if ("TEMPLATE" === m.nodeName) if (m.attributes.length > 0) as(t, m); else as(t, m.content); else as(t, m);
                    }
                    k = s.Pe();
                    this.be(t.content, k);
                    d[f] = CustomElementDefinition.create({
                        name: Vs(),
                        template: t,
                        instructions: k.rows,
                        needsCompile: false,
                        isStrictBinding: s.root.def.isStrictBinding
                    });
                }
                U.projections = d;
            }
            if (c && (j || a.containerless)) this._e(e, s);
            W = !c || !a.containerless && !j && false !== N;
            if (W) if (e.nodeName === Fi) this.be(e.content, o); else {
                B = e.firstChild;
                while (null !== B) B = this.be(B, o);
            }
            q.def = CustomElementDefinition.create({
                name: Vs(),
                template: r,
                instructions: o.rows,
                needsCompile: false,
                isStrictBinding: s.root.def.isStrictBinding
            });
            while (b-- > 0) {
                q = _[b];
                t = s.t();
                g = this.Te(s.h(Mi));
                cs(t, [ s.qe(Oi), s.qe(Vi), g ]);
                q.def = CustomElementDefinition.create({
                    name: Vs(),
                    template: t,
                    needsCompile: false,
                    instructions: [ [ _[b + 1] ] ],
                    isStrictBinding: s.root.def.isStrictBinding
                });
            }
            s.rows.push([ q ]);
        } else {
            if (null != v) s.rows.push(v);
            let t = e.firstChild;
            let i;
            let n;
            let l = null;
            let f;
            let d;
            let p;
            let x;
            let m;
            let g = false;
            let w = 0, b = 0;
            if (false !== N) while (null !== t) {
                n = 1 === t.nodeType ? t.getAttribute(an) : null;
                if (null !== n) t.removeAttribute(an);
                if (c) {
                    i = t.nextSibling;
                    if (!u) {
                        g = 3 === t.nodeType && "" === t.textContent.trim();
                        if (!g) ((r = f ?? (f = {}))[o = n || hn] ?? (r[o] = [])).push(t);
                        e.removeChild(t);
                    }
                    t = i;
                } else {
                    if (null !== n) {
                        n = n || hn;
                        throw y(`AUR0706:${h}[${n}]`);
                    }
                    t = t.nextSibling;
                }
            }
            if (null != f) {
                l = {};
                for (n in f) {
                    x = s.t();
                    d = f[n];
                    for (w = 0, b = d.length; b > w; ++w) {
                        p = d[w];
                        if (p.nodeName === Fi) if (p.attributes.length > 0) as(x, p); else as(x, p.content); else as(x, p);
                    }
                    m = s.Pe();
                    this.be(x.content, m);
                    l[n] = CustomElementDefinition.create({
                        name: Vs(),
                        template: x,
                        instructions: m.rows,
                        needsCompile: false,
                        isStrictBinding: s.root.def.isStrictBinding
                    });
                }
                U.projections = l;
            }
            if (c && (j || a.containerless)) this._e(e, s);
            W = !c || !a.containerless && !j && false !== N;
            if (W && e.childNodes.length > 0) {
                t = e.firstChild;
                while (null !== t) t = this.be(t, s);
            }
        }
        return l;
    }
    Ie(t, e) {
        const s = t.parentNode;
        const i = e.ep.parse(t.textContent, 1);
        const n = t.nextSibling;
        let r;
        let o;
        let l;
        let h;
        let a;
        if (null !== i) {
            ({parts: r, expressions: o} = i);
            if (a = r[0]) os(s, e.$e(a), t);
            for (l = 0, h = o.length; h > l; ++l) {
                ls(s, t, [ e.qe(Oi), e.qe(Vi), this.Te(e.h(Mi)) ]);
                if (a = r[l + 1]) os(s, e.$e(a), t);
                e.rows.push([ new TextBindingInstruction(o[l], e.root.def.isStrictBinding) ]);
            }
            s.removeChild(t);
        }
        return n;
    }
    Be(t, e, s, i) {
        const n = BindablesInfo.from(s, true);
        const r = e.length;
        const o = [];
        let l;
        let h;
        let a = 0;
        let c = 0;
        let u;
        let f;
        let d;
        let p;
        for (let x = 0; x < r; ++x) {
            c = e.charCodeAt(x);
            if (92 === c) ++x; else if (58 === c) {
                l = e.slice(a, x);
                while (e.charCodeAt(++x) <= 32) ;
                a = x;
                for (;x < r; ++x) {
                    c = e.charCodeAt(x);
                    if (92 === c) ++x; else if (59 === c) {
                        h = e.slice(a, x);
                        break;
                    }
                }
                if (void 0 === h) h = e.slice(a);
                f = i.ue.parse(l, h);
                d = i.Ae(f);
                p = n.attrs[f.target];
                if (null == p) throw y(`AUR0707:${s.name}.${f.target}`);
                if (null === d) {
                    u = i.ep.parse(h, 1);
                    o.push(null === u ? new SetPropertyInstruction(h, p.property) : new InterpolationInstruction(u, p.property));
                } else {
                    Xi.node = t;
                    Xi.attr = f;
                    Xi.bindable = p;
                    Xi.def = s;
                    o.push(d.build(Xi, i.ep, i.m));
                }
                while (x < r && e.charCodeAt(++x) <= 32) ;
                a = x;
                l = void 0;
                h = void 0;
            }
        }
        Wi();
        return o;
    }
    we(e, s) {
        const i = e;
        const n = t.toArray(i.querySelectorAll("template[as-custom-element]"));
        const r = n.length;
        if (0 === r) return;
        if (r === i.childElementCount) throw y(`AUR0708`);
        const o = new Set;
        const l = [];
        for (const e of n) {
            if (e.parentNode !== i) throw y(`AUR0709`);
            const n = tn(e, o);
            const r = class LocalTemplate {};
            const h = e.content;
            const a = t.toArray(h.querySelectorAll("bindable"));
            const c = V.for(r);
            const u = new Set;
            const f = new Set;
            for (const t of a) {
                if (t.parentNode !== h) throw y(`AUR0710`);
                const e = t.getAttribute("property");
                if (null === e) throw y(`AUR0711`);
                const s = t.getAttribute("attribute");
                if (null !== s && f.has(s) || u.has(e)) throw y(`AUR0712:${e}+${s}`); else {
                    if (null !== s) f.add(s);
                    u.add(e);
                }
                c.add({
                    property: e,
                    attribute: s ?? void 0,
                    mode: en(t)
                });
                const i = t.getAttributeNames().filter((t => !Zi.includes(t)));
                if (i.length > 0) ;
                h.removeChild(t);
            }
            l.push(r);
            s.Ue(js({
                name: n,
                template: e
            }, r));
            i.removeChild(e);
        }
        let h = 0;
        const a = l.length;
        for (;a > h; ++h) Gs(l[h]).dependencies.push(...s.def.dependencies ?? t.emptyArray, ...s.deps ?? t.emptyArray);
    }
    Ee(t, e) {
        const s = t.nodeName;
        return "INPUT" === s && 1 === Qi[t.type] || "SELECT" === s && (t.hasAttribute("multiple") || e?.some((t => "rg" === t.type && "multiple" === t.to)));
    }
    Le(t, e) {
        switch (t.nodeName) {
          case "INPUT":
            {
                const t = e;
                let s;
                let i;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 3; e++) {
                    r = t[e];
                    switch (r.to) {
                      case "model":
                      case "value":
                      case "matcher":
                        s = e;
                        n++;
                        break;

                      case "checked":
                        i = e;
                        n++;
                        break;
                    }
                }
                if (void 0 !== i && void 0 !== s && i < s) [t[s], t[i]] = [ t[i], t[s] ];
                break;
            }

          case "SELECT":
            {
                const t = e;
                let s = 0;
                let i = 0;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 2; ++e) {
                    r = t[e];
                    switch (r.to) {
                      case "multiple":
                        i = e;
                        n++;
                        break;

                      case "value":
                        s = e;
                        n++;
                        break;
                    }
                    if (2 === n && s < i) [t[i], t[s]] = [ t[s], t[i] ];
                }
            }
        }
    }
    De(t) {
        return t.nodeName === Mi && ji(Di = hs(t)) && Di.textContent === Vi && ji(Di = hs(Di)) && Di.textContent === Oi;
    }
    Te(t) {
        t.classList.add("au");
        return t;
    }
    _e(t, e) {
        if (Ni(t)) return t;
        const s = t.parentNode;
        const i = this.Te(e.h(Mi));
        ls(s, t, [ e.qe(Oi), e.qe(Vi), i ]);
        s.removeChild(t);
        return i;
    }
}

let Di;

const Mi = "AU-M";

const Fi = "TEMPLATE";

const Oi = "au-start";

const Vi = "au-end";

const Ni = t => t.nodeName === Mi && ji(Di = hs(t)) && Di.textContent === Vi && ji(Di = hs(Di)) && Di.textContent === Oi;

const ji = t => 8 === t?.nodeType;

class CompilationContext {
    constructor(e, i, n, r, o, l) {
        this.hasSlot = false;
        this.Me = b();
        const h = null !== r;
        this.c = i;
        this.root = null === o ? this : o;
        this.def = e;
        this.ci = n;
        this.parent = r;
        this.ve = h ? r.ve : i.get(qi);
        this.ue = h ? r.ue : i.get(ot);
        this.ep = h ? r.ep : i.get(s.IExpressionParser);
        this.m = h ? r.m : i.get(Li);
        this.Fe = h ? r.Fe : i.get(t.ILogger);
        this.p = h ? r.p : i.get(se);
        this.localEls = h ? r.localEls : new Set;
        this.rows = l ?? [];
    }
    Ue(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    $e(t) {
        return rs(this.p, t);
    }
    qe(t) {
        return is(this.p, t);
    }
    h(t) {
        const e = ss(this.p, t);
        if ("template" === t) this.p.document.adoptNode(e.content);
        return e;
    }
    t() {
        return this.h("template");
    }
    ke(t) {
        return this.c.find(Qs, t);
    }
    Ce(t) {
        return this.c.find(ee, t);
    }
    Pe(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Ae(t) {
        if (this.root !== this) return this.root.Ae(t);
        const e = t.command;
        if (null === e) return null;
        let s = this.Me[e];
        if (void 0 === s) {
            s = this.c.create(Ri, e);
            if (null === s) throw y(`AUR0713:${e}`);
            this.Me[e] = s;
        }
        return s;
    }
}

const Hi = t => {
    const e = t.length;
    let s = 0;
    let i = 0;
    while (e > i) {
        s = t.charCodeAt(i);
        if (92 === s) ++i; else if (58 === s) return true; else if (36 === s && 123 === t.charCodeAt(i + 1)) return false;
        ++i;
    }
    return false;
};

const Wi = () => {
    Xi.node = Xi.attr = Xi.bindable = Xi.def = null;
};

const zi = {
    projections: null
};

const Gi = {
    name: "unnamed"
};

const Xi = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Ki = C(b(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const Qi = {
    checkbox: 1,
    radio: 1
};

const Yi = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let s = Yi.get(t);
        if (null == s) {
            const i = t.bindables;
            const n = b();
            const r = e ? void 0 === t.defaultBindingMode ? 8 : t.defaultBindingMode : 8;
            let o;
            let l;
            let h = false;
            let a;
            let c;
            for (l in i) {
                o = i[l];
                c = o.attribute;
                if (true === o.primary) {
                    if (h) throw y(`AUR0714:${t.name}`);
                    h = true;
                    a = o;
                } else if (!h && null == a) a = o;
                n[c] = BindableDefinition.create(l, t.Type, o);
            }
            if (null == o && e) a = n.value = BindableDefinition.create("value", t.Type, {
                mode: r
            });
            Yi.set(t, s = new BindablesInfo(n, i, a));
        }
        return s;
    }
    constructor(t, e, s) {
        this.attrs = t;
        this.bindables = e;
        this.primary = s;
    }
}

const Zi = A([ "property", "attribute", "mode" ]);

const Ji = "as-custom-element";

const tn = (t, e) => {
    const s = t.getAttribute(Ji);
    if (null === s || "" === s) throw y(`AUR0715`);
    if (e.has(s)) throw y(`AUR0716:${s}`); else {
        e.add(s);
        t.removeAttribute(Ji);
    }
    return s;
};

const en = t => {
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

const sn = X("ITemplateCompilerHooks");

const nn = new WeakMap;

const rn = d("compiler-hooks");

const on = A({
    name: rn,
    define(t) {
        let e = nn.get(t);
        if (void 0 === e) {
            nn.set(t, e = new TemplateCompilerHooksDefinition(t));
            a(rn, e, t);
            p(t, rn);
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
        t.register(K(sn, this.Type));
    }
}

const ln = t => {
    return void 0 === t ? e : e(t);
    function e(t) {
        return on.define(t);
    }
};

const hn = "default";

const an = "au-slot";

const cn = new Map;

class BindingModeBehavior {
    bind(t, e) {
        cn.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = cn.get(e);
        cn.delete(e);
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

vt("oneTime")(OneTimeBindingBehavior);

vt("toView")(ToViewBindingBehavior);

vt("fromView")(FromViewBindingBehavior);

vt("twoWay")(TwoWayBindingBehavior);

const un = new WeakMap;

const fn = 200;

class DebounceBindingBehavior {
    constructor(t) {
        this.p = t;
    }
    bind(t, e, s) {
        s = Number(s);
        const i = {
            type: "debounce",
            delay: s > 0 ? s : fn,
            now: this.p.performanceNow,
            queue: this.p.taskQueue
        };
        const n = e.limit?.(i);
        if (null == n) ; else un.set(e, n);
    }
    unbind(t, e) {
        un.get(e)?.dispose();
        un.delete(e);
    }
}

DebounceBindingBehavior.inject = [ t.IPlatform ];

vt("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor(t) {
        this.Oe = new Map;
        this.Ve = t;
    }
    bind(t, e, ...s) {
        if (!("handleChange" in e)) throw y(`AUR0817`);
        if (0 === s.length) throw y(`AUR0818`);
        this.Oe.set(e, s);
        let i;
        for (i of s) this.Ve.addSignalListener(i, e);
    }
    unbind(t, e) {
        const s = this.Oe.get(e);
        this.Oe.delete(e);
        let i;
        for (i of s) this.Ve.removeSignalListener(i, e);
    }
}

SignalBindingBehavior.inject = [ s.ISignaler ];

vt("signal")(SignalBindingBehavior);

const dn = new WeakMap;

const pn = 200;

class ThrottleBindingBehavior {
    constructor(t) {
        this.Ne = t.performanceNow;
        this.ct = t.taskQueue;
    }
    bind(t, e, s) {
        s = Number(s);
        const i = {
            type: "throttle",
            delay: s > 0 ? s : pn,
            now: this.Ne,
            queue: this.ct
        };
        const n = e.limit?.(i);
        if (null == n) ; else dn.set(e, n);
    }
    unbind(t, e) {
        dn.get(e)?.dispose();
        dn.delete(e);
    }
}

ThrottleBindingBehavior.inject = [ t.IPlatform ];

vt("throttle")(ThrottleBindingBehavior);

class DataAttributeAccessor {
    constructor() {
        this.type = 2 | 4;
    }
    getValue(t, e) {
        return t.getAttribute(e);
    }
    setValue(t, e, s) {
        if (null == t) e.removeAttribute(s); else e.setAttribute(s, t);
    }
}

oe(DataAttributeAccessor);

const xn = new DataAttributeAccessor;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) throw y(`AURxxxx`);
        e.useTargetObserver(xn);
    }
}

vt("attr")(AttrBindingBehavior);

class SelfBindingBehavior {
    bind(t, e) {
        if (!(e instanceof ListenerBinding)) throw y(`AUR0801`);
        e.self = true;
    }
    unbind(t, e) {
        e.self = false;
    }
}

vt("self")(SelfBindingBehavior);

const mn = b();

class AttributeNSAccessor {
    static forNs(t) {
        return mn[t] ?? (mn[t] = new AttributeNSAccessor(t));
    }
    constructor(t) {
        this.ns = t;
        this.type = 2 | 4;
    }
    getValue(t, e) {
        return t.getAttributeNS(this.ns, e);
    }
    setValue(t, e, s) {
        if (null == t) e.removeAttributeNS(this.ns, s); else e.setAttributeNS(this.ns, s, t);
    }
}

oe(AttributeNSAccessor);

function gn(t, e) {
    return t === e;
}

class CheckedObserver {
    constructor(t, e, s, i) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.je = void 0;
        this.He = void 0;
        this.bt = false;
        this.wt = t;
        this.oL = i;
        this.cf = s;
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
        this.it();
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
        const s = k.call(e, "model") ? e.model : e.value;
        const i = "radio" === e.type;
        const n = void 0 !== e.matcher ? e.matcher : gn;
        if (i) e.checked = !!n(t, s); else if (true === t) e.checked = true; else {
            let i = false;
            if (E(t)) i = -1 !== t.findIndex((t => !!n(t, s))); else if (t instanceof Set) {
                for (const e of t) if (n(e, s)) {
                    i = true;
                    break;
                }
            } else if (t instanceof Map) for (const e of t) {
                const t = e[0];
                const r = e[1];
                if (n(t, s) && true === r) {
                    i = true;
                    break;
                }
            }
            e.checked = i;
        }
    }
    handleEvent() {
        let t = this.ov = this.v;
        const e = this.wt;
        const s = k.call(e, "model") ? e.model : e.value;
        const i = e.checked;
        const n = void 0 !== e.matcher ? e.matcher : gn;
        if ("checkbox" === e.type) {
            if (E(t)) {
                const e = t.findIndex((t => !!n(t, s)));
                if (i && -1 === e) t.push(s); else if (!i && -1 !== e) t.splice(e, 1);
                return;
            } else if (t instanceof Set) {
                const e = {};
                let r = e;
                for (const e of t) if (true === n(e, s)) {
                    r = e;
                    break;
                }
                if (i && r === e) t.add(s); else if (!i && r !== e) t.delete(r);
                return;
            } else if (t instanceof Map) {
                let e;
                for (const i of t) {
                    const t = i[0];
                    if (true === n(t, s)) {
                        e = t;
                        break;
                    }
                }
                t.set(e, i);
                return;
            }
            t = i;
        } else if (i) t = s; else return;
        this.v = t;
        this.it();
    }
    yt() {
        this.We();
    }
    kt() {
        this.je?.unsubscribe(this);
        this.He?.unsubscribe(this);
        this.je = this.He = void 0;
    }
    it() {
        vn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, vn);
    }
    We() {
        const t = this.wt;
        (this.He ?? (this.He = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.je?.unsubscribe(this);
        this.je = void 0;
        if ("checkbox" === t.type) (this.je = En(this.v, this.oL))?.subscribe(this);
    }
}

re(CheckedObserver);

s.subscriberCollection(CheckedObserver);

let vn;

const wn = {
    childList: true,
    subtree: true,
    characterData: true
};

function bn(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, s, i) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.J = false;
        this.Ge = void 0;
        this.Xe = void 0;
        this.iO = false;
        this.bt = false;
        this.wt = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.iO ? this.v : this.wt.multiple ? yn(this.wt.options) : this.wt.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.J = t !== this.ov;
        this.Ke(t instanceof Array ? t : null);
        this.st();
    }
    st() {
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
        const s = E(t);
        const i = e.matcher ?? bn;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const o = k.call(e, "model") ? e.model : e.value;
            if (s) {
                e.selected = -1 !== t.findIndex((t => !!i(o, t)));
                continue;
            }
            e.selected = !!i(o, t);
        }
    }
    syncValue() {
        const t = this.wt;
        const e = t.options;
        const s = e.length;
        const i = this.v;
        let n = 0;
        if (t.multiple) {
            if (!(i instanceof Array)) return true;
            let r;
            const o = t.matcher || bn;
            const l = [];
            while (n < s) {
                r = e[n];
                if (r.selected) l.push(k.call(r, "model") ? r.model : r.value);
                ++n;
            }
            let h;
            n = 0;
            while (n < i.length) {
                h = i[n];
                if (-1 === l.findIndex((t => !!o(h, t)))) i.splice(n, 1); else ++n;
            }
            n = 0;
            while (n < l.length) {
                h = l[n];
                if (-1 === i.findIndex((t => !!o(h, t)))) i.push(h);
                ++n;
            }
            return false;
        }
        let r = null;
        let o;
        while (n < s) {
            o = e[n];
            if (o.selected) {
                r = k.call(o, "model") ? o.model : o.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    yt() {
        (this.Xe = new this.wt.ownerDocument.defaultView.MutationObserver(this.Qe.bind(this))).observe(this.wt, wn);
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
            if (!this.wt.multiple) throw y(`AUR0654`);
            (this.Ge = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) this.it();
    }
    Qe(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) this.it();
    }
    it() {
        kn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, kn);
    }
}

re(SelectValueObserver);

s.subscriberCollection(SelectValueObserver);

function yn(t) {
    const e = [];
    if (0 === t.length) return e;
    const s = t.length;
    let i = 0;
    let n;
    while (s > i) {
        n = t[i];
        if (n.selected) e[e.length] = k.call(n, "model") ? n.model : n.value;
        ++i;
    }
    return e;
}

let kn;

const An = "--";

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
        this.st();
    }
    Ye(t) {
        const e = [];
        const s = /url\([^)]+$/;
        let i = 0;
        let n = "";
        let r;
        let o;
        let l;
        let h;
        while (i < t.length) {
            r = t.indexOf(";", i);
            if (-1 === r) r = t.length;
            n += t.substring(i, r);
            i = r + 1;
            if (s.test(n)) {
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
    Ze(e) {
        let s;
        let i;
        const n = [];
        for (i in e) {
            s = e[i];
            if (null == s) continue;
            if (P(s)) {
                if (i.startsWith(An)) {
                    n.push([ i, s ]);
                    continue;
                }
                n.push([ t.kebabCase(i), s ]);
                continue;
            }
            n.push(...this.Je(s));
        }
        return n;
    }
    ts(e) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) t.push(...this.Je(e[i]));
            return t;
        }
        return t.emptyArray;
    }
    Je(e) {
        if (P(e)) return this.Ye(e);
        if (e instanceof Array) return this.ts(e);
        if (e instanceof Object) return this.Ze(e);
        return t.emptyArray;
    }
    st() {
        if (this.J) {
            this.J = false;
            const t = this.v;
            const e = this.styles;
            const s = this.Je(t);
            let i;
            let n = this.version;
            this.ov = t;
            let r;
            let o;
            let l;
            let h = 0;
            const a = s.length;
            for (;h < a; ++h) {
                r = s[h];
                o = r[0];
                l = r[1];
                this.setProperty(o, l);
                e[o] = n;
            }
            this.styles = e;
            this.version += 1;
            if (0 === n) return;
            n -= 1;
            for (i in e) {
                if (!k.call(e, i) || e[i] !== n) continue;
                this.obj.style.removeProperty(i);
            }
        }
    }
    setProperty(t, e) {
        let s = "";
        if (null != e && L(e.indexOf) && e.includes("!important")) {
            s = "important";
            e = e.replace("!important", "");
        }
        this.obj.style.setProperty(t, e, s);
    }
    bind() {
        this.v = this.ov = this.obj.style.cssText;
    }
}

oe(StyleAttributeAccessor);

class ValueAttributeObserver {
    constructor(t, e, s) {
        this.type = 2 | 1 | 4;
        this.v = "";
        this.ov = "";
        this.J = false;
        this.bt = false;
        this.wt = t;
        this.k = e;
        this.cf = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if ($(t, this.v)) return;
        this.ov = this.v;
        this.v = t;
        this.J = true;
        if (!this.cf.readonly) this.st();
    }
    st() {
        if (this.J) {
            this.J = false;
            this.wt[this.k] = this.v ?? this.cf.default;
            this.it();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.wt[this.k];
        if (this.ov !== this.v) {
            this.J = false;
            this.it();
        }
    }
    yt() {
        this.v = this.ov = this.wt[this.k];
    }
    it() {
        Cn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Cn);
    }
}

re(ValueAttributeObserver);

s.subscriberCollection(ValueAttributeObserver);

let Cn;

const Bn = "http://www.w3.org/1999/xlink";

const Rn = "http://www.w3.org/XML/1998/namespace";

const Sn = "http://www.w3.org/2000/xmlns/";

const In = C(b(), {
    "xlink:actuate": [ "actuate", Bn ],
    "xlink:arcrole": [ "arcrole", Bn ],
    "xlink:href": [ "href", Bn ],
    "xlink:role": [ "role", Bn ],
    "xlink:show": [ "show", Bn ],
    "xlink:title": [ "title", Bn ],
    "xlink:type": [ "type", Bn ],
    "xml:lang": [ "lang", Rn ],
    "xml:space": [ "space", Rn ],
    xmlns: [ "xmlns", Sn ],
    "xmlns:xlink": [ "xlink", Sn ]
});

const Tn = new s.PropertyAccessor;

Tn.type = 2 | 4;

class NodeObserverLocator {
    constructor(t, e, s, i) {
        this.locator = t;
        this.platform = e;
        this.dirtyChecker = s;
        this.svgAnalyzer = i;
        this.allowDirtyCheck = true;
        this.es = b();
        this.ss = b();
        this.rs = b();
        this.os = b();
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
        Q(s.INodeObserverLocator, NodeObserverLocator).register(t);
        K(s.INodeObserverLocator, NodeObserverLocator).register(t);
    }
    handles(t, e) {
        return t instanceof this.platform.Node;
    }
    useConfig(t, e, s) {
        const i = this.es;
        let n;
        if (P(t)) {
            n = i[t] ?? (i[t] = b());
            if (null == n[e]) n[e] = s; else Ln(t, e);
        } else for (const s in t) {
            n = i[s] ?? (i[s] = b());
            const r = t[s];
            for (e in r) if (null == n[e]) n[e] = r[e]; else Ln(s, e);
        }
    }
    useConfigGlobal(t, e) {
        const s = this.ss;
        if ("object" === typeof t) for (const e in t) if (null == s[e]) s[e] = t[e]; else Ln("*", e); else if (null == s[t]) s[t] = e; else Ln("*", t);
    }
    getAccessor(e, s, i) {
        if (s in this.os || s in (this.rs[e.tagName] ?? t.emptyObject)) return this.getObserver(e, s, i);
        switch (s) {
          case "src":
          case "href":
          case "role":
          case "minLength":
          case "maxLength":
          case "placeholder":
          case "size":
          case "pattern":
          case "title":
            return xn;

          default:
            {
                const t = In[s];
                if (void 0 !== t) return AttributeNSAccessor.forNs(t[1]);
                if (I(e, s, this.svgAnalyzer)) return xn;
                return Tn;
            }
        }
    }
    overrideAccessor(t, e) {
        var s, i;
        let n;
        if (P(t)) {
            n = (s = this.rs)[t] ?? (s[t] = b());
            n[e] = true;
        } else for (const e in t) for (const s of t[e]) {
            n = (i = this.rs)[e] ?? (i[e] = b());
            n[s] = true;
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) this.os[e] = true;
    }
    getNodeObserverConfig(t, e) {
        return this.es[t.tagName]?.[e] ?? this.ss[e];
    }
    getNodeObserver(t, e, i) {
        const n = this.es[t.tagName]?.[e] ?? this.ss[e];
        let r;
        if (null != n) {
            r = new (n.type ?? ValueAttributeObserver)(t, e, n, i, this.locator);
            if (!r.doNotCache) s.getObserverLookup(t)[e] = r;
            return r;
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
        const n = this.getNodeObserver(t, e, i);
        if (null != n) return n;
        const r = In[e];
        if (void 0 !== r) return AttributeNSAccessor.forNs(r[1]);
        if (I(t, e, this.svgAnalyzer)) return xn;
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) return this.dirtyChecker.createProperty(t, e);
            throw y(`AUR0652:${v(e)}`);
        } else return new s.SetterObserver(t, e);
    }
}

NodeObserverLocator.inject = [ t.IServiceLocator, se, s.IDirtyChecker, Ti ];

function En(t, e) {
    if (t instanceof Array) return e.getArrayObserver(t);
    if (t instanceof Map) return e.getMapObserver(t);
    if (t instanceof Set) return e.getSetObserver(t);
}

function Ln(t, e) {
    throw y(`AUR0653:${v(e)}@${t}`);
}

class UpdateTriggerBindingBehavior {
    constructor(t, e) {
        if (!(e instanceof NodeObserverLocator)) throw y("AURxxxx: updateTrigger binding behavior only works with the default implementation of Aurelia HTML observation. Implement your own node observation + updateTrigger");
        this.oL = t;
        this.ls = e;
    }
    bind(t, e, ...s) {
        if (0 === s.length) throw y(`AUR0802`);
        if (!(e instanceof PropertyBinding) || !(4 & e.mode)) throw y(`AUR0803`);
        const i = this.ls.getNodeObserverConfig(e.target, e.targetProperty);
        if (null == i) throw y(`AURxxxx`);
        const n = this.ls.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: i.readonly,
            default: i.default,
            events: s
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.inject = [ s.IObserverLocator, s.INodeObserverLocator ];

vt("updateTrigger")(UpdateTriggerBindingBehavior);

class Focus {
    constructor(t, e) {
        this.cs = false;
        this.us = t;
        this.p = e;
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) this.ds(); else this.cs = true;
    }
    attached() {
        if (this.cs) {
            this.cs = false;
            this.ds();
        }
        this.us.addEventListener("focus", this);
        this.us.addEventListener("blur", this);
    }
    detaching() {
        const t = this.us;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if ("focus" === t.type) this.value = true; else if (!this.ps) this.value = false;
    }
    ds() {
        const t = this.us;
        const e = this.ps;
        const s = this.value;
        if (s && !e) t.focus(); else if (!s && e) t.blur();
    }
    get ps() {
        return this.us === this.p.document.activeElement;
    }
}

Focus.inject = [ xs, se ];

r([ M({
    mode: 6
}) ], Focus.prototype, "value", void 0);

zt("focus")(Focus);

let Pn = class Show {
    constructor(t, e, s) {
        this.el = t;
        this.p = e;
        this.xs = false;
        this.lt = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.lt = null;
            if (Boolean(this.value) !== this.gs) if (this.gs === this.vs) {
                this.gs = !this.vs;
                this.$val = this.el.style.getPropertyValue("display");
                this.$prio = this.el.style.getPropertyPriority("display");
                this.el.style.setProperty("display", "none", "important");
            } else {
                this.gs = this.vs;
                this.el.style.setProperty("display", this.$val, this.$prio);
                if ("" === this.el.getAttribute("style")) this.el.removeAttribute("style");
            }
        };
        this.gs = this.vs = "hide" !== s.alias;
    }
    binding() {
        this.xs = true;
        this.update();
    }
    detaching() {
        this.xs = false;
        this.lt?.cancel();
        this.lt = null;
    }
    valueChanged() {
        if (this.xs && null === this.lt) this.lt = this.p.domWriteQueue.queueTask(this.update);
    }
};

r([ M ], Pn.prototype, "value", void 0);

Pn = r([ o(0, xs), o(1, se), o(2, ii) ], Pn);

tt("hide")(Pn);

zt("show")(Pn);

class Portal {
    constructor(t, e, s) {
        this.position = "beforeend";
        this.strict = false;
        this.p = s;
        this.ws = s.document.createElement("div");
        (this.view = t.create()).setLocation(this.bs = ns(s));
        ys(this.view.nodes, e);
    }
    attaching(t) {
        if (null == this.callbackContext) this.callbackContext = this.$controller.scope.bindingContext;
        const e = this.ws = this.ys();
        this.ks(e, this.position);
        return this.As(t, e);
    }
    detaching(t) {
        return this.Cs(t, this.ws);
    }
    targetChanged() {
        const {$controller: e} = this;
        if (!e.isActive) return;
        const s = this.ys();
        if (this.ws === s) return;
        this.ws = s;
        const i = t.onResolve(this.Cs(null, s), (() => {
            this.ks(s, this.position);
            return this.As(null, s);
        }));
        if (T(i)) i.catch(q);
    }
    positionChanged() {
        const {$controller: e, ws: s} = this;
        if (!e.isActive) return;
        const i = t.onResolve(this.Cs(null, s), (() => {
            this.ks(s, this.position);
            return this.As(null, s);
        }));
        if (T(i)) i.catch(q);
    }
    As(e, s) {
        const {activating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.Bs(e, s)));
    }
    Bs(e, s) {
        const {$controller: i, view: n} = this;
        if (null === e) n.nodes.insertBefore(this.bs); else return t.onResolve(n.activate(e ?? n, i, i.scope), (() => this.Rs(s)));
        return this.Rs(s);
    }
    Rs(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    Cs(e, s) {
        const {deactivating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.Ss(e, s)));
    }
    Ss(e, s) {
        const {$controller: i, view: n} = this;
        if (null === e) n.nodes.remove(); else return t.onResolve(n.deactivate(e, i), (() => this.Is(s)));
        return this.Is(s);
    }
    Is(t) {
        const {deactivated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    ys() {
        const t = this.p;
        const e = t.document;
        let s = this.target;
        let i = this.renderContext;
        if ("" === s) {
            if (this.strict) throw y(`AUR0811`);
            return e.body;
        }
        if (P(s)) {
            let n = e;
            if (P(i)) i = e.querySelector(i);
            if (i instanceof t.Node) n = i;
            s = n.querySelector(s);
        }
        if (s instanceof t.Node) return s;
        if (null == s) {
            if (this.strict) throw y(`AUR0812`);
            return e.body;
        }
        return s;
    }
    ks(t, e) {
        const s = this.bs;
        const i = s.$start;
        const n = t.parentNode;
        const r = [ i, s ];
        switch (e) {
          case "beforeend":
            ls(t, null, r);
            break;

          case "afterbegin":
            ls(t, t.firstChild, r);
            break;

          case "beforebegin":
            ls(n, t, r);
            break;

          case "afterend":
            ls(n, t.nextSibling, r);
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

Portal.inject = [ Ce, gs, se ];

r([ M({
    primary: true
}) ], Portal.prototype, "target", void 0);

r([ M() ], Portal.prototype, "position", void 0);

r([ M({
    callback: "targetChanged"
}) ], Portal.prototype, "renderContext", void 0);

r([ M() ], Portal.prototype, "strict", void 0);

r([ M() ], Portal.prototype, "deactivating", void 0);

r([ M() ], Portal.prototype, "activating", void 0);

r([ M() ], Portal.prototype, "deactivated", void 0);

r([ M() ], Portal.prototype, "activated", void 0);

r([ M() ], Portal.prototype, "callbackContext", void 0);

Gt("portal")(Portal);

class If {
    constructor(t, e) {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.Ts = false;
        this.Es = 0;
        this.Ls = t;
        this.l = e;
    }
    attaching(e, s) {
        let i;
        const n = this.$controller;
        const r = this.Es++;
        const o = () => !this.Ts && this.Es === r + 1;
        return t.onResolve(this.pending, (() => {
            if (!o()) return;
            this.pending = void 0;
            if (this.value) i = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.Ls.create(); else i = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : this.elseFactory?.create();
            if (null == i) return;
            i.setLocation(this.l);
            this.pending = t.onResolve(i.activate(e, n, n.scope), (() => {
                if (o()) this.pending = void 0;
            }));
        }));
    }
    detaching(e, s) {
        this.Ts = true;
        return t.onResolve(this.pending, (() => {
            this.Ts = false;
            this.pending = void 0;
            void this.view?.deactivate(e, this.$controller);
        }));
    }
    valueChanged(e, s) {
        if (!this.$controller.isActive) return;
        e = !!e;
        s = !!s;
        if (e === s) return;
        const i = this.view;
        const n = this.$controller;
        const r = this.Es++;
        const o = () => !this.Ts && this.Es === r + 1;
        let l;
        return t.onResolve(this.pending, (() => this.pending = t.onResolve(i?.deactivate(i, n), (() => {
            if (!o()) return;
            if (e) l = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.Ls.create(); else l = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : this.elseFactory?.create();
            if (null == l) return;
            l.setLocation(this.l);
            return t.onResolve(l.activate(l, n, n.scope), (() => {
                if (o()) this.pending = void 0;
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

If.inject = [ Ce, gs ];

r([ M ], If.prototype, "value", void 0);

r([ M({
    set: t => "" === t || !!t && "false" !== t
}) ], If.prototype, "cache", void 0);

Gt("if")(If);

class Else {
    constructor(t) {
        this.f = t;
    }
    link(t, e, s, i) {
        const n = t.children;
        const r = n[n.length - 1];
        if (r instanceof If) r.elseFactory = this.f; else if (r.viewModel instanceof If) r.viewModel.elseFactory = this.f; else throw y(`AUR0810`);
    }
}

Else.inject = [ Ce ];

Gt({
    name: "else"
})(Else);

function _n(t) {
    t.dispose();
}

const qn = [ 18, 17 ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.key = null;
        this.Ps = new Map;
        this._s = new Map;
        this.qs = void 0;
        this.$s = false;
        this.Us = false;
        this.Ds = null;
        this.Ms = void 0;
        this.Fs = false;
        const r = t.props[0].props[0];
        if (void 0 !== r) {
            const {to: t, value: s, command: i} = r;
            if ("key" === t) if (null === i) this.key = s; else if ("bind" === i) this.key = e.parse(s, 16); else throw y(`AUR775:${i}`); else throw y(`AUR776:${t}`);
        }
        this.l = s;
        this.Os = i;
        this.f = n;
    }
    binding(t, e) {
        const i = this.Os.bindings;
        const n = i.length;
        let r;
        let o;
        let l = 0;
        for (;n > l; ++l) {
            r = i[l];
            if (r.target === this && "items" === r.targetProperty) {
                o = this.forOf = r.ast;
                this.Vs = r;
                let t = o.iterable;
                while (null != t && qn.includes(t.$kind)) {
                    t = t.expression;
                    this.$s = true;
                }
                this.Ds = t;
                break;
            }
        }
        this.Ns();
        const h = o.declaration;
        if (!(this.Fs = 24 === h.$kind || 25 === h.$kind)) this.local = s.astEvaluate(h, this.$controller.scope, r, null);
    }
    attaching(t, e) {
        this.js();
        return this.Hs(t);
    }
    detaching(t, e) {
        this.Ns();
        return this.Ws(t);
    }
    unbinding(t, e) {
        this._s.clear();
        this.Ps.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) return;
        this.Ns();
        this.js();
        this.zs(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) return;
        if (this.$s) {
            if (this.Us) return;
            this.Us = true;
            this.items = s.astEvaluate(this.forOf.iterable, i.scope, this.Vs, null);
            this.Us = false;
            return;
        }
        this.js();
        this.zs(t, e);
    }
    zs(e, i) {
        const n = this.views;
        const r = n.length;
        const o = this.key;
        const l = null !== o;
        if (l || void 0 === i) {
            const t = this.local;
            const e = this.Ms;
            const h = e.length;
            const a = this.forOf;
            const c = a.declaration;
            const u = this.Vs;
            const f = this.Fs;
            i = s.createIndexMap(h);
            let d = 0;
            if (0 === r) for (;d < h; ++d) i[d] = -2; else if (0 === h) if (f) for (d = 0; d < r; ++d) {
                i.deletedIndices.push(d);
                i.deletedItems.push(s.astEvaluate(c, n[d].scope, u, null));
            } else for (d = 0; d < r; ++d) {
                i.deletedIndices.push(d);
                i.deletedItems.push(n[d].scope.bindingContext[t]);
            } else {
                const p = Array(r);
                if (f) for (d = 0; d < r; ++d) p[d] = s.astEvaluate(c, n[d].scope, u, null); else for (d = 0; d < r; ++d) p[d] = n[d].scope.bindingContext[t];
                let x;
                let m;
                let g;
                let v;
                let w = 0;
                const b = r - 1;
                const y = h - 1;
                const k = new Map;
                const A = new Map;
                const C = this.Ps;
                const B = this._s;
                const R = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (l) {
                            x = p[d];
                            m = e[d];
                            g = Xn(C, o, x, Kn(B, x, a, R, u, t, f), u);
                            v = Xn(C, o, m, Kn(B, m, a, R, u, t, f), u);
                        } else {
                            x = g = Qn(p[d], d);
                            m = v = Qn(e[d], d);
                        }
                        if (g !== v) {
                            C.set(x, g);
                            C.set(m, v);
                            break;
                        }
                        ++d;
                        if (d > b || d > y) break t;
                    }
                    if (b !== y) break t;
                    w = y;
                    while (true) {
                        if (l) {
                            x = p[w];
                            m = e[w];
                            g = Xn(C, o, x, Kn(B, x, a, R, u, t, f), u);
                            v = Xn(C, o, m, Kn(B, m, a, R, u, t, f), u);
                        } else {
                            x = g = Qn(p[d], d);
                            m = v = Qn(e[d], d);
                        }
                        if (g !== v) {
                            C.set(x, g);
                            C.set(m, v);
                            break;
                        }
                        --w;
                        if (d > w) break t;
                    }
                }
                const S = d;
                const I = d;
                for (d = I; d <= y; ++d) {
                    if (C.has(m = l ? e[d] : Qn(e[d], d))) v = C.get(m); else {
                        v = l ? Xn(C, o, m, Kn(B, m, a, R, u, t, f), u) : m;
                        C.set(m, v);
                    }
                    A.set(v, d);
                }
                for (d = S; d <= b; ++d) {
                    if (C.has(x = l ? p[d] : Qn(p[d], d))) g = C.get(x); else g = l ? Xn(C, o, x, n[d].scope, u) : x;
                    k.set(g, d);
                    if (A.has(g)) i[A.get(g)] = d; else {
                        i.deletedIndices.push(d);
                        i.deletedItems.push(x);
                    }
                }
                for (d = I; d <= y; ++d) if (!k.has(C.get(l ? e[d] : Qn(e[d], d)))) i[d] = -2;
                k.clear();
                A.clear();
            }
        }
        if (void 0 === i) {
            const e = t.onResolve(this.Ws(null), (() => this.Hs(null)));
            if (T(e)) e.catch(q);
        } else {
            const e = s.applyMutationsToIndices(i);
            if (e.deletedIndices.length > 0) {
                const s = t.onResolve(this.Gs(e), (() => this.Xs(r, e)));
                if (T(s)) s.catch(q);
            } else this.Xs(r, e);
        }
    }
    Ns() {
        const t = this.$controller.scope;
        let e = this.Ks;
        let i = this.$s;
        let n;
        if (i) {
            e = this.Ks = s.astEvaluate(this.Ds, t, this.Vs, null) ?? null;
            i = this.$s = !$(this.items, e);
        }
        const r = this.qs;
        if (this.$controller.isActive) {
            n = this.qs = s.getCollectionObserver(i ? e : this.items);
            if (r !== n) {
                r?.unsubscribe(this);
                n?.subscribe(this);
            }
        } else {
            r?.unsubscribe(this);
            this.qs = void 0;
        }
    }
    js() {
        const {items: t} = this;
        if (E(t)) {
            this.Ms = t;
            return;
        }
        const e = [];
        jn(t, ((t, s) => {
            e[s] = t;
        }));
        this.Ms = e;
    }
    Hs(t) {
        let e;
        let s;
        let i;
        let n;
        const {$controller: r, f: o, local: l, l: h, items: a, _s: c, Vs: u, forOf: f, Fs: d} = this;
        const p = r.scope;
        const x = Nn(a);
        const m = this.views = Array(x);
        jn(a, ((a, g) => {
            i = m[g] = o.create().setLocation(h);
            i.nodes.unlink();
            n = Kn(c, a, f, p, u, l, d);
            On(n.overrideContext, g, x);
            s = i.activate(t ?? i, r, n);
            if (T(s)) (e ?? (e = [])).push(s);
        }));
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    Ws(t) {
        let e;
        let s;
        let i;
        let n = 0;
        const {views: r, $controller: o} = this;
        const l = r.length;
        for (;l > n; ++n) {
            i = r[n];
            i.release();
            s = i.deactivate(t ?? i, o);
            if (T(s)) (e ?? (e = [])).push(s);
        }
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    Gs(t) {
        let e;
        let s;
        let i;
        const {$controller: n, views: r} = this;
        const o = t.deletedIndices;
        const l = o.length;
        let h = 0;
        for (;l > h; ++h) {
            i = r[o[h]];
            i.release();
            s = i.deactivate(i, n);
            if (T(s)) (e ?? (e = [])).push(s);
        }
        h = 0;
        let a = 0;
        for (;l > h; ++h) {
            a = o[h] - h;
            r.splice(a, 1);
        }
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    Xs(t, e) {
        let i;
        let n;
        let r;
        let o;
        let l = 0;
        const {$controller: h, f: a, local: c, Ms: u, l: f, views: d, Fs: p, Vs: x, _s: m, forOf: g} = this;
        const v = e.length;
        for (;v > l; ++l) if (-2 === e[l]) {
            r = a.create();
            d.splice(l, 0, r);
        }
        if (d.length !== v) throw Fn(d.length, v);
        const w = h.scope;
        const b = e.length;
        s.synchronizeIndices(d, e);
        const y = Mn(e);
        const k = y.length;
        const A = g.declaration;
        let C;
        let B = k - 1;
        l = b - 1;
        for (;l >= 0; --l) {
            r = d[l];
            C = d[l + 1];
            r.nodes.link(C?.nodes ?? f);
            if (-2 === e[l]) {
                o = Kn(m, u[l], g, w, x, c, p);
                On(o.overrideContext, l, b);
                r.setLocation(f);
                n = r.activate(r, h, o);
                if (T(n)) (i ?? (i = [])).push(n);
            } else if (B < 0 || 1 === k || l !== y[B]) {
                if (p) s.astAssign(A, r.scope, x, u[l]); else r.scope.bindingContext[c] = u[l];
                On(r.scope.overrideContext, l, b);
                r.nodes.insertBefore(r.location);
            } else {
                if (p) s.astAssign(A, r.scope, x, u[l]); else r.scope.bindingContext[c] = u[l];
                if (t !== b) On(r.scope.overrideContext, l, b);
                --B;
            }
        }
        if (void 0 !== i) return 1 === i.length ? i[0] : Promise.all(i);
    }
    dispose() {
        this.views.forEach(_n);
        this.views = void 0;
    }
    accept(t) {
        const {views: e} = this;
        if (void 0 !== e) for (let s = 0, i = e.length; s < i; ++s) if (true === e[s].accept(t)) return true;
    }
}

Repeat.inject = [ ii, s.IExpressionParser, gs, Me, Ce ];

r([ M ], Repeat.prototype, "items", void 0);

Gt("repeat")(Repeat);

let $n = 16;

let Un = new Int32Array($n);

let Dn = new Int32Array($n);

function Mn(t) {
    const e = t.length;
    if (e > $n) {
        $n = e;
        Un = new Int32Array(e);
        Dn = new Int32Array(e);
    }
    let s = 0;
    let i = 0;
    let n = 0;
    let r = 0;
    let o = 0;
    let l = 0;
    let h = 0;
    let a = 0;
    for (;r < e; r++) {
        i = t[r];
        if (-2 !== i) {
            o = Un[s];
            n = t[o];
            if (-2 !== n && n < i) {
                Dn[r] = o;
                Un[++s] = r;
                continue;
            }
            l = 0;
            h = s;
            while (l < h) {
                a = l + h >> 1;
                n = t[Un[a]];
                if (-2 !== n && n < i) l = a + 1; else h = a;
            }
            n = t[Un[l]];
            if (i < n || -2 === n) {
                if (l > 0) Dn[r] = Un[l - 1];
                Un[l] = r;
            }
        }
    }
    r = ++s;
    const c = new Int32Array(r);
    i = Un[s - 1];
    while (s-- > 0) {
        c[s] = i;
        i = Dn[i];
    }
    while (r-- > 0) Un[r] = 0;
    return c;
}

const Fn = (t, e) => y(`AUR0814:${t}!=${e}`);

const On = (t, e, s) => {
    const i = 0 === e;
    const n = e === s - 1;
    const r = e % 2 === 0;
    t.$index = e;
    t.$first = i;
    t.$last = n;
    t.$middle = !i && !n;
    t.$even = r;
    t.$odd = !r;
    t.$length = s;
};

const Vn = w.toString;

const Nn = t => {
    switch (Vn.call(t)) {
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
        throw y(`Cannot count ${Vn.call(t)}`);
    }
};

const jn = (t, e) => {
    switch (Vn.call(t)) {
      case "[object Array]":
        return Hn(t, e);

      case "[object Map]":
        return Wn(t, e);

      case "[object Set]":
        return zn(t, e);

      case "[object Number]":
        return Gn(t, e);

      case "[object Null]":
        return;

      case "[object Undefined]":
        return;

      default:
        throw y(`Cannot iterate over ${Vn.call(t)}`);
    }
};

const Hn = (t, e) => {
    const s = t.length;
    let i = 0;
    for (;i < s; ++i) e(t[i], i, t);
};

const Wn = (t, e) => {
    let s = -0;
    let i;
    for (i of t.entries()) e(i, s++, t);
};

const zn = (t, e) => {
    let s = 0;
    let i;
    for (i of t.keys()) e(i, s++, t);
};

const Gn = (t, e) => {
    let s = 0;
    for (;s < t; ++s) e(s, s, t);
};

const Xn = (t, e, i, n, r) => {
    let o = t.get(i);
    if (void 0 === o) {
        if ("string" === typeof e) o = i[e]; else o = s.astEvaluate(e, n, r, null);
        t.set(i, o);
    }
    return o;
};

const Kn = (t, e, i, n, r, o, l) => {
    let h = t.get(e);
    if (void 0 === h) {
        if (l) s.astAssign(i.declaration, h = s.Scope.fromParent(n, new s.BindingContext), r, e); else h = s.Scope.fromParent(n, new s.BindingContext(o, e));
        t.set(e, h);
    }
    return h;
};

const Qn = (t, e) => {
    const s = typeof t;
    switch (s) {
      case "object":
        if (null !== t) return t;

      case "string":
      case "number":
      case "bigint":
      case "undefined":
      case "boolean":
        return `${e}${s}${t}`;

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
        const n = this.view.bindings;
        let r;
        let o = 0, l = 0;
        if (i.isActive && null != n) {
            r = s.Scope.fromParent(i.scope, void 0 === t ? {} : t);
            for (l = n.length; l > o; ++o) n[o].bind(r);
        }
    }
    attaching(t, e) {
        const {$controller: i, value: n} = this;
        const r = s.Scope.fromParent(i.scope, void 0 === n ? {} : n);
        return this.view.activate(t, i, r);
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

With.inject = [ Ce, gs ];

r([ M ], With.prototype, "value", void 0);

Gt("with")(With);

exports.Switch = class Switch {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const s = this.view;
        const i = this.$controller;
        this.queue((() => s.activate(t, i, i.scope)));
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
        this.queue((() => this.Qs(t)));
    }
    Qs(e) {
        const s = e.isMatch(this.value);
        const i = this.activeCases;
        const n = i.length;
        if (!s) {
            if (n > 0 && i[0].id === e.id) return this.Ys(null);
            return;
        }
        if (n > 0 && i[0].id < e.id) return;
        const r = [];
        let o = e.fallThrough;
        if (!o) r.push(e); else {
            const t = this.cases;
            const s = t.indexOf(e);
            for (let e = s, i = t.length; e < i && o; e++) {
                const s = t[e];
                r.push(s);
                o = s.fallThrough;
            }
        }
        return t.onResolve(this.Ys(null, r), (() => {
            this.activeCases = r;
            return this.Zs(null);
        }));
    }
    swap(e, s) {
        const i = [];
        let n = false;
        for (const t of this.cases) {
            if (n || t.isMatch(s)) {
                i.push(t);
                n = t.fallThrough;
            }
            if (i.length > 0 && !n) break;
        }
        const r = this.defaultCase;
        if (0 === i.length && void 0 !== r) i.push(r);
        return t.onResolve(this.activeCases.length > 0 ? this.Ys(e, i) : void 0, (() => {
            this.activeCases = i;
            if (0 === i.length) return;
            return this.Zs(e);
        }));
    }
    Zs(e) {
        const s = this.$controller;
        if (!s.isActive) return;
        const i = this.activeCases;
        const n = i.length;
        if (0 === n) return;
        const r = s.scope;
        if (1 === n) return i[0].activate(e, r);
        return t.resolveAll(...i.map((t => t.activate(e, r))));
    }
    Ys(e, s = []) {
        const i = this.activeCases;
        const n = i.length;
        if (0 === n) return;
        if (1 === n) {
            const t = i[0];
            if (!s.includes(t)) {
                i.length = 0;
                return t.deactivate(e);
            }
            return;
        }
        return t.onResolve(t.resolveAll(...i.reduce(((t, i) => {
            if (!s.includes(i)) t.push(i.deactivate(e));
            return t;
        }), [])), (() => {
            i.length = 0;
        }));
    }
    queue(e) {
        const s = this.promise;
        let i;
        i = this.promise = t.onResolve(t.onResolve(s, e), (() => {
            if (this.promise === i) this.promise = void 0;
        }));
    }
    accept(t) {
        if (true === this.$controller.accept(t)) return true;
        if (this.activeCases.some((e => e.accept(t)))) return true;
    }
};

r([ M ], exports.Switch.prototype, "value", void 0);

exports.Switch = r([ Gt("switch"), o(0, Ce), o(1, gs) ], exports.Switch);

let Yn = 0;

exports.Case = class Case {
    constructor(t, e, s, i) {
        this.f = t;
        this.Js = e;
        this.l = s;
        this.id = ++Yn;
        this.fallThrough = false;
        this.view = void 0;
        this.ti = i.config.level <= 1;
        this.Fe = i.scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, s, i) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof exports.Switch) {
            this.$switch = r;
            this.linkToSwitch(r);
        } else throw y(`AUR0815`);
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    isMatch(t) {
        this.Fe.debug("isMatch()");
        const e = this.value;
        if (E(e)) {
            if (void 0 === this.qs) this.qs = this.ei(e);
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (E(t)) {
            this.qs?.unsubscribe(this);
            this.qs = this.ei(t);
        } else if (void 0 !== this.qs) this.qs.unsubscribe(this);
        this.$switch.caseChanged(this);
    }
    handleCollectionChange() {
        this.$switch.caseChanged(this);
    }
    activate(t, e) {
        let s = this.view;
        if (void 0 === s) s = this.view = this.f.create().setLocation(this.l);
        if (s.isActive) return;
        return s.activate(t ?? s, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (void 0 === e || !e.isActive) return;
        return e.deactivate(t ?? e, this.$controller);
    }
    dispose() {
        this.qs?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    ei(t) {
        const e = this.Js.getArrayObserver(t);
        e.subscribe(this);
        return e;
    }
    accept(t) {
        if (true === this.$controller.accept(t)) return true;
        return this.view?.accept(t);
    }
};

exports.Case.inject = [ Ce, s.IObserverLocator, gs, t.ILogger ];

r([ M ], exports.Case.prototype, "value", void 0);

r([ M({
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
}) ], exports.Case.prototype, "fallThrough", void 0);

exports.Case = r([ Gt("case") ], exports.Case);

exports.DefaultCase = class DefaultCase extends exports.Case {
    linkToSwitch(t) {
        if (void 0 !== t.defaultCase) throw y(`AUR0816`);
        t.defaultCase = this;
    }
};

exports.DefaultCase = r([ Gt("default-case") ], exports.DefaultCase);

exports.PromiseTemplateController = class PromiseTemplateController {
    constructor(t, e, s, i) {
        this.f = t;
        this.l = e;
        this.p = s;
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.logger = i.scopeTo("promise.resolve");
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(e, i) {
        const n = this.view;
        const r = this.$controller;
        return t.onResolve(n.activate(e, r, this.viewScope = s.Scope.fromParent(r.scope, {})), (() => this.swap(e)));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        this.swap(null);
    }
    swap(e) {
        const s = this.value;
        if (!T(s)) {
            this.logger.warn(`The value '${v(s)}' is not a promise. No change will be done.`);
            return;
        }
        const n = this.p.domWriteQueue;
        const r = this.fulfilled;
        const o = this.rejected;
        const l = this.pending;
        const h = this.viewScope;
        let a;
        const c = {
            reusable: false
        };
        const u = () => {
            void t.resolveAll(a = (this.preSettledTask = n.queueTask((() => t.resolveAll(r?.deactivate(e), o?.deactivate(e), l?.activate(e, h))), c)).result.catch((t => {
                if (!(t instanceof i.TaskAbortError)) throw t;
            })), s.then((i => {
                if (this.value !== s) return;
                const u = () => {
                    this.postSettlePromise = (this.postSettledTask = n.queueTask((() => t.resolveAll(l?.deactivate(e), o?.deactivate(e), r?.activate(e, h, i))), c)).result;
                };
                if (1 === this.preSettledTask.status) void a.then(u); else {
                    this.preSettledTask.cancel();
                    u();
                }
            }), (i => {
                if (this.value !== s) return;
                const u = () => {
                    this.postSettlePromise = (this.postSettledTask = n.queueTask((() => t.resolveAll(l?.deactivate(e), r?.deactivate(e), o?.activate(e, h, i))), c)).result;
                };
                if (1 === this.preSettledTask.status) void a.then(u); else {
                    this.preSettledTask.cancel();
                    u();
                }
            })));
        };
        if (1 === this.postSettledTask?.status) void this.postSettlePromise.then(u); else {
            this.postSettledTask?.cancel();
            u();
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

r([ M ], exports.PromiseTemplateController.prototype, "value", void 0);

exports.PromiseTemplateController = r([ Gt("promise"), o(0, Ce), o(1, gs), o(2, se), o(3, t.ILogger) ], exports.PromiseTemplateController);

exports.PendingTemplateController = class PendingTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, s, i) {
        Zn(t).pending = this;
    }
    activate(t, e) {
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
    detaching(t) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

r([ M({
    mode: 2
}) ], exports.PendingTemplateController.prototype, "value", void 0);

exports.PendingTemplateController = r([ Gt("pending"), o(0, Ce), o(1, gs) ], exports.PendingTemplateController);

exports.FulfilledTemplateController = class FulfilledTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, s, i) {
        Zn(t).fulfilled = this;
    }
    activate(t, e, s) {
        this.value = s;
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
    detaching(t, e) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

r([ M({
    mode: 4
}) ], exports.FulfilledTemplateController.prototype, "value", void 0);

exports.FulfilledTemplateController = r([ Gt("then"), o(0, Ce), o(1, gs) ], exports.FulfilledTemplateController);

exports.RejectedTemplateController = class RejectedTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, s, i) {
        Zn(t).rejected = this;
    }
    activate(t, e, s) {
        this.value = s;
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
    detaching(t, e) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

r([ M({
    mode: 4
}) ], exports.RejectedTemplateController.prototype, "value", void 0);

exports.RejectedTemplateController = r([ Gt("catch"), o(0, Ce), o(1, gs) ], exports.RejectedTemplateController);

function Zn(t) {
    const e = t.parent;
    const s = e?.viewModel;
    if (s instanceof exports.PromiseTemplateController) return s;
    throw y(`AUR0813`);
}

let Jn = class PromiseAttributePattern {
    "promise.resolve"(t, e, s) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

Jn = r([ lt({
    pattern: "promise.resolve",
    symbols: ""
}) ], Jn);

let tr = class FulfilledAttributePattern {
    then(t, e, s) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

tr = r([ lt({
    pattern: "then",
    symbols: ""
}) ], tr);

let er = class RejectedAttributePattern {
    catch(t, e, s) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

er = r([ lt({
    pattern: "catch",
    symbols: ""
}) ], er);

class AuCompose {
    static get inject() {
        return [ t.IContainer, Me, xs, gs, se, ii, t.transient(CompositionContextFactory) ];
    }
    get pending() {
        return this.si;
    }
    get composition() {
        return this.ii;
    }
    constructor(t, e, s, i, n, r, o) {
        this.c = t;
        this.parent = e;
        this.host = s;
        this.l = i;
        this.p = n;
        this.scopeBehavior = "auto";
        this.ii = void 0;
        this.r = t.get(Be);
        this.ni = r;
        this.ri = o;
    }
    attaching(e, s) {
        return this.si = t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), e), (t => {
            if (this.ri.isCurrent(t)) this.si = void 0;
        }));
    }
    detaching(e) {
        const s = this.ii;
        const i = this.si;
        this.ri.invalidate();
        this.ii = this.si = void 0;
        return t.onResolve(i, (() => s?.deactivate(e)));
    }
    propertyChanged(e) {
        if ("model" === e && null != this.ii) {
            this.ii.update(this.model);
            return;
        }
        this.si = t.onResolve(this.si, (() => t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, e), void 0), (t => {
            if (this.ri.isCurrent(t)) this.si = void 0;
        }))));
    }
    queue(e, s) {
        const i = this.ri;
        const n = this.ii;
        return t.onResolve(i.create(e), (e => {
            if (i.isCurrent(e)) return t.onResolve(this.compose(e), (r => {
                if (i.isCurrent(e)) return t.onResolve(r.activate(s), (() => {
                    if (i.isCurrent(e)) {
                        this.ii = r;
                        return t.onResolve(n?.deactivate(s), (() => e));
                    } else return t.onResolve(r.controller.deactivate(r.controller, this.$controller), (() => {
                        r.controller.dispose();
                        return e;
                    }));
                }));
                r.controller.dispose();
                return e;
            }));
            return e;
        }));
    }
    compose(e) {
        let i;
        let n;
        let r;
        const {ge: o, oi: l, li: h} = e.change;
        const {c: a, host: c, $controller: u, l: f} = this;
        const d = this.getDef(l);
        const p = a.createChild();
        const x = null == f ? c.parentNode : f.parentNode;
        if (null !== d) {
            if (d.containerless) throw y(`AUR0806`);
            if (null == f) {
                n = c;
                r = () => {};
            } else {
                n = x.insertBefore(this.p.document.createElement(d.name), f);
                r = () => {
                    n.remove();
                };
            }
            i = this.hi(p, l, n);
        } else {
            n = null == f ? c : f;
            i = this.hi(p, l, n);
        }
        const m = () => {
            if (null !== d) {
                const s = Controller.$el(p, i, n, {
                    projections: this.ni.projections
                }, d);
                return new CompositionController(s, (t => s.activate(t ?? s, u, u.scope.parent)), (e => t.onResolve(s.deactivate(e ?? s, u), r)), (t => i.activate?.(t)), e);
            } else {
                const t = CustomElementDefinition.create({
                    name: Qs.generateName(),
                    template: o
                });
                const r = this.r.getViewFactory(t, p);
                const l = Controller.$view(r, u);
                const h = "auto" === this.scopeBehavior ? s.Scope.fromParent(this.parent.scope, i) : s.Scope.create(i);
                if (As(n)) l.setLocation(n); else l.setHost(n);
                return new CompositionController(l, (t => l.activate(t ?? l, u, h)), (t => l.deactivate(t ?? l, u)), (t => i.activate?.(t)), e);
            }
        };
        if ("activate" in i) return t.onResolve(i.activate(h), (() => m())); else return m();
    }
    hi(e, s, i) {
        if (null == s) return new EmptyComponent;
        if ("object" === typeof s) return s;
        const n = this.p;
        const r = As(i);
        J(e, n.Element, J(e, xs, new t.InstanceProvider("ElementResolver", r ? null : i)));
        J(e, gs, new t.InstanceProvider("IRenderLocation", r ? i : null));
        const o = e.invoke(s);
        J(e, s, new t.InstanceProvider("au-compose.component", o));
        return o;
    }
    getDef(t) {
        const e = L(t) ? t : t?.constructor;
        return Qs.isType(e) ? Qs.getDefinition(e) : null;
    }
}

r([ M ], AuCompose.prototype, "template", void 0);

r([ M ], AuCompose.prototype, "component", void 0);

r([ M ], AuCompose.prototype, "model", void 0);

r([ M({
    set: t => {
        if ("scoped" === t || "auto" === t) return t;
        throw y(`AUR0805`);
    }
}) ], AuCompose.prototype, "scopeBehavior", void 0);

Ss("au-compose")(AuCompose);

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    isCurrent(t) {
        return t.id === this.id;
    }
    create(e) {
        return t.onResolve(e.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, s, i) {
        this.ge = t;
        this.oi = e;
        this.li = s;
        this.ai = i;
    }
    load() {
        if (T(this.ge) || T(this.oi)) return Promise.all([ this.ge, this.oi ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.li, this.ai))); else return new LoadedChangeInfo(this.ge, this.oi, this.li, this.ai);
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.ge = t;
        this.oi = e;
        this.li = s;
        this.ai = i;
    }
}

class CompositionContext {
    constructor(t, e) {
        this.id = t;
        this.change = e;
    }
}

class CompositionController {
    constructor(t, e, s, i, n) {
        this.controller = t;
        this.start = e;
        this.stop = s;
        this.update = i;
        this.context = n;
        this.state = 0;
    }
    activate(t) {
        if (0 !== this.state) throw y(`AUR0807:${this.controller.name}`);
        this.state = 1;
        return this.start(t);
    }
    deactivate(t) {
        switch (this.state) {
          case 1:
            this.state = -1;
            return this.stop(t);

          case -1:
            throw y(`AUR0808`);

          default:
            this.state = -1;
        }
    }
}

exports.AuSlot = class AuSlot {
    static get inject() {
        return [ gs, ii, Fe, Be ];
    }
    constructor(e, s, i, n) {
        this.ui = null;
        this.fi = null;
        let r;
        let o;
        const l = s.auSlot;
        const h = i.instruction?.projections?.[l.name];
        if (null == h) {
            r = n.getViewFactory(l.fallback, i.controller.container);
            this.di = false;
        } else {
            o = i.parent.controller.container.createChild();
            J(o, i.controller.definition.Type, new t.InstanceProvider(void 0, i.controller.viewModel));
            r = n.getViewFactory(h, o);
            this.di = true;
        }
        this.pi = i;
        this.view = r.create().setLocation(e);
    }
    binding(t, e) {
        this.ui = this.$controller.scope.parent;
        let i;
        if (this.di) {
            i = this.pi.controller.scope.parent;
            (this.fi = s.Scope.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.ui.bindingContext;
        }
    }
    attaching(t, e) {
        return this.view.activate(t, this.$controller, this.di ? this.fi : this.ui);
    }
    detaching(t, e) {
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.di && null != this.fi) this.fi.overrideContext.$host = t;
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        if (true === this.view?.accept(t)) return true;
    }
};

r([ M ], exports.AuSlot.prototype, "expose", void 0);

exports.AuSlot = r([ Ss({
    name: "au-slot",
    template: null,
    containerless: true
}) ], exports.AuSlot);

const sr = X("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw y('"sanitize" method not implemented');
    }
})));

exports.SanitizeValueConverter = class SanitizeValueConverter {
    constructor(t) {
        this.xi = t;
    }
    toView(t) {
        if (null == t) return null;
        return this.xi.sanitize(t);
    }
};

exports.SanitizeValueConverter = r([ o(0, sr) ], exports.SanitizeValueConverter);

kt("sanitize")(exports.SanitizeValueConverter);

const ir = DebounceBindingBehavior;

const nr = OneTimeBindingBehavior;

const rr = ToViewBindingBehavior;

const or = FromViewBindingBehavior;

const lr = SignalBindingBehavior;

const hr = ThrottleBindingBehavior;

const ar = TwoWayBindingBehavior;

const cr = TemplateCompiler;

const ur = NodeObserverLocator;

const fr = [ cr, ur ];

const dr = SVGAnalyzer;

const pr = exports.AtPrefixedTriggerAttributePattern;

const xr = exports.ColonPrefixedBindAttributePattern;

const mr = exports.RefAttributePattern;

const gr = exports.DotSeparatedAttributePattern;

const vr = ft;

const wr = [ mr, gr, vr ];

const br = [ pr, xr ];

const yr = exports.DefaultBindingCommand;

const kr = exports.ForBindingCommand;

const Ar = exports.FromViewBindingCommand;

const Cr = exports.OneTimeBindingCommand;

const Br = exports.ToViewBindingCommand;

const Rr = exports.TwoWayBindingCommand;

const Sr = Si;

const Ir = exports.TriggerBindingCommand;

const Tr = exports.CaptureBindingCommand;

const Er = exports.AttrBindingCommand;

const Lr = exports.ClassBindingCommand;

const Pr = exports.StyleBindingCommand;

const _r = Ii;

const qr = [ yr, Cr, Ar, Br, Rr, kr, Sr, Ir, Tr, Lr, Pr, Er, _r ];

const $r = exports.SanitizeValueConverter;

const Ur = If;

const Dr = Else;

const Mr = Repeat;

const Fr = With;

const Or = exports.Switch;

const Vr = exports.Case;

const Nr = exports.DefaultCase;

const jr = exports.PromiseTemplateController;

const Hr = exports.PendingTemplateController;

const Wr = exports.FulfilledTemplateController;

const zr = exports.RejectedTemplateController;

const Gr = Jn;

const Xr = tr;

const Kr = er;

const Qr = SelfBindingBehavior;

const Yr = UpdateTriggerBindingBehavior;

const Zr = AuCompose;

const Jr = Portal;

const to = Focus;

const eo = Pn;

const so = [ ir, nr, rr, or, lr, hr, ar, $r, Ur, Dr, Mr, Fr, Or, Vr, Nr, jr, Hr, Wr, zr, Gr, Xr, Kr, AttrBindingBehavior, Qr, Yr, Zr, Jr, to, eo, exports.AuSlot ];

const io = [ exports.PropertyBindingRenderer, exports.IteratorBindingRenderer, exports.RefBindingRenderer, exports.InterpolationBindingRenderer, exports.SetPropertyRenderer, exports.CustomElementRenderer, exports.CustomAttributeRenderer, exports.TemplateControllerRenderer, exports.LetElementRenderer, exports.ListenerBindingRenderer, exports.AttributeBindingRenderer, exports.SetAttributeRenderer, exports.SetClassAttributeRenderer, exports.SetStyleAttributeRenderer, exports.StylePropertyBindingRenderer, exports.TextBindingRenderer, exports.SpreadRenderer ];

const no = ro(t.noop);

function ro(t) {
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
            return e.register(Y(s.ICoercionConfiguration, i.coercingOptions), ...fr, ...so, ...wr, ...qr, ...io);
        },
        customize(e) {
            return ro(e ?? t);
        }
    };
}

const oo = X("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.mi;
    }
    get isStopping() {
        return this.gi;
    }
    get root() {
        if (null == this.vi) {
            if (null == this.next) throw y(`AUR0767`);
            return this.next;
        }
        return this.vi;
    }
    constructor(e = t.DI.createContainer()) {
        this.container = e;
        this.ir = false;
        this.mi = false;
        this.gi = false;
        this.vi = void 0;
        this.next = void 0;
        this.wi = void 0;
        this.bi = void 0;
        if (e.has(oo, true)) throw y(`AUR0768`);
        J(e, oo, new t.InstanceProvider("IAurelia", this));
        J(e, Je, this.yi = new t.InstanceProvider("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.ki(t.host), this.container, this.yi);
        return this;
    }
    enhance(e, s) {
        const i = e.container ?? this.container.createChild();
        const n = e.host;
        const r = this.ki(n);
        const o = e.component;
        let l;
        if (L(o)) {
            J(i, r.HTMLElement, J(i, r.Element, J(i, xs, new t.InstanceProvider("ElementResolver", n))));
            l = i.invoke(o);
        } else l = o;
        J(i, ms, new t.InstanceProvider("IEventTarget", n));
        s = s ?? null;
        const h = Controller.$el(i, l, n, null, CustomElementDefinition.create({
            name: Vs(),
            template: n,
            enhance: true
        }));
        return t.onResolve(h.activate(h, s), (() => h));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    ki(t) {
        let e;
        if (!this.container.has(se, false)) {
            if (null === t.ownerDocument.defaultView) throw y(`AUR0769`);
            e = new n.BrowserPlatform(t.ownerDocument.defaultView);
            this.container.register(Y(se, e));
        } else e = this.container.get(se);
        return e;
    }
    start(e = this.next) {
        if (null == e) throw y(`AUR0770`);
        if (T(this.wi)) return this.wi;
        return this.wi = t.onResolve(this.stop(), (() => {
            Reflect.set(e.host, "$aurelia", this);
            this.yi.prepare(this.vi = e);
            this.mi = true;
            return t.onResolve(e.activate(), (() => {
                this.ir = true;
                this.mi = false;
                this.wi = void 0;
                this.Ai(e, "au-started", e.host);
            }));
        }));
    }
    stop(e = false) {
        if (T(this.bi)) return this.bi;
        if (true === this.ir) {
            const s = this.vi;
            this.ir = false;
            this.gi = true;
            return this.bi = t.onResolve(s.deactivate(), (() => {
                Reflect.deleteProperty(s.host, "$aurelia");
                if (e) s.dispose();
                this.vi = void 0;
                this.yi.dispose();
                this.gi = false;
                this.Ai(s, "au-stopped", s.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.gi) throw y(`AUR0771`);
        this.container.dispose();
    }
    Ai(t, e, s) {
        const i = new t.platform.window.CustomEvent(e, {
            detail: this,
            bubbles: true,
            cancelable: true
        });
        s.dispatchEvent(i);
    }
}

exports.BindingMode = void 0;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(exports.BindingMode || (exports.BindingMode = {}));

exports.DefinitionType = void 0;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attribute"] = 2] = "Attribute";
})(exports.DefinitionType || (exports.DefinitionType = {}));

function lo(t, e) {
    let s;
    const i = "dependencies";
    function n(t, e, n) {
        if (arguments.length > 1) s.name = e;
        if ("function" === typeof t || "undefined" !== typeof n?.value) throw new Error(`Invalid usage. @children can only be used on a field`);
        const r = t.constructor;
        let o = Qs.getAnnotation(r, i);
        if (null == o) Qs.annotate(r, i, o = []);
        o.push(new ChildrenLifecycleHooks(s));
    }
    if (arguments.length > 1) {
        s = {};
        n(t, e);
        return;
    } else if (P(t)) {
        s = {
            filter: e => 1 === e.nodeType && e.matches(t),
            map: t => t
        };
        return n;
    }
    s = void 0 === t ? {} : t;
    return n;
}

class ChildrenBinding {
    static create(t, e, s, i, n = co, r = uo, o = fo, l = ho) {
        const h = new ChildrenBinding(t, e, i, n, r, o, l);
        U(e, s, {
            enumerable: true,
            configurable: true,
            get: C((() => h.getValue()), {
                getObserver: () => h
            }),
            set: () => {}
        });
        return h;
    }
    constructor(t, e, s, i = co, n = uo, r = fo, o = ho) {
        this.Ci = void 0;
        this.Bi = co;
        this.Ri = uo;
        this.Si = fo;
        this.isBound = false;
        this.ht = t;
        this.cb = (this.obj = e)[s];
        this.Bi = i;
        this.Ri = n;
        this.Si = r;
        this.vt = o;
        this.qs = new (this.Ii = t.host).ownerDocument.defaultView.MutationObserver((() => {
            this.Ti();
        }));
    }
    getValue() {
        return this.isBound ? this.Ci : this.Ei();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) return;
        this.isBound = true;
        this.qs.observe(this.Ii, this.vt);
        this.Ci = this.Ei();
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.qs.disconnect();
        this.Ci = t.emptyArray;
    }
    Ti() {
        this.Ci = this.Ei();
        this.cb?.call(this.obj);
        this.subs.notify(this.Ci, void 0);
    }
    get() {
        throw ao("get");
    }
    useScope() {}
    limit() {
        throw ao("limit");
    }
    Ei() {
        return xo(this.ht, this.Bi, this.Ri, this.Si);
    }
}

s.subscriberCollection(ChildrenBinding);

const ho = {
    childList: true
};

const ao = t => y(`Method "${t}": not implemented`);

const co = t => t.host.childNodes;

const uo = (t, e, s) => !!s;

const fo = (t, e, s) => s;

const po = {
    optional: true
};

const xo = (t, e, s, i) => {
    const n = e(t);
    const r = n.length;
    const o = [];
    let l;
    let h;
    let a;
    let c = 0;
    for (;c < r; ++c) {
        l = n[c];
        h = Ws(l, po);
        a = h?.viewModel ?? null;
        if (s(l, h, a)) o.push(i(l, h, a));
    }
    return o;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.def = t;
    }
    register(t) {
        Y(we, this).register(t);
    }
    hydrating(t, e) {
        const s = this.def;
        e.addBinding(ChildrenBinding.create(e, e.viewModel, s.name, s.callback ?? `${v(s.name)}Changed`, s.query ?? co, s.filter ?? uo, s.map ?? fo, s.options ?? ho));
    }
}

Ae()(ChildrenLifecycleHooks);

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = Ot;

exports.AtPrefixedTriggerAttributePatternRegistration = pr;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrBindingCommandRegistration = Er;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = ut;

exports.AuCompose = AuCompose;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = V;

exports.BindableDefinition = BindableDefinition;

exports.BindableObserver = BindableObserver;

exports.BindablesInfo = BindablesInfo;

exports.BindingBehavior = yt;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingCommand = Ri;

exports.BindingCommandDefinition = BindingCommandDefinition;

exports.BindingModeBehavior = BindingModeBehavior;

exports.BindingTargetSubscriber = BindingTargetSubscriber;

exports.CSSModulesProcessorRegistry = CSSModulesProcessorRegistry;

exports.CaptureBindingCommandRegistration = Tr;

exports.CheckedObserver = CheckedObserver;

exports.ChildrenBinding = ChildrenBinding;

exports.ClassAttributeAccessor = ClassAttributeAccessor;

exports.ClassBindingCommandRegistration = Lr;

exports.ColonPrefixedBindAttributePatternRegistration = xr;

exports.ComputedWatcher = ComputedWatcher;

exports.ContentBinding = ContentBinding;

exports.Controller = Controller;

exports.CustomAttribute = ee;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomElement = Qs;

exports.CustomElementDefinition = CustomElementDefinition;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DebounceBindingBehaviorRegistration = ir;

exports.DefaultBindingCommandRegistration = yr;

exports.DefaultBindingLanguage = qr;

exports.DefaultBindingSyntax = wr;

exports.DefaultComponents = fr;

exports.DefaultRenderers = io;

exports.DefaultResources = so;

exports.DotSeparatedAttributePatternRegistration = gr;

exports.Else = Else;

exports.ElseRegistration = Dr;

exports.ExpressionWatcher = ExpressionWatcher;

exports.FlushQueue = FlushQueue;

exports.Focus = Focus;

exports.ForBindingCommandRegistration = kr;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.FromViewBindingBehaviorRegistration = or;

exports.FromViewBindingCommandRegistration = Ar;

exports.HooksDefinition = HooksDefinition;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAppRoot = Je;

exports.IAppTask = Ft;

exports.IAttrMapper = Li;

exports.IAttributeParser = ot;

exports.IAttributePattern = rt;

exports.IAuSlotsInfo = si;

exports.IAurelia = oo;

exports.IController = Me;

exports.IEventTarget = ms;

exports.IFlushQueue = Tt;

exports.IHistory = Rs;

exports.IHydrationContext = Fe;

exports.IInstruction = ii;

exports.ILifecycleHooks = we;

exports.ILocation = Bs;

exports.INode = xs;

exports.INodeObserverLocatorRegistration = ur;

exports.IPlatform = se;

exports.IProjections = ei;

exports.IRenderLocation = gs;

exports.IRenderer = oi;

exports.IRendering = Be;

exports.ISVGAnalyzer = Ti;

exports.ISanitizer = sr;

exports.IShadowDOMGlobalStyles = de;

exports.IShadowDOMStyles = fe;

exports.ISyntaxInterpreter = st;

exports.ITemplateCompiler = ri;

exports.ITemplateCompilerHooks = sn;

exports.ITemplateCompilerRegistration = cr;

exports.ITemplateElementFactory = qi;

exports.IViewFactory = Ce;

exports.IWindow = Cs;

exports.If = If;

exports.IfRegistration = Ur;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LifecycleHooks = ke;

exports.LifecycleHooksDefinition = LifecycleHooksDefinition;

exports.LifecycleHooksEntry = LifecycleHooksEntry;

exports.ListenerBinding = ListenerBinding;

exports.ListenerBindingInstruction = ListenerBindingInstruction;

exports.ListenerBindingOptions = ListenerBindingOptions;

exports.MultiAttrInstruction = MultiAttrInstruction;

exports.NodeObserverLocator = NodeObserverLocator;

exports.NoopSVGAnalyzer = NoopSVGAnalyzer;

exports.OneTimeBindingBehavior = OneTimeBindingBehavior;

exports.OneTimeBindingBehaviorRegistration = nr;

exports.OneTimeBindingCommandRegistration = Cr;

exports.Portal = Portal;

exports.PropertyBinding = PropertyBinding;

exports.PropertyBindingInstruction = PropertyBindingInstruction;

exports.RefAttributePatternRegistration = mr;

exports.RefBinding = RefBinding;

exports.RefBindingCommandRegistration = Sr;

exports.RefBindingInstruction = RefBindingInstruction;

exports.Rendering = Rendering;

exports.Repeat = Repeat;

exports.RepeatRegistration = Mr;

exports.SVGAnalyzer = SVGAnalyzer;

exports.SVGAnalyzerRegistration = dr;

exports.SanitizeValueConverterRegistration = $r;

exports.SelectValueObserver = SelectValueObserver;

exports.SelfBindingBehavior = SelfBindingBehavior;

exports.SelfBindingBehaviorRegistration = Qr;

exports.SetAttributeInstruction = SetAttributeInstruction;

exports.SetClassAttributeInstruction = SetClassAttributeInstruction;

exports.SetPropertyInstruction = SetPropertyInstruction;

exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;

exports.ShadowDOMRegistry = ShadowDOMRegistry;

exports.ShortHandBindingSyntax = br;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SignalBindingBehaviorRegistration = lr;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.StandardConfiguration = no;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleBindingCommandRegistration = Pr;

exports.StyleConfiguration = pe;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = on;

exports.TextBindingInstruction = TextBindingInstruction;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ThrottleBindingBehaviorRegistration = hr;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.ToViewBindingBehaviorRegistration = rr;

exports.ToViewBindingCommandRegistration = Br;

exports.TriggerBindingCommandRegistration = Ir;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.TwoWayBindingBehaviorRegistration = ar;

exports.TwoWayBindingCommandRegistration = Rr;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.UpdateTriggerBindingBehaviorRegistration = Yr;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ValueConverter = Bt;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ViewFactory = ViewFactory;

exports.Watch = Wt;

exports.With = With;

exports.WithRegistration = Fr;

exports.alias = tt;

exports.allResources = G;

exports.attributePattern = lt;

exports.bindable = M;

exports.bindingBehavior = vt;

exports.bindingCommand = ki;

exports.capture = ti;

exports.children = lo;

exports.coercer = N;

exports.containerless = Ts;

exports.convertToRenderLocation = ks;

exports.cssModules = ae;

exports.customAttribute = zt;

exports.customElement = Ss;

exports.getEffectiveParentNode = bs;

exports.getRef = ds;

exports.isCustomElementController = qe;

exports.isCustomElementViewModel = $e;

exports.isInstruction = ni;

exports.isRenderLocation = As;

exports.lifecycleHooks = Ae;

exports.mixinAstEvaluator = St;

exports.mixinUseScope = Rt;

exports.mixingBindingLimited = Pt;

exports.processContent = Zs;

exports.registerAliases = et;

exports.renderer = li;

exports.setEffectiveParentNode = ys;

exports.setRef = ps;

exports.shadowCSS = ce;

exports.strict = Ls;

exports.templateCompilerHooks = ln;

exports.templateController = Gt;

exports.useShadowDOM = Is;

exports.valueConverter = kt;

exports.watch = Nt;
//# sourceMappingURL=index.cjs.map
