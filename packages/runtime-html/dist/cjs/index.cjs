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

const S = g.keys;

const R = b();

const I = (t, e, s) => {
    if (true === R[e]) return true;
    if (!P(e)) return false;
    const i = e.slice(0, 5);
    return R[e] = "aria-" === i || "data-" === i || s.isStandardSvgAttribute(t, e);
};

const T = t => t instanceof Promise;

const L = t => t instanceof Array;

const E = t => "function" === typeof t;

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

const M = (t, e, s) => t.addSignalListener(e, s);

const F = (t, e, s) => t.removeSignalListener(e, s);

function O(t, e) {
    let s;
    function i(t, e) {
        if (arguments.length > 1) s.property = e;
        a(N, BindableDefinition.create(e, t, s), t.constructor, e);
        x(t.constructor, j.keyFrom(e));
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

function V(t) {
    return t.startsWith(N);
}

const N = f("bindable");

const j = A({
    name: N,
    keyFrom: t => `${N}:${t}`,
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
            if (i(t)) t.forEach(n); else if (t instanceof BindableDefinition) s[t.property] = t; else if (void 0 !== t) S(t).forEach((e => r(e, t[e])));
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
                if (!h(N, t, n)) x(t, j.keyFrom(n));
                a(N, e, t, n);
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
        const s = N.length + 1;
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
            h = m(c).filter(V);
            a = h.length;
            for (u = 0; u < a; ++u) i[o++] = l(N, c, h[u].slice(s));
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
        return new BindableDefinition(t.firstDefined(i.attribute, t.kebabCase(e)), t.firstDefined(i.callback, `${e}Changed`), t.firstDefined(i.mode, 2), t.firstDefined(i.primary, false), t.firstDefined(i.property, e), t.firstDefined(i.set, z(e, s, i)));
    }
}

function H(t, e, s) {
    W.define(t, e);
}

const W = {
    key: f("coercer"),
    define(t, e) {
        a(W.key, t[e].bind(t), t);
    },
    for(t) {
        return l(W.key, t);
    }
};

function z(s, i, n = {}) {
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
            o = "function" === typeof e ? e.bind(r) : W.for(r) ?? t.noop;
            break;
        }
    }
    return o === t.noop ? o : G(o, n.nullable);
}

function G(t, e) {
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
        const a = this.u = E(l);
        const c = this.A = E(h);
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

const X = function(e) {
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

const K = e => {
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

const Q = t.DI.createInterface;

const Y = t.Registration.singleton;

const Z = t.Registration.aliasTo;

const J = t.Registration.instance;

t.Registration.callback;

const tt = t.Registration.transient;

const et = (t, e, s) => t.registerResolver(e, s);

function st(...t) {
    return function(e) {
        const s = f("aliases");
        const i = l(s, e);
        if (void 0 === i) a(s, t, e); else i.push(...t);
    };
}

function it(e, s, i, n) {
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

const nt = Q("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

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
        i = i.filter(rt);
        if (i.length > 0) {
            i.sort(ot);
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

function rt(t) {
    return t.M;
}

function ot(t, e) {
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

const lt = Q("IAttributePattern");

const ht = Q("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(e, s) {
        this.Y = {};
        this.Z = e;
        const i = this.F = {};
        const n = s.reduce(((t, e) => {
            const s = ft(e.constructor);
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

AttributeParser.inject = [ nt, t.all(lt) ];

function at(...t) {
    return function e(s) {
        return dt.define(t, s);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        Y(lt, this.Type).register(t);
    }
}

const ct = d("attribute-pattern");

const ut = "attribute-pattern-definitions";

const ft = e => t.Protocol.annotation.get(e, ut);

const dt = A({
    name: ct,
    definitionAnnotationKey: ut,
    define(e, s) {
        const i = new AttributePatternResourceDefinition(s);
        a(ct, i, s);
        p(s, ct);
        t.Protocol.annotation.set(s, ut, e);
        x(s, ut);
        return s;
    },
    getPatternDefinitions: ft
});

exports.DotSeparatedAttributePattern = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], s[1]);
    }
    "PART.PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, `${s[0]}.${s[1]}`, s[2]);
    }
};

exports.DotSeparatedAttributePattern = r([ at({
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

exports.RefAttributePattern = r([ at({
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

exports.ColonPrefixedBindAttributePattern = r([ at({
    pattern: ":PART",
    symbols: ":"
}) ], exports.ColonPrefixedBindAttributePattern);

exports.AtPrefixedTriggerAttributePattern = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger");
    }
};

exports.AtPrefixedTriggerAttributePattern = r([ at({
    pattern: "@PART",
    symbols: "@"
}) ], exports.AtPrefixedTriggerAttributePattern);

let pt = class SpreadAttributePattern {
    "...$attrs"(t, e, s) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

pt = r([ at({
    pattern: "...$attrs",
    symbols: ""
}) ], pt);

const xt = "au-start";

const mt = "au-end";

const gt = (t, e) => t.document.createElement(e);

const vt = (t, e) => t.document.createComment(e);

const wt = t => {
    const e = vt(t, mt);
    e.$start = vt(t, xt);
    return e;
};

const bt = (t, e) => t.document.createTextNode(e);

const yt = (t, e, s) => t.insertBefore(e, s);

const kt = (t, e, s) => {
    if (null === t) return;
    const i = s.length;
    let n = 0;
    while (i > n) {
        t.insertBefore(s[n], e);
        ++n;
    }
};

const At = t => t.previousSibling;

const Ct = (t, e) => t.content.appendChild(e);

const Bt = (t, e) => {
    const s = e.length;
    let i = 0;
    while (s > i) {
        t.content.appendChild(e[i]);
        ++i;
    }
};

const St = t => {
    const e = t.previousSibling;
    let s;
    if (8 === e?.nodeType && "au-end" === e.textContent) {
        s = e;
        if (null == (s.$start = s.previousSibling)) throw It();
        t.parentNode?.removeChild(t);
        return s;
    } else throw It();
};

const Rt = (t, e) => new t.ownerDocument.defaultView.MutationObserver(e);

const It = () => y(`AURxxxx`);

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
            Tt(this.o, this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) Lt(this.o, this);
    }
    it() {
        _t = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, _t);
    }
}

s.subscriberCollection(AttributeObserver);

const Tt = (t, e) => {
    if (void 0 === t.$eMObs) t.$eMObs = new Set;
    if (void 0 === t.$mObs) (t.$mObs = Rt(t, Et)).observe(t, {
        attributes: true
    });
    t.$eMObs.add(e);
};

const Lt = (t, e) => {
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

const Et = t => {
    t[0].target.$eMObs.forEach(Pt, t);
};

function Pt(t) {
    t.handleMutation(this);
}

let _t;

function qt(t) {
    return function(e) {
        return Dt.define(t, e);
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
        return new BindingBehaviorDefinition(s, t.firstDefined(Ut(s, "name"), i), t.mergeArrays(Ut(s, "aliases"), n.aliases, s.aliases), Dt.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        Y(s, e).register(t);
        Z(s, e).register(t);
        it(i, Dt, s, t);
    }
}

const $t = d("binding-behavior");

const Ut = (t, e) => l(f(e), t);

const Dt = A({
    name: $t,
    keyFrom(t) {
        return `${$t}:${t}`;
    },
    isType(t) {
        return E(t) && h($t, t);
    },
    define(t, e) {
        const s = BindingBehaviorDefinition.create(t, e);
        a($t, s, s.Type);
        a($t, s, s);
        p(e, $t);
        return s.Type;
    },
    getDefinition(t) {
        const e = l($t, t);
        if (void 0 === e) throw y(`AUR0151:${t.name}`);
        return e;
    },
    annotate(t, e, s) {
        a(f(e), s, t);
    },
    getAnnotation: Ut
});

function Mt(t) {
    return function(e) {
        return Vt.define(t, e);
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
        return new ValueConverterDefinition(s, t.firstDefined(Ot(s, "name"), i), t.mergeArrays(Ot(s, "aliases"), n.aliases, s.aliases), Vt.keyFrom(i));
    }
    register(e) {
        const {Type: s, key: i, aliases: n} = this;
        t.Registration.singleton(i, s).register(e);
        t.Registration.aliasTo(i, s).register(e);
        it(n, Vt, i, e);
    }
}

const Ft = d("value-converter");

const Ot = (t, e) => l(f(e), t);

const Vt = A({
    name: Ft,
    keyFrom: t => `${Ft}:${t}`,
    isType(t) {
        return E(t) && h(Ft, t);
    },
    define(t, e) {
        const s = ValueConverterDefinition.create(t, e);
        a(Ft, s, s.Type);
        a(Ft, s, s);
        p(e, Ft);
        return s.Type;
    },
    getDefinition(t) {
        const e = l(Ft, t);
        if (void 0 === e) throw y(`AUR0152:${t.name}`);
        return e;
    },
    annotate(t, e, s) {
        a(f(e), s, t);
    },
    getAnnotation: Ot
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

const Nt = t => {
    D(t.prototype, "useScope", (function(t) {
        this.s = t;
    }));
};

const jt = (t, e = true) => i => {
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
        const e = Vt.keyFrom(t);
        let s = Ht.get(this);
        if (null == s) Ht.set(this, s = new ResourceLookup);
        return s[e] ?? (s[e] = this.l.get(X(e)));
    }));
    D(n, "getBehavior", (function(t) {
        const e = Dt.keyFrom(t);
        let s = Ht.get(this);
        if (null == s) Ht.set(this, s = new ResourceLookup);
        return s[e] ?? (s[e] = this.l.get(X(e)));
    }));
};

const Ht = new WeakMap;

class ResourceLookup {}

const Wt = Q("IFlushQueue", (t => t.singleton(FlushQueue)));

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
            this.ot.forEach(zt);
        } finally {
            this.rt = false;
        }
    }
    clear() {
        this.ot.clear();
        this.rt = false;
    }
}

function zt(t, e, s) {
    s.delete(t);
    t.flush();
}

const Gt = new WeakSet;

const Xt = (t, e) => {
    D(t.prototype, "limit", (function(t) {
        if (Gt.has(this)) throw y(`AURXXXX: a rate limit has already been applied.`);
        Gt.add(this);
        const i = e(this, t);
        const n = t.signals;
        const r = n.length > 0 ? this.get(s.ISignaler) : null;
        const o = this[i];
        const l = (...t) => o.call(this, ...t);
        const h = "debounce" === t.type ? Kt(t, l, this) : Qt(t, l, this);
        const a = r ? {
            handleChange: h.flush
        } : null;
        this[i] = h;
        if (r) n.forEach((t => M(r, t, a)));
        return {
            dispose: () => {
                if (r) n.forEach((t => F(r, t, a)));
                Gt.delete(this);
                h.dispose();
                delete this[i];
            }
        };
    }));
};

const Kt = (t, e, s) => {
    let i;
    let n;
    let r;
    let o = false;
    const l = t.queue;
    const h = () => e(r);
    const a = e => {
        r = e;
        if (s.isBound) {
            n = i;
            i = l.queueTask(h, {
                delay: t.delay,
                reusable: false
            });
            n?.cancel();
        } else h();
    };
    const c = a.dispose = () => {
        n?.cancel();
        i?.cancel();
        n = i = void 0;
    };
    a.flush = () => {
        o = 0 === i?.status;
        c();
        if (o) h();
    };
    return a;
};

const Qt = (t, e, s) => {
    let i;
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
        if (s.isBound) {
            o = c() - r;
            n = i;
            if (o > t.delay) {
                r = c();
                u();
            } else i = a.queueTask((() => {
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
        i?.cancel();
        n = i = void 0;
    };
    f.flush = () => {
        h = 0 === i?.status;
        d();
        if (h) u();
    };
    return f;
};

const Yt = {
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
                }), Yt);
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

Nt(AttributeBinding);

Xt(AttributeBinding, (() => "updateTarget"));

s.connectable(AttributeBinding);

jt(true)(AttributeBinding);

const Zt = {
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
            }), Zt);
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
            if (L(t)) this.observeCollection(t);
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
        if (L(this.v)) this.observeCollection(this.v);
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

Nt(InterpolationPartBinding);

Xt(InterpolationPartBinding, (() => "updateTarget"));

s.connectable(InterpolationPartBinding);

jt(true)(InterpolationPartBinding);

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
        if (L(t)) this.observeCollection(t);
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
        if (L(e)) this.observeCollection(e);
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
        }), Zt);
        e?.cancel();
    }
}

Nt(ContentBinding);

Xt(ContentBinding, (() => "updateTarget"));

s.connectable()(ContentBinding);

jt(void 0, false)(ContentBinding);

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

Nt(LetBinding);

Xt(LetBinding, (() => "updateTarget"));

s.connectable(LetBinding);

jt(true)(LetBinding);

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
            Jt = this.lt;
            this.lt = this.ct.queueTask((() => {
                this.updateTarget(t);
                this.lt = null;
            }), te);
            Jt?.cancel();
            Jt = null;
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
            n.subscribe(this.gt ?? (this.gt = new BindingTargetSubscriber(this, this.l.get(Wt))));
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

Nt(PropertyBinding);

Xt(PropertyBinding, (t => 4 & t.mode ? "updateSource" : "updateTarget"));

s.connectable(PropertyBinding);

jt(true, false)(PropertyBinding);

let Jt = null;

const te = {
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

jt(false)(RefBinding);

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
        if (E(i)) i = i(t);
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

Nt(ListenerBinding);

Xt(ListenerBinding, (() => "callSource"));

jt(true, true)(ListenerBinding);

const ee = Q("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(J(ee, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return null === t ? e() : e(this.c.get(t));
    }
}

const se = A({
    creating: ie("creating"),
    hydrating: ie("hydrating"),
    hydrated: ie("hydrated"),
    activating: ie("activating"),
    activated: ie("activated"),
    deactivating: ie("deactivating"),
    deactivated: ie("deactivated")
});

function ie(t) {
    function e(e, s) {
        if (E(s)) return new $AppTask(t, e, s);
        return new $AppTask(t, null, e);
    }
    return e;
}

function ne(t, e) {
    if (null == t) throw y(`AUR0772`);
    return function s(i, n, r) {
        const o = null == n;
        const l = o ? i : i.constructor;
        const h = new WatchDefinition(t, o ? e : r.value);
        if (o) {
            if (!E(e) && (null == e || !(e in l.prototype))) throw y(`AUR0773:${v(e)}@${l.name}}`);
        } else if (!E(r?.value)) throw y(`AUR0774:${v(n)}`);
        le.add(l, h);
        if (de(l)) me(l).watches.push(h);
        if (Gs(l)) Qs(l).watches.push(h);
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const re = t.emptyArray;

const oe = f("watch");

const le = A({
    name: oe,
    add(t, e) {
        let s = l(oe, t);
        if (null == s) a(oe, s = [], t);
        s.push(e);
    },
    getAnnotation(t) {
        return l(oe, t) ?? re;
    }
});

function he(t) {
    return function(e) {
        return xe(t, e);
    };
}

function ae(t) {
    return function(e) {
        return xe(P(t) ? {
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
        return new CustomAttributeDefinition(s, t.firstDefined(fe(s, "name"), i), t.mergeArrays(fe(s, "aliases"), n.aliases, s.aliases), ue(i), t.firstDefined(fe(s, "defaultBindingMode"), n.defaultBindingMode, s.defaultBindingMode, 2), t.firstDefined(fe(s, "isTemplateController"), n.isTemplateController, s.isTemplateController, false), j.from(s, ...j.getAll(s), fe(s, "bindables"), s.bindables, n.bindables), t.firstDefined(fe(s, "noMultiBindings"), n.noMultiBindings, s.noMultiBindings, false), t.mergeArrays(le.getAnnotation(s), s.watches), t.mergeArrays(fe(s, "dependencies"), n.dependencies, s.dependencies));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        tt(s, e).register(t);
        Z(s, e).register(t);
        it(i, ge, s, t);
    }
}

const ce = d("custom-attribute");

const ue = t => `${ce}:${t}`;

const fe = (t, e) => l(f(e), t);

const de = t => E(t) && h(ce, t);

const pe = (t, e) => ms(t, ue(e)) ?? void 0;

const xe = (t, e) => {
    const s = CustomAttributeDefinition.create(t, e);
    a(ce, s, s.Type);
    a(ce, s, s);
    p(e, ce);
    return s.Type;
};

const me = t => {
    const e = l(ce, t);
    if (void 0 === e) throw y(`AUR0759:${t.name}`);
    return e;
};

const ge = A({
    name: ce,
    keyFrom: ue,
    isType: de,
    for: pe,
    define: xe,
    getDefinition: me,
    annotate(t, e, s) {
        a(f(e), s, t);
    },
    getAnnotation: fe
});

const ve = t.IPlatform;

const we = (t, e, s, i) => {
    t.addEventListener(e, s, i);
};

const be = (t, e, s, i) => {
    t.removeEventListener(e, s, i);
};

const ye = t => {
    let e;
    const s = t.prototype;
    D(s, "subscribe", (function(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            for (e of this.cf.events) we(this.wt, e, this);
            this.bt = true;
            this.yt?.();
        }
    }));
    D(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) {
            for (e of this.cf.events) be(this.wt, e, this);
            this.bt = false;
            this.kt?.();
        }
    }));
    D(s, "useConfig", (function(t) {
        this.cf = t;
        if (this.bt) {
            for (e of this.cf.events) be(this.wt, e, this);
            for (e of this.cf.events) we(this.wt, e, this);
        }
    }));
};

const ke = e => {
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
            const s = Ae(t);
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

function Ae(e) {
    if (P(e)) return Ce(e);
    if ("object" !== typeof e) return t.emptyArray;
    if (e instanceof Array) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) t.push(...Ae(e[i]));
            return t;
        } else return t.emptyArray;
    }
    const s = [];
    let i;
    for (i in e) if (Boolean(e[i])) if (i.includes(" ")) s.push(...Ce(i)); else s.push(i);
    return s;
}

function Ce(e) {
    const s = e.match(/\S+/g);
    if (null === s) return t.emptyArray;
    return s;
}

ke(ClassAttributeAccessor);

function Be(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        var e;
        const s = C({}, ...this.modules);
        const i = xe({
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
                this.St.setValue(this.value?.split(/\s+/g).map((t => s[t] || t)) ?? "");
            }
        }, e.inject = [ vs ], e));
        t.register(i, J(ys, s));
    }
}

function Se(...t) {
    return new ShadowDOMRegistry(t);
}

const Re = Q("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(ve))) return t.get(AdoptedStyleSheetsStylesFactory);
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(Te);
        const s = t.get(Re);
        t.register(J(Ie, s.createStyles(this.css, e)));
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

AdoptedStyleSheetsStylesFactory.inject = [ ve ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ ve ];

const Ie = Q("IShadowDOMStyles");

const Te = Q("IShadowDOMGlobalStyles", (e => e.instance({
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

const Le = {
    shadowDOM(e) {
        return se.creating(t.IContainer, (t => {
            if (null != e.sharedStyles) {
                const s = t.get(Re);
                t.register(J(Te, s.createStyles(e.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Ee, exit: Pe} = s.ConnectableSwitcher;

const {wrap: _e, unwrap: qe} = s.ProxyObservable;

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
            Ee(this);
            return this.v = qe(this.$get.call(void 0, this.useProxy ? _e(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Pe(this);
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
        this.Rt = i;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.Rt;
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
        this.v = s.astEvaluate(this.Rt, this.scope, this, this);
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

jt(true)(ExpressionWatcher);

const $e = Q("ILifecycleHooks");

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
        Y($e, this.Type).register(t);
    }
}

const Ue = new WeakMap;

const De = f("lifecycle-hooks");

const Me = A({
    name: De,
    define(t, e) {
        const s = LifecycleHooksDefinition.create(t, e);
        a(De, s, e);
        p(e, De);
        return s.Type;
    },
    resolve(t) {
        let e = Ue.get(t);
        if (void 0 === e) {
            Ue.set(t, e = new LifecycleHooksLookupImpl);
            const s = t.root;
            const i = s.id === t.id ? t.getAll($e) : t.has($e, false) ? s.getAll($e).concat(t.getAll($e)) : s.getAll($e);
            let n;
            let r;
            let o;
            let h;
            let a;
            for (n of i) {
                r = l(De, n.constructor);
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

function Fe() {
    return function t(e) {
        return Me.define({}, e);
    };
}

const Oe = Q("IViewFactory");

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

const Ve = Q("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.Tt ?? (this.Tt = this.Lt.getAll(ci, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), b()));
    }
    constructor(t) {
        this.Et = new WeakMap;
        this.Pt = new WeakMap;
        const e = t.root;
        this.p = (this.Lt = e).get(ve);
        this.ep = e.get(s.IExpressionParser);
        this.oL = e.get(s.IObserverLocator);
        this._t = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, s) {
        if (false !== t.needsCompile) {
            const i = this.Et;
            const n = e.get(ai);
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

var Ne;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Ne || (Ne = {}));

const je = {
    optional: true
};

const He = new WeakMap;

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
        this.r = t.root.get(Ve);
    }
    static getCached(t) {
        return He.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (void 0 === e) throw y(`AUR0500:${t}`);
        return e;
    }
    static $el(e, s, i, n, r = void 0, o = null) {
        if (He.has(s)) return He.get(s);
        r = r ?? Qs(s.constructor);
        const l = new Controller(e, 0, r, null, s, i, o);
        const h = e.get(t.optional(es));
        if (r.dependencies.length > 0) e.register(...r.dependencies);
        et(e, es, new t.InstanceProvider("IHydrationContext", new HydrationContext(l, n, h)));
        He.set(s, l);
        if (null == n || false !== n.hydrate) l.hE(n, h);
        return l;
    }
    static $attr(t, e, s, i) {
        if (He.has(e)) return He.get(e);
        i = i ?? me(e.constructor);
        const n = new Controller(t, 1, i, null, e, s, null);
        if (i.dependencies.length > 0) t.register(...i.dependencies);
        He.set(e, n);
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
        if (o.watches.length > 0) Ke(this, n, o, r);
        ze(this, o, r);
        if (this.$t.hasDefine) {
            const t = r.define(this, i, o);
            if (void 0 !== t && t !== o) o = CustomElementDefinition.getOrCreate(t);
        }
        this.qt = Me.resolve(n);
        o.register(n);
        if (null !== o.injectable) et(n, o.injectable, new t.InstanceProvider("definition.injectable", r));
        if (null == e || false !== e.hydrate) {
            this.hS(e);
            this.hC();
        }
    }
    hS(t) {
        if (null != this.qt.hydrating) this.qt.hydrating.forEach(ns, this);
        if (this.$t.hasHydrating) this.Ut.hydrating(this);
        const e = this.jt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: s, isStrictBinding: i, hasSlots: n, containerless: r} = e;
        let o = this.location;
        this.isStrictBinding = i;
        if (null !== (this.hostController = Xs(this.host, je))) {
            this.host = this.container.root.get(ve).document.createElement(this.definition.name);
            if (r && null == o) o = this.location = Bs(this.host);
        }
        gs(this.host, Ns, this);
        gs(this.host, this.definition.key, this);
        if (null !== s || n) {
            if (null != o) throw y(`AUR0501`);
            gs(this.shadowRoot = this.host.attachShadow(s ?? Ze), Ns, this);
            gs(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (null != o) {
            gs(o, Ns, this);
            gs(o, this.definition.key, this);
            this.mountTarget = 3;
        } else this.mountTarget = 1;
        this.Ut.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (void 0 !== this.qt.hydrated) this.qt.hydrated.forEach(rs, this);
        if (this.$t.hasHydrated) this.Ut.hydrated(this);
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.jt, this.host);
        if (void 0 !== this.qt.created) this.qt.created.forEach(is, this);
        if (this.$t.hasCreated) this.Ut.created(this);
    }
    Vt() {
        const t = this.definition;
        const e = this.Ut;
        if (t.watches.length > 0) Ke(this, this.container, t, e);
        ze(this, t, e);
        e.$controller = this;
        this.qt = Me.resolve(this.container);
        if (void 0 !== this.qt.created) this.qt.created.forEach(is, this);
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
            throw y(`AUR0503:${this.name} ${Je(this.state)}`);
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
        if (2 !== this.vmKind && null != this.qt.binding) n = t.resolveAll(...this.qt.binding.map(os, this));
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
        if (2 !== this.vmKind && null != this.qt.bound) i = t.resolveAll(...this.qt.bound.map(ls, this));
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
                const e = t.has(Ie, false) ? t.get(Ie) : t.get(Te);
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
        if (2 !== this.vmKind && null != this.qt.attaching) s = t.resolveAll(...this.qt.attaching.map(hs, this));
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
            throw y(`AUR0505:${this.name} ${Je(this.state)}`);
        }
        this.$initiator = e;
        if (e === this) this.Qt();
        let i = 0;
        let n;
        if (null !== this.children) for (i = 0; i < this.children.length; ++i) void this.children[i].deactivate(e, this);
        if (2 !== this.vmKind && null != this.qt.detaching) n = t.resolveAll(...this.qt.detaching.map(cs, this));
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
            if (2 !== this.vmKind && null != this.qt.attached) ps = t.resolveAll(...this.qt.attached.map(as, this));
            if (this.$t.hasAttached) ps = t.resolveAll(ps, this.Ut.attached(this.$initiator));
            if (T(ps)) {
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
            let e = this.$initiator.head;
            let s;
            while (null !== e) {
                if (e !== this) {
                    if (e.debug) e.logger.trace(`detach()`);
                    e.removeNodes();
                }
                if (2 !== e.vmKind && null != e.qt.unbinding) s = t.resolveAll(...e.qt.unbinding.map(us, this));
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
            return me(this.Ut.constructor).name === t;

          case 0:
            return Qs(this.Ut.constructor).name === t;

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
            gs(t, Ns, this);
            gs(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (0 === this.vmKind) {
            gs(t, Ns, this);
            gs(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (0 === this.vmKind) {
            gs(t, Ns, this);
            gs(t, this.definition.key, this);
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
            this.children.forEach(ss);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (null !== this.Ut) {
            He.delete(this.Ut);
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

function We(t) {
    let e = t.$observers;
    if (void 0 === e) Reflect.defineProperty(t, "$observers", {
        enumerable: false,
        value: e = {}
    });
    return e;
}

function ze(t, e, i) {
    const n = e.bindables;
    const r = B(n);
    const o = r.length;
    if (o > 0) {
        let e;
        let l;
        let h = 0;
        const a = We(i);
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

const Ge = new Map;

const Xe = t => {
    let e = Ge.get(t);
    if (null == e) {
        e = new s.AccessScopeExpression(t, 0);
        Ge.set(t, e);
    }
    return e;
};

function Ke(t, e, i, n) {
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
        u = E(u) ? u : Reflect.get(n, u);
        if (!E(u)) throw y(`AUR0506:${v(u)}`);
        if (E(c)) t.addBinding(new ComputedWatcher(n, r, c, u, true)); else {
            f = P(c) ? o.parse(c, 16) : Xe(c);
            t.addBinding(new ExpressionWatcher(h, e, r, f, u));
        }
    }
}

function Qe(t) {
    return t instanceof Controller && 0 === t.vmKind;
}

function Ye(t) {
    return e.isObject(t) && Gs(t.constructor);
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

const Ze = {
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

function Je(t) {
    const e = [];
    if (1 === (1 & t)) e.push("activating");
    if (2 === (2 & t)) e.push("activated");
    if (4 === (4 & t)) e.push("deactivating");
    if (8 === (8 & t)) e.push("deactivated");
    if (16 === (16 & t)) e.push("released");
    if (32 === (32 & t)) e.push("disposed");
    return 0 === e.length ? "none" : e.join("|");
}

const ts = Q("IController");

const es = Q("IHydrationContext");

class HydrationContext {
    constructor(t, e, s) {
        this.instruction = e;
        this.parent = s;
        this.controller = t;
    }
}

function ss(t) {
    t.dispose();
}

function is(t) {
    t.instance.created(this.Ut, this);
}

function ns(t) {
    t.instance.hydrating(this.Ut, this);
}

function rs(t) {
    t.instance.hydrated(this.Ut, this);
}

function os(t) {
    return t.instance.binding(this.Ut, this["$initiator"], this.parent);
}

function ls(t) {
    return t.instance.bound(this.Ut, this["$initiator"], this.parent);
}

function hs(t) {
    return t.instance.attaching(this.Ut, this["$initiator"], this.parent);
}

function as(t) {
    return t.instance.attached(this.Ut, this["$initiator"]);
}

function cs(t) {
    return t.instance.detaching(this.Ut, this["$initiator"], this.parent);
}

function us(t) {
    return t.instance.unbinding(this.Ut, this["$initiator"], this.parent);
}

let fs;

let ds;

let ps;

const xs = Q("IAppRoot");

class AppRoot {
    constructor(e, s, i, n) {
        this.config = e;
        this.platform = s;
        this.container = i;
        this.controller = void 0;
        this.ee = void 0;
        this.host = e.host;
        n.prepare(this);
        et(i, s.HTMLElement, et(i, s.Element, et(i, vs, new t.InstanceProvider("ElementResolver", e.host))));
        this.ee = t.onResolve(this.se("creating"), (() => {
            const s = e.component;
            const n = i.createChild();
            let r;
            if (Gs(s)) r = this.container.get(s); else r = e.component;
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
        return t.resolveAll(...this.container.getAll(ee).reduce(((t, s) => {
            if (s.slot === e) t.push(s.run());
            return t;
        }), []));
    }
    dispose() {
        this.controller?.dispose();
    }
}

class Refs {}

function ms(t, e) {
    return t.$au?.[e] ?? null;
}

function gs(t, e, s) {
    var i;
    ((i = t).$au ?? (i.$au = new Refs))[e] = s;
}

const vs = Q("INode");

const ws = Q("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(xs, true)) return t.get(xs).host;
    return t.get(ve).document;
}))));

const bs = Q("IRenderLocation");

const ys = Q("CssModules");

const ks = new WeakMap;

function As(t) {
    if (ks.has(t)) return ks.get(t);
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
        const e = Xs(t);
        if (void 0 === e) return null;
        if (2 === e.mountTarget) return As(e.host);
    }
    return t.parentNode;
}

function Cs(t, e) {
    if (void 0 !== t.platform && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) ks.set(s[t], e);
    } else ks.set(t, e);
}

function Bs(t) {
    if (Ss(t)) return t;
    const e = t.ownerDocument.createComment("au-end");
    const s = e.$start = t.ownerDocument.createComment("au-start");
    const i = t.parentNode;
    if (null !== i) {
        i.replaceChild(e, t);
        i.insertBefore(s, e);
    }
    return e;
}

function Ss(t) {
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
            if ("AU-M" === r.nodeName) o[i] = St(r); else o[i] = r;
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
        if (Ss(t)) this.ref = t; else {
            this.next = t;
            this.le();
        }
    }
    le() {
        if (void 0 !== this.next) this.ref = this.next.firstChild; else this.ref = void 0;
    }
}

const Rs = Q("IWindow", (t => t.callback((t => t.get(ve).window))));

const Is = Q("ILocation", (t => t.callback((t => t.get(Rs).location))));

const Ts = Q("IHistory", (t => t.callback((t => t.get(Rs).history))));

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
    if (!E(t)) return function(e) {
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
    const e = l(Ns, t);
    if (void 0 === e) {
        Ws(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

function qs(t) {
    if (void 0 === t) return function(t) {
        Ws(t, "isStrictBinding", true);
    };
    Ws(t, "isStrictBinding", true);
}

const $s = new WeakMap;

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
            const n = t.fromDefinitionOrDefault("name", i, Hs);
            if (E(i.Type)) s = i.Type; else s = Zs(t.pascalCase(n));
            return new CustomElementDefinition(s, n, t.mergeArrays(i.aliases), t.fromDefinitionOrDefault("key", i, (() => js(n))), t.fromDefinitionOrDefault("cache", i, Ds), t.fromDefinitionOrDefault("capture", i, Fs), t.fromDefinitionOrDefault("template", i, Ms), t.mergeArrays(i.instructions), t.mergeArrays(i.dependencies), t.fromDefinitionOrDefault("injectable", i, Ms), t.fromDefinitionOrDefault("needsCompile", i, Os), t.mergeArrays(i.surrogates), j.from(s, i.bindables), t.fromDefinitionOrDefault("containerless", i, Fs), t.fromDefinitionOrDefault("isStrictBinding", i, Fs), t.fromDefinitionOrDefault("shadowOptions", i, Ms), t.fromDefinitionOrDefault("hasSlots", i, Fs), t.fromDefinitionOrDefault("enhance", i, Fs), t.fromDefinitionOrDefault("watches", i, Vs), t.fromAnnotationOrTypeOrDefault("processContent", s, Ms));
        }
        if (P(e)) return new CustomElementDefinition(s, e, t.mergeArrays(Ks(s, "aliases"), s.aliases), js(e), t.fromAnnotationOrTypeOrDefault("cache", s, Ds), t.fromAnnotationOrTypeOrDefault("capture", s, Fs), t.fromAnnotationOrTypeOrDefault("template", s, Ms), t.mergeArrays(Ks(s, "instructions"), s.instructions), t.mergeArrays(Ks(s, "dependencies"), s.dependencies), t.fromAnnotationOrTypeOrDefault("injectable", s, Ms), t.fromAnnotationOrTypeOrDefault("needsCompile", s, Os), t.mergeArrays(Ks(s, "surrogates"), s.surrogates), j.from(s, ...j.getAll(s), Ks(s, "bindables"), s.bindables), t.fromAnnotationOrTypeOrDefault("containerless", s, Fs), t.fromAnnotationOrTypeOrDefault("isStrictBinding", s, Fs), t.fromAnnotationOrTypeOrDefault("shadowOptions", s, Ms), t.fromAnnotationOrTypeOrDefault("hasSlots", s, Fs), t.fromAnnotationOrTypeOrDefault("enhance", s, Fs), t.mergeArrays(le.getAnnotation(s), s.watches), t.fromAnnotationOrTypeOrDefault("processContent", s, Ms));
        const i = t.fromDefinitionOrDefault("name", e, Hs);
        return new CustomElementDefinition(s, i, t.mergeArrays(Ks(s, "aliases"), e.aliases, s.aliases), js(i), t.fromAnnotationOrDefinitionOrTypeOrDefault("cache", e, s, Ds), t.fromAnnotationOrDefinitionOrTypeOrDefault("capture", e, s, Fs), t.fromAnnotationOrDefinitionOrTypeOrDefault("template", e, s, Ms), t.mergeArrays(Ks(s, "instructions"), e.instructions, s.instructions), t.mergeArrays(Ks(s, "dependencies"), e.dependencies, s.dependencies), t.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", e, s, Ms), t.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", e, s, Os), t.mergeArrays(Ks(s, "surrogates"), e.surrogates, s.surrogates), j.from(s, ...j.getAll(s), Ks(s, "bindables"), s.bindables, e.bindables), t.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", e, s, Fs), t.fromAnnotationOrDefinitionOrTypeOrDefault("isStrictBinding", e, s, Fs), t.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", e, s, Ms), t.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", e, s, Fs), t.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", e, s, Fs), t.mergeArrays(e.watches, le.getAnnotation(s), s.watches), t.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", e, s, Ms));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) return t;
        if ($s.has(t)) return $s.get(t);
        const e = CustomElementDefinition.create(t);
        $s.set(t, e);
        a(Ns, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        if (!t.has(s, false)) {
            tt(s, e).register(t);
            Z(s, e).register(t);
            it(i, Js, s, t);
        }
    }
}

const Us = {
    name: void 0,
    searchParents: false,
    optional: false
};

const Ds = () => 0;

const Ms = () => null;

const Fs = () => false;

const Os = () => true;

const Vs = () => t.emptyArray;

const Ns = d("custom-element");

const js = t => `${Ns}:${t}`;

const Hs = (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const Ws = (t, e, s) => {
    a(f(e), s, t);
};

const zs = (t, e) => {
    const s = CustomElementDefinition.create(t, e);
    a(Ns, s, s.Type);
    a(Ns, s, s);
    p(s.Type, Ns);
    return s.Type;
};

const Gs = t => E(t) && h(Ns, t);

const Xs = (t, e = Us) => {
    if (void 0 === e.name && true !== e.searchParents) {
        const s = ms(t, Ns);
        if (null === s) {
            if (true === e.optional) return null;
            throw y(`AUR0762`);
        }
        return s;
    }
    if (void 0 !== e.name) {
        if (true !== e.searchParents) {
            const s = ms(t, Ns);
            if (null === s) throw y(`AUR0763`);
            if (s.is(e.name)) return s;
            return;
        }
        let s = t;
        let i = false;
        while (null !== s) {
            const t = ms(s, Ns);
            if (null !== t) {
                i = true;
                if (t.is(e.name)) return t;
            }
            s = As(s);
        }
        if (i) return;
        throw y(`AUR0764`);
    }
    let s = t;
    while (null !== s) {
        const t = ms(s, Ns);
        if (null !== t) return t;
        s = As(s);
    }
    throw y(`AUR0765`);
};

const Ks = (t, e) => l(f(e), t);

const Qs = t => {
    const e = l(Ns, t);
    if (void 0 === e) throw y(`AUR0760:${t.name}`);
    return e;
};

const Ys = () => {
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

const Zs = function() {
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

const Js = A({
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

const ti = f("processContent");

function ei(t) {
    return void 0 === t ? function(t, e, s) {
        a(ti, si(t, e), t);
    } : function(e) {
        t = si(e, t);
        const s = l(Ns, e);
        if (void 0 !== s) s.processContent = t; else a(ti, t, e);
        return e;
    };
}

function si(t, e) {
    if (P(e)) e = t[e];
    if (!E(e)) throw y(`AUR0766:${typeof e}`);
    return e;
}

function ii(t) {
    return function(e) {
        const s = E(t) ? t : true;
        Ws(e, "capture", s);
        if (Gs(e)) Qs(e).capture = s;
    };
}

const ni = Q("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const ri = Q("IAuSlotWatcher");

class AuSlotWatcherBinding {
    static create(t, e, s, i, n) {
        const r = t.viewModel;
        const o = new AuSlotWatcherBinding(r, s, i, n);
        U(r, e, {
            enumerable: true,
            configurable: true,
            get: C((() => o.getValue()), {
                getObserver: () => o
            }),
            set: () => {}
        });
        return o;
    }
    constructor(e, s, i, n) {
        this.he = new Set;
        this.ae = t.emptyArray;
        this.isBound = false;
        this.cb = (this.o = e)[s];
        this.slotName = i;
        this.ce = n;
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
        const s = this.ae;
        const i = [];
        let n;
        let r;
        for (n of this.he) for (r of n === t ? e : n.nodes) if ("*" === this.ce || 1 === r.nodeType && r.matches(this.ce)) i[i.length] = r;
        if (i.length !== s.length || i.some(((t, e) => t !== s[e]))) {
            this.ae = i;
            this.cb?.call(this.o, i);
            this.subs.notify(i, s);
        }
    }
    get() {
        throw new Error("not implemented");
    }
}

s.subscriberCollection(AuSlotWatcherBinding);

class SlottedLifecycleHooks {
    constructor(t) {
        this.def = t;
    }
    register(t) {
        J($e, this).register(t);
    }
    hydrating(t, e) {
        const s = this.def;
        const i = AuSlotWatcherBinding.create(e, s.name, s.callback ?? `${v(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        J(ri, i).register(e.container);
        e.addBinding(i);
    }
}

Fe()(SlottedLifecycleHooks);

function oi(t, e) {
    const s = "dependencies";
    function i(i, n, r) {
        const o = "object" === typeof t ? t : {
            query: t,
            slotName: e,
            name: ""
        };
        o.name = n;
        if ("function" === typeof i || "undefined" !== typeof r?.value) throw new Error(`Invalid usage. @slotted can only be used on a field`);
        const l = i.constructor;
        let h = Js.getAnnotation(l, s);
        if (null == h) Js.annotate(l, s, h = []);
        h.push(new SlottedLifecycleHooks(o));
    }
    return i;
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

const li = Q("Instruction");

function hi(t) {
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

const ai = Q("ITemplateCompiler");

const ci = Q("IRenderer");

function ui(t) {
    return function e(s) {
        s.register = function(t) {
            Y(ci, this).register(t);
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

function fi(t, e, s) {
    if (P(e)) return t.parse(e, s);
    return e;
}

function di(t) {
    if (null != t.viewModel) return t.viewModel;
    return t;
}

function pi(t, e) {
    if ("element" === e) return t;
    switch (e) {
      case "controller":
        return Xs(t);

      case "view":
        throw y(`AUR0750`);

      case "view-model":
        return Xs(t).viewModel;

      default:
        {
            const s = pe(t, e);
            if (void 0 !== s) return s.viewModel;
            const i = Xs(t, {
                name: e
            });
            if (void 0 === i) throw y(`AUR0751:${e}`);
            return i.viewModel;
        }
    }
}

exports.SetPropertyRenderer = class SetPropertyRenderer {
    render(t, e, s) {
        const i = di(e);
        if (void 0 !== i.$observers?.[s.to]) i.$observers[s.to].setValue(s.value); else i[s.to] = s.value;
    }
};

exports.SetPropertyRenderer = r([ ui("re") ], exports.SetPropertyRenderer);

exports.CustomElementRenderer = class CustomElementRenderer {
    static get inject() {
        return [ Ve ];
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
            l = d.find(Js, u);
            if (null == l) throw y(`AUR0752:${u}@${e["name"]}`);
            break;

          default:
            l = u;
        }
        const p = i.containerless || l.containerless;
        const x = p ? Bs(s) : null;
        const m = yi(n, e, s, i, x, null == f ? void 0 : new AuSlotsInfo(S(f)));
        h = l.Type;
        a = m.invoke(h);
        et(m, h, new t.InstanceProvider(l.key, a));
        c = Controller.$el(m, a, s, i, l, x);
        gs(s, l.key, c);
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

exports.CustomElementRenderer = r([ ui("ra") ], exports.CustomElementRenderer);

exports.CustomAttributeRenderer = class CustomAttributeRenderer {
    static get inject() {
        return [ Ve ];
    }
    constructor(t) {
        this.r = t;
    }
    render(t, e, s, i, n, r) {
        let o = t.container;
        let l;
        switch (typeof s.res) {
          case "string":
            l = o.find(ge, s.res);
            if (null == l) throw y(`AUR0753:${s.res}@${t["name"]}`);
            break;

          default:
            l = s.res;
        }
        const h = ki(i, l, t, e, s, void 0, void 0);
        const a = Controller.$attr(h.ctn, h.vm, e, l);
        gs(e, l.key, a);
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

exports.CustomAttributeRenderer = r([ ui("rb") ], exports.CustomAttributeRenderer);

exports.TemplateControllerRenderer = class TemplateControllerRenderer {
    static get inject() {
        return [ Ve, ve ];
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
            l = o.find(ge, s.res);
            if (null == l) throw y(`AUR0754:${s.res}@${t["name"]}`);
            break;

          default:
            l = s.res;
        }
        const h = this.r.getViewFactory(s.def, o);
        const a = Bs(e);
        const c = ki(this.p, l, t, e, s, h, a);
        const u = Controller.$attr(c.ctn, c.vm, e, l);
        gs(a, l.key, u);
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

exports.TemplateControllerRenderer = r([ ui("rc") ], exports.TemplateControllerRenderer);

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
            u = fi(n, c.from, 16);
            t.addBinding(new LetBinding(h, r, u, c.to, l));
            ++f;
        }
    }
};

exports.LetElementRenderer = r([ ui("rd") ], exports.LetElementRenderer);

exports.RefBindingRenderer = class RefBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, fi(n, s.from, 16), pi(e, s.to)));
    }
};

exports.RefBindingRenderer = r([ ui("rj") ], exports.RefBindingRenderer);

exports.InterpolationBindingRenderer = class InterpolationBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, fi(n, s.from, 1), di(e), s.to, 2));
    }
};

exports.InterpolationBindingRenderer = r([ ui("rf") ], exports.InterpolationBindingRenderer);

exports.PropertyBindingRenderer = class PropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, fi(n, s.from, 16), di(e), s.to, s.mode));
    }
};

exports.PropertyBindingRenderer = r([ ui("rg") ], exports.PropertyBindingRenderer);

exports.IteratorBindingRenderer = class IteratorBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, fi(n, s.forOf, 2), di(e), s.to, 2));
    }
};

exports.IteratorBindingRenderer = r([ ui("rk") ], exports.IteratorBindingRenderer);

exports.TextBindingRenderer = class TextBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, fi(n, s.from, 16), yt(e.parentNode, bt(i, ""), e), s.strict));
    }
};

exports.TextBindingRenderer = r([ ui("ha") ], exports.TextBindingRenderer);

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, fi(n, s.from, 8), e, s.to, new ListenerBindingOptions(s.preventDefault, s.capture)));
    }
};

exports.ListenerBindingRenderer = r([ ui("hb") ], exports.ListenerBindingRenderer);

exports.SetAttributeRenderer = class SetAttributeRenderer {
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
};

exports.SetAttributeRenderer = r([ ui("he") ], exports.SetAttributeRenderer);

exports.SetClassAttributeRenderer = class SetClassAttributeRenderer {
    render(t, e, s) {
        xi(e.classList, s.value);
    }
};

exports.SetClassAttributeRenderer = r([ ui("hf") ], exports.SetClassAttributeRenderer);

exports.SetStyleAttributeRenderer = class SetStyleAttributeRenderer {
    render(t, e, s) {
        e.style.cssText += s.value;
    }
};

exports.SetStyleAttributeRenderer = r([ ui("hg") ], exports.SetStyleAttributeRenderer);

exports.StylePropertyBindingRenderer = class StylePropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, fi(n, s.from, 16), e.style, s.to, 2));
    }
};

exports.StylePropertyBindingRenderer = r([ ui("hd") ], exports.StylePropertyBindingRenderer);

exports.AttributeBindingRenderer = class AttributeBindingRenderer {
    render(t, e, s, i, n, r) {
        const o = t.container;
        const l = o.has(ys, false) ? o.get(ys) : null;
        t.addBinding(new AttributeBinding(t, o, r, i.domWriteQueue, fi(n, s.from, 16), e, s.attr, null == l ? s.to : s.to.split(/\s/g).map((t => l[t] ?? t)).join(" "), 2));
    }
};

exports.AttributeBindingRenderer = r([ ui("hc") ], exports.AttributeBindingRenderer);

exports.SpreadRenderer = class SpreadRenderer {
    static get inject() {
        return [ ai, Ve ];
    }
    constructor(t, e) {
        this.ue = t;
        this.r = e;
    }
    render(e, s, i, n, r, o) {
        const l = e.container;
        const h = l.get(es);
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
            const h = mi(l);
            const f = this.ue.compileSpread(l.controller.definition, l.instruction?.captures ?? t.emptyArray, l.controller.container, s);
            let d;
            for (d of f) switch (d.type) {
              case "hs":
                u(i + 1);
                break;

              case "hp":
                a[d.instructions.type].render(h, Xs(s), d.instructions, n, r, o);
                break;

              default:
                a[d.type].render(h, s, d, n, r, o);
            }
            e.addBinding(h);
        };
        u(0);
    }
};

exports.SpreadRenderer = r([ ui("hs") ], exports.SpreadRenderer);

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
        if (null == e) throw y("Invalid spreading. Context scope is null/undefined");
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
        if (1 !== t.vmKind) throw y("Spread binding does not support spreading custom attributes/template controllers");
        this.ctrl.addChild(t);
    }
}

function xi(t, e) {
    const s = e.length;
    let i = 0;
    for (let n = 0; n < s; ++n) if (32 === e.charCodeAt(n)) {
        if (n !== i) t.add(e.slice(i, n));
        i = n + 1;
    } else if (n + 1 === s) t.add(e.slice(i));
}

const mi = t => new SpreadBinding([], t);

const gi = "IController";

const vi = "IInstruction";

const wi = "IRenderLocation";

const bi = "ISlotsInfo";

function yi(e, s, i, n, r, o) {
    const l = s.container.createChild();
    et(l, e.HTMLElement, et(l, e.Element, et(l, vs, new t.InstanceProvider("ElementResolver", i))));
    et(l, ts, new t.InstanceProvider(gi, s));
    et(l, li, new t.InstanceProvider(vi, n));
    et(l, bs, null == r ? Ai : new RenderLocationProvider(r));
    et(l, Oe, Ci);
    et(l, ni, null == o ? Bi : new t.InstanceProvider(bi, o));
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

function ki(e, s, i, n, r, o, l, h) {
    const a = i.container.createChild();
    et(a, e.HTMLElement, et(a, e.Element, et(a, vs, new t.InstanceProvider("ElementResolver", n))));
    i = i instanceof Controller ? i : i.ctrl;
    et(a, ts, new t.InstanceProvider(gi, i));
    et(a, li, new t.InstanceProvider(vi, r));
    et(a, bs, null == l ? Ai : new t.InstanceProvider(wi, l));
    et(a, Oe, null == o ? Ci : new ViewFactoryProvider(o));
    et(a, ni, null == h ? Bi : new t.InstanceProvider(bi, h));
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

const Ai = new RenderLocationProvider(null);

const Ci = new ViewFactoryProvider(null);

const Bi = new t.InstanceProvider(bi, new AuSlotsInfo(t.emptyArray));

exports.CommandType = void 0;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(exports.CommandType || (exports.CommandType = {}));

function Si(t) {
    return function(e) {
        return Li.define(t, e);
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
        return new BindingCommandDefinition(s, t.firstDefined(Ti(s, "name"), i), t.mergeArrays(Ti(s, "aliases"), n.aliases, s.aliases), Ii(i), t.firstDefined(Ti(s, "type"), n.type, s.type, null));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        Y(s, e).register(t);
        Z(s, e).register(t);
        it(i, Li, s, t);
    }
}

const Ri = d("binding-command");

const Ii = t => `${Ri}:${t}`;

const Ti = (t, e) => l(f(e), t);

const Li = A({
    name: Ri,
    keyFrom: Ii,
    define(t, e) {
        const s = BindingCommandDefinition.create(t, e);
        a(Ri, s, s.Type);
        a(Ri, s, s);
        p(e, Ri);
        return s.Type;
    },
    getAnnotation: Ti
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

exports.OneTimeBindingCommand = r([ Si("one-time") ], exports.OneTimeBindingCommand);

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

exports.ToViewBindingCommand = r([ Si("to-view") ], exports.ToViewBindingCommand);

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

exports.FromViewBindingCommand = r([ Si("from-view") ], exports.FromViewBindingCommand);

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

exports.TwoWayBindingCommand = r([ Si("two-way") ], exports.TwoWayBindingCommand);

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

exports.DefaultBindingCommand = r([ Si("bind") ], exports.DefaultBindingCommand);

exports.ForBindingCommand = class ForBindingCommand {
    get type() {
        return 0;
    }
    static get inject() {
        return [ ht ];
    }
    constructor(t) {
        this.pe = t;
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
                const n = this.pe.parse(e, i);
                r = [ new MultiAttrInstruction(i, n.target, n.command) ];
            }
        }
        return new IteratorBindingInstruction(n, i, r);
    }
};

exports.ForBindingCommand = r([ Si("for") ], exports.ForBindingCommand);

exports.TriggerBindingCommand = class TriggerBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, true, false);
    }
};

exports.TriggerBindingCommand = r([ Si("trigger") ], exports.TriggerBindingCommand);

exports.CaptureBindingCommand = class CaptureBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false, true);
    }
};

exports.CaptureBindingCommand = r([ Si("capture") ], exports.CaptureBindingCommand);

exports.AttrBindingCommand = class AttrBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

exports.AttrBindingCommand = r([ Si("attr") ], exports.AttrBindingCommand);

exports.StyleBindingCommand = class StyleBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

exports.StyleBindingCommand = r([ Si("style") ], exports.StyleBindingCommand);

exports.ClassBindingCommand = class ClassBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

exports.ClassBindingCommand = r([ Si("class") ], exports.ClassBindingCommand);

let Ei = class RefBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Ei = r([ Si("ref") ], Ei);

let Pi = class SpreadBindingCommand {
    get type() {
        return 1;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

Pi = r([ Si("...$attrs") ], Pi);

const _i = Q("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

const qi = t => {
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
        return Y(_i, this).register(t);
    }
    constructor(t) {
        this.xe = C(b(), {
            a: qi("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage target transform xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            altGlyph: qi("class dx dy externalResourcesRequired format glyphRef id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            altglyph: b(),
            altGlyphDef: qi("id xml:base xml:lang xml:space"),
            altglyphdef: b(),
            altGlyphItem: qi("id xml:base xml:lang xml:space"),
            altglyphitem: b(),
            animate: qi("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateColor: qi("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateMotion: qi("accumulate additive begin by calcMode dur end externalResourcesRequired fill from id keyPoints keySplines keyTimes max min onbegin onend onload onrepeat origin path repeatCount repeatDur requiredExtensions requiredFeatures restart rotate systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateTransform: qi("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to type values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            circle: qi("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup r requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            clipPath: qi("class clipPathUnits externalResourcesRequired id requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            "color-profile": qi("id local name rendering-intent xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            cursor: qi("externalResourcesRequired id requiredExtensions requiredFeatures systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            defs: qi("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            desc: qi("class id style xml:base xml:lang xml:space"),
            ellipse: qi("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform xml:base xml:lang xml:space"),
            feBlend: qi("class height id in in2 mode result style width x xml:base xml:lang xml:space y"),
            feColorMatrix: qi("class height id in result style type values width x xml:base xml:lang xml:space y"),
            feComponentTransfer: qi("class height id in result style width x xml:base xml:lang xml:space y"),
            feComposite: qi("class height id in in2 k1 k2 k3 k4 operator result style width x xml:base xml:lang xml:space y"),
            feConvolveMatrix: qi("bias class divisor edgeMode height id in kernelMatrix kernelUnitLength order preserveAlpha result style targetX targetY width x xml:base xml:lang xml:space y"),
            feDiffuseLighting: qi("class diffuseConstant height id in kernelUnitLength result style surfaceScale width x xml:base xml:lang xml:space y"),
            feDisplacementMap: qi("class height id in in2 result scale style width x xChannelSelector xml:base xml:lang xml:space y yChannelSelector"),
            feDistantLight: qi("azimuth elevation id xml:base xml:lang xml:space"),
            feFlood: qi("class height id result style width x xml:base xml:lang xml:space y"),
            feFuncA: qi("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncB: qi("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncG: qi("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncR: qi("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feGaussianBlur: qi("class height id in result stdDeviation style width x xml:base xml:lang xml:space y"),
            feImage: qi("class externalResourcesRequired height id preserveAspectRatio result style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            feMerge: qi("class height id result style width x xml:base xml:lang xml:space y"),
            feMergeNode: qi("id xml:base xml:lang xml:space"),
            feMorphology: qi("class height id in operator radius result style width x xml:base xml:lang xml:space y"),
            feOffset: qi("class dx dy height id in result style width x xml:base xml:lang xml:space y"),
            fePointLight: qi("id x xml:base xml:lang xml:space y z"),
            feSpecularLighting: qi("class height id in kernelUnitLength result specularConstant specularExponent style surfaceScale width x xml:base xml:lang xml:space y"),
            feSpotLight: qi("id limitingConeAngle pointsAtX pointsAtY pointsAtZ specularExponent x xml:base xml:lang xml:space y z"),
            feTile: qi("class height id in result style width x xml:base xml:lang xml:space y"),
            feTurbulence: qi("baseFrequency class height id numOctaves result seed stitchTiles style type width x xml:base xml:lang xml:space y"),
            filter: qi("class externalResourcesRequired filterRes filterUnits height id primitiveUnits style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            font: qi("class externalResourcesRequired horiz-adv-x horiz-origin-x horiz-origin-y id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            "font-face": qi("accent-height alphabetic ascent bbox cap-height descent font-family font-size font-stretch font-style font-variant font-weight hanging id ideographic mathematical overline-position overline-thickness panose-1 slope stemh stemv strikethrough-position strikethrough-thickness underline-position underline-thickness unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical widths x-height xml:base xml:lang xml:space"),
            "font-face-format": qi("id string xml:base xml:lang xml:space"),
            "font-face-name": qi("id name xml:base xml:lang xml:space"),
            "font-face-src": qi("id xml:base xml:lang xml:space"),
            "font-face-uri": qi("id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            foreignObject: qi("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xml:base xml:lang xml:space y"),
            g: qi("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            glyph: qi("arabic-form class d glyph-name horiz-adv-x id lang orientation style unicode vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            glyphRef: qi("class dx dy format glyphRef id style x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            glyphref: b(),
            hkern: qi("g1 g2 id k u1 u2 xml:base xml:lang xml:space"),
            image: qi("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            line: qi("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform x1 x2 xml:base xml:lang xml:space y1 y2"),
            linearGradient: qi("class externalResourcesRequired gradientTransform gradientUnits id spreadMethod style x1 x2 xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y1 y2"),
            marker: qi("class externalResourcesRequired id markerHeight markerUnits markerWidth orient preserveAspectRatio refX refY style viewBox xml:base xml:lang xml:space"),
            mask: qi("class externalResourcesRequired height id maskContentUnits maskUnits requiredExtensions requiredFeatures style systemLanguage width x xml:base xml:lang xml:space y"),
            metadata: qi("id xml:base xml:lang xml:space"),
            "missing-glyph": qi("class d horiz-adv-x id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            mpath: qi("externalResourcesRequired id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            path: qi("class d externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup pathLength requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            pattern: qi("class externalResourcesRequired height id patternContentUnits patternTransform patternUnits preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage viewBox width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            polygon: qi("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            polyline: qi("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            radialGradient: qi("class cx cy externalResourcesRequired fx fy gradientTransform gradientUnits id r spreadMethod style xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            rect: qi("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform width x xml:base xml:lang xml:space y"),
            script: qi("externalResourcesRequired id type xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            set: qi("attributeName attributeType begin dur end externalResourcesRequired fill id max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            stop: qi("class id offset style xml:base xml:lang xml:space"),
            style: qi("id media title type xml:base xml:lang xml:space"),
            svg: qi("baseProfile class contentScriptType contentStyleType externalResourcesRequired height id onabort onactivate onclick onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onresize onscroll onunload onzoom preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage version viewBox width x xml:base xml:lang xml:space y zoomAndPan"),
            switch: qi("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            symbol: qi("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio style viewBox xml:base xml:lang xml:space"),
            text: qi("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength transform x xml:base xml:lang xml:space y"),
            textPath: qi("class externalResourcesRequired id lengthAdjust method onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures spacing startOffset style systemLanguage textLength xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            title: qi("class id style xml:base xml:lang xml:space"),
            tref: qi("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y"),
            tspan: qi("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xml:base xml:lang xml:space y"),
            use: qi("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            view: qi("externalResourcesRequired id preserveAspectRatio viewBox viewTarget xml:base xml:lang xml:space zoomAndPan"),
            vkern: qi("g1 g2 id k u1 u2 xml:base xml:lang xml:space")
        });
        this.me = qi("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.ge = qi("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if ("altglyph" === e.firstElementChild.nodeName) {
            const t = this.xe;
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
        return true === this.me[t.nodeName] && true === this.ge[e] || true === this.xe[t.nodeName]?.[e];
    }
}

SVGAnalyzer.inject = [ ve ];

const $i = Q("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    static get inject() {
        return [ _i ];
    }
    constructor(t) {
        this.svg = t;
        this.fns = [];
        this.ve = b();
        this.we = b();
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
            i = (e = this.ve)[n] ?? (e[n] = b());
            for (r in s) {
                if (void 0 !== i[r]) throw Di(r, n);
                i[r] = s[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.we;
        for (const s in t) {
            if (void 0 !== e[s]) throw Di(s, "*");
            e[s] = t[s];
        }
    }
    useTwoWay(t) {
        this.fns.push(t);
    }
    isTwoWay(t, e) {
        return Ui(t, e) || this.fns.length > 0 && this.fns.some((s => s(t, e)));
    }
    map(t, e) {
        return this.ve[t.nodeName]?.[e] ?? this.we[e] ?? (I(t, e, this.svg) ? e : null);
    }
}

function Ui(t, e) {
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

function Di(t, e) {
    return y(`Attribute ${t} has been already registered for ${"*" === e ? "all elements" : `<${e}/>`}`);
}

const Mi = Q("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Fi = {};

class TemplateElementFactory {
    constructor(t) {
        this.p = t;
        this.be = Oi(this.p);
    }
    createTemplate(t) {
        if (P(t)) {
            let e = Fi[t];
            if (void 0 === e) {
                const s = this.be;
                s.innerHTML = t;
                const i = s.content.firstElementChild;
                if (null == i || "TEMPLATE" !== i.nodeName || null != i.nextElementSibling) {
                    this.be = Oi(this.p);
                    e = s;
                } else {
                    s.content.removeChild(i);
                    e = i;
                }
                Fi[t] = e;
            }
            return e.cloneNode(true);
        }
        if ("TEMPLATE" !== t.nodeName) {
            const e = Oi(this.p);
            e.content.appendChild(t);
            return e;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
    }
}

TemplateElementFactory.inject = [ ve ];

const Oi = t => t.document.createElement("template");

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        return Y(ai, this).register(t);
    }
    compile(e, s, i) {
        const n = CustomElementDefinition.getOrCreate(e);
        if (null === n.template || void 0 === n.template) return n;
        if (false === n.needsCompile) return n;
        i ?? (i = Qi);
        const r = new CompilationContext(e, s, i, null, null, void 0);
        const o = P(n.template) || !e.enhance ? r.ye.createTemplate(n.template) : n.template;
        const l = o.nodeName === ji && null != o.content;
        const h = l ? o.content : o;
        const a = s.get(K(ln));
        const c = a.length;
        let u = 0;
        if (c > 0) while (c > u) {
            a[u].compiling?.(o);
            ++u;
        }
        if (o.hasAttribute(nn)) throw y(`AUR0701`);
        this.ke(h, r);
        this.Ae(h, r);
        return CustomElementDefinition.create({
            ...e,
            name: e.name || Hs(),
            dependencies: (e.dependencies ?? t.emptyArray).concat(r.deps ?? t.emptyArray),
            instructions: r.rows,
            surrogates: l ? this.Ce(o, r) : t.emptyArray,
            template: o,
            hasSlots: r.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(e, s, i, n) {
        const r = new CompilationContext(e, i, Qi, null, null, void 0);
        const o = [];
        const l = r.Be(n.nodeName.toLowerCase());
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
            w = r.Se(f);
            if (null !== w && (1 & w.type) > 0) {
                Zi.node = n;
                Zi.attr = f;
                Zi.bindable = null;
                Zi.def = null;
                o.push(w.build(Zi, r.ep, r.m));
                continue;
            }
            d = r.Re(A);
            if (null !== d) {
                if (d.isTemplateController) throw y(`AUR0703:${A}`);
                m = BindablesInfo.from(d, true);
                k = false === d.noMultiBindings && null === w && Xi(C);
                if (k) x = this.Ie(n, C, d, r); else {
                    v = m.primary;
                    if (null === w) {
                        b = a.parse(C, 1);
                        x = [ null === b ? new SetPropertyInstruction(C, v.property) : new InterpolationInstruction(b, v.property) ];
                    } else {
                        Zi.node = n;
                        Zi.attr = f;
                        Zi.bindable = v;
                        Zi.def = d;
                        x = [ w.build(Zi, r.ep, r.m) ];
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
                        Zi.node = n;
                        Zi.attr = f;
                        Zi.bindable = g;
                        Zi.def = l;
                        o.push(new SpreadElementPropBindingInstruction(w.build(Zi, r.ep, r.m)));
                        continue;
                    }
                }
                Zi.node = n;
                Zi.attr = f;
                Zi.bindable = null;
                Zi.def = null;
                o.push(w.build(Zi, r.ep, r.m));
            }
        }
        Ki();
        if (null != p) return p.concat(o);
        return o;
    }
    Ce(e, s) {
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
            u = s.pe.parse(a, c);
            b = u.target;
            k = u.rawValue;
            if (Ji[b]) throw y(`AUR0702:${a}`);
            g = s.Se(u);
            if (null !== g && (1 & g.type) > 0) {
                Zi.node = e;
                Zi.attr = u;
                Zi.bindable = null;
                Zi.def = null;
                i.push(g.build(Zi, s.ep, s.m));
                continue;
            }
            f = s.Re(b);
            if (null !== f) {
                if (f.isTemplateController) throw y(`AUR0703:${b}`);
                x = BindablesInfo.from(f, true);
                w = false === f.noMultiBindings && null === g && Xi(k);
                if (w) p = this.Ie(e, k, f, s); else {
                    m = x.primary;
                    if (null === g) {
                        v = r.parse(k, 1);
                        p = [ null === v ? new SetPropertyInstruction(k, m.property) : new InterpolationInstruction(v, m.property) ];
                    } else {
                        Zi.node = e;
                        Zi.attr = u;
                        Zi.bindable = m;
                        Zi.def = f;
                        p = [ g.build(Zi, s.ep, s.m) ];
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
                Zi.node = e;
                Zi.attr = u;
                Zi.bindable = null;
                Zi.def = null;
                i.push(g.build(Zi, s.ep, s.m));
            }
        }
        Ki();
        if (null != d) return d.concat(i);
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
                let s = t.firstChild;
                while (null !== s) s = this.Ae(s, e);
                break;
            }
        }
        return t.nextSibling;
    }
    Te(e, i) {
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
            u = i.pe.parse(f, d);
            x = u.target;
            m = u.rawValue;
            p = i.Se(u);
            if (null !== p) {
                if ("bind" === u.command) o.push(new LetBindingInstruction(l.parse(m, 16), t.camelCase(x))); else throw y(`AUR0704:${u.command}`);
                continue;
            }
            g = l.parse(m, 1);
            o.push(new LetBindingInstruction(null === g ? new s.PrimitiveLiteralExpression(m) : g, t.camelCase(x)));
        }
        i.rows.push([ new HydrateLetElementInstruction(o, h) ]);
        return this.Pe(e).nextSibling;
    }
    Le(e, s) {
        var i, n, r, o;
        const l = e.nextSibling;
        const h = (e.getAttribute("as-element") ?? e.nodeName).toLowerCase();
        const a = s.Be(h);
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
        let S;
        let R;
        let I = null;
        let T = false;
        let L;
        let E;
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
            B = s.pe.parse(A, C);
            D = s.Se(B);
            O = B.target;
            V = B.rawValue;
            if (f && (!d || d && f(O))) {
                if (null != D && 1 & D.type) {
                    m();
                    p.push(B);
                    continue;
                }
                H = O !== dn && "slot" !== O;
                if (H) {
                    M = BindablesInfo.from(a, false);
                    if (null == M.attrs[O] && !s.Re(O)?.isTemplateController) {
                        m();
                        p.push(B);
                        continue;
                    }
                }
            }
            if (null !== D && 1 & D.type) {
                Zi.node = e;
                Zi.attr = B;
                Zi.bindable = null;
                Zi.def = null;
                (S ?? (S = [])).push(D.build(Zi, s.ep, s.m));
                m();
                continue;
            }
            I = s.Re(O);
            if (null !== I) {
                M = BindablesInfo.from(I, true);
                T = false === I.noMultiBindings && null === D && Xi(V);
                if (T) P = this.Ie(e, V, I, s); else {
                    F = M.primary;
                    if (null === D) {
                        $ = x.parse(V, 1);
                        P = [ null === $ ? new SetPropertyInstruction(V, F.property) : new InterpolationInstruction($, F.property) ];
                    } else {
                        Zi.node = e;
                        Zi.attr = B;
                        Zi.bindable = F;
                        Zi.def = I;
                        P = [ D.build(Zi, s.ep, s.m) ];
                    }
                }
                m();
                if (I.isTemplateController) (_ ?? (_ = [])).push(new HydrateTemplateController(Yi, this.resolveResources ? I : I.name, void 0, P)); else (E ?? (E = [])).push(new HydrateAttributeInstruction(this.resolveResources ? I : I.name, null != I.aliases && I.aliases.includes(O) ? O : void 0, P));
                continue;
            }
            if (null === D) {
                if (c) {
                    M = BindablesInfo.from(a, false);
                    L = M.attrs[O];
                    if (void 0 !== L) {
                        $ = x.parse(V, 1);
                        (R ?? (R = [])).push(null == $ ? new SetPropertyInstruction(V, L.property) : new InterpolationInstruction($, L.property));
                        m();
                        continue;
                    }
                }
                $ = x.parse(V, 1);
                if (null != $) {
                    m();
                    (S ?? (S = [])).push(new InterpolationInstruction($, s.m.map(e, O) ?? t.camelCase(O)));
                }
                continue;
            }
            m();
            if (c) {
                M = BindablesInfo.from(a, false);
                L = M.attrs[O];
                if (void 0 !== L) {
                    Zi.node = e;
                    Zi.attr = B;
                    Zi.bindable = L;
                    Zi.def = a;
                    (R ?? (R = [])).push(D.build(Zi, s.ep, s.m));
                    continue;
                }
            }
            Zi.node = e;
            Zi.attr = B;
            Zi.bindable = null;
            Zi.def = null;
            (S ?? (S = [])).push(D.build(Zi, s.ep, s.m));
        }
        Ki();
        if (this._e(e, S) && null != S && S.length > 1) this.qe(e, S);
        if (c) {
            U = new HydrateElementInstruction(this.resolveResources ? a : a.name, void 0, R ?? t.emptyArray, null, j, p);
            if (h === dn) {
                const t = e.getAttribute("name") || fn;
                const i = s.t();
                const n = s.$e();
                let r = e.firstChild;
                while (null !== r) {
                    if (1 === r.nodeType && r.hasAttribute(dn)) e.removeChild(r); else Ct(i, r);
                    r = e.firstChild;
                }
                this.Ae(i.content, n);
                U.auSlot = {
                    name: t,
                    fallback: CustomElementDefinition.create({
                        name: Hs(),
                        template: i,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
                e = this.Ue(e, s);
            }
        }
        if (null != S || null != U || null != E) {
            v = t.emptyArray.concat(U ?? t.emptyArray, E ?? t.emptyArray, S ?? t.emptyArray);
            this.Pe(e);
        }
        let W;
        if (null != _) {
            w = _.length - 1;
            b = w;
            q = _[b];
            let t;
            if (zi(e)) {
                t = s.t();
                Bt(t, [ s.De(Hi), s.De(Wi), this.Pe(s.h(Ni)) ]);
            } else {
                this.Ue(e, s);
                if ("TEMPLATE" === e.nodeName) t = e; else {
                    t = s.t();
                    Ct(t, e);
                }
            }
            const r = t;
            const o = s.$e(null == v ? [] : [ v ]);
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
            let S = false;
            if (false !== N) while (null !== B) {
                f = 1 === B.nodeType ? B.getAttribute(dn) : null;
                if (null !== f) B.removeAttribute(dn);
                if (c) {
                    l = B.nextSibling;
                    if (!u) {
                        S = 3 === B.nodeType && "" === B.textContent.trim();
                        if (!S) ((i = p ?? (p = {}))[n = f || fn] ?? (i[n] = [])).push(B);
                        e.removeChild(B);
                    }
                    B = l;
                } else {
                    if (null !== f) {
                        f = f || fn;
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
                        if ("TEMPLATE" === m.nodeName) if (m.attributes.length > 0) Ct(t, m); else Ct(t, m.content); else Ct(t, m);
                    }
                    k = s.$e();
                    this.Ae(t.content, k);
                    d[f] = CustomElementDefinition.create({
                        name: Hs(),
                        template: t,
                        instructions: k.rows,
                        needsCompile: false,
                        isStrictBinding: s.root.def.isStrictBinding
                    });
                }
                U.projections = d;
            }
            if (c && (j || a.containerless)) this.Ue(e, s);
            W = !c || !a.containerless && !j && false !== N;
            if (W) if (e.nodeName === ji) this.Ae(e.content, o); else {
                B = e.firstChild;
                while (null !== B) B = this.Ae(B, o);
            }
            q.def = CustomElementDefinition.create({
                name: Hs(),
                template: r,
                instructions: o.rows,
                needsCompile: false,
                isStrictBinding: s.root.def.isStrictBinding
            });
            while (b-- > 0) {
                q = _[b];
                t = s.t();
                g = this.Pe(s.h(Ni));
                Bt(t, [ s.De(Hi), s.De(Wi), g ]);
                q.def = CustomElementDefinition.create({
                    name: Hs(),
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
                n = 1 === t.nodeType ? t.getAttribute(dn) : null;
                if (null !== n) t.removeAttribute(dn);
                if (c) {
                    i = t.nextSibling;
                    if (!u) {
                        g = 3 === t.nodeType && "" === t.textContent.trim();
                        if (!g) ((r = f ?? (f = {}))[o = n || fn] ?? (r[o] = [])).push(t);
                        e.removeChild(t);
                    }
                    t = i;
                } else {
                    if (null !== n) {
                        n = n || fn;
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
                        if (p.nodeName === ji) if (p.attributes.length > 0) Ct(x, p); else Ct(x, p.content); else Ct(x, p);
                    }
                    m = s.$e();
                    this.Ae(x.content, m);
                    l[n] = CustomElementDefinition.create({
                        name: Hs(),
                        template: x,
                        instructions: m.rows,
                        needsCompile: false,
                        isStrictBinding: s.root.def.isStrictBinding
                    });
                }
                U.projections = l;
            }
            if (c && (j || a.containerless)) this.Ue(e, s);
            W = !c || !a.containerless && !j && false !== N;
            if (W && e.childNodes.length > 0) {
                t = e.firstChild;
                while (null !== t) t = this.Ae(t, s);
            }
        }
        return l;
    }
    Ee(t, e) {
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
            if (a = r[0]) yt(s, e.Me(a), t);
            for (l = 0, h = o.length; h > l; ++l) {
                kt(s, t, [ e.De(Hi), e.De(Wi), this.Pe(e.h(Ni)) ]);
                if (a = r[l + 1]) yt(s, e.Me(a), t);
                e.rows.push([ new TextBindingInstruction(o[l], e.root.def.isStrictBinding) ]);
            }
            s.removeChild(t);
        }
        return n;
    }
    Ie(t, e, s, i) {
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
                f = i.pe.parse(l, h);
                d = i.Se(f);
                p = n.attrs[f.target];
                if (null == p) throw y(`AUR0707:${s.name}.${f.target}`);
                if (null === d) {
                    u = i.ep.parse(h, 1);
                    o.push(null === u ? new SetPropertyInstruction(h, p.property) : new InterpolationInstruction(u, p.property));
                } else {
                    Zi.node = t;
                    Zi.attr = f;
                    Zi.bindable = p;
                    Zi.def = s;
                    o.push(d.build(Zi, i.ep, i.m));
                }
                while (x < r && e.charCodeAt(++x) <= 32) ;
                a = x;
                l = void 0;
                h = void 0;
            }
        }
        Ki();
        return o;
    }
    ke(e, s) {
        const i = e;
        const n = t.toArray(i.querySelectorAll("template[as-custom-element]"));
        const r = n.length;
        if (0 === r) return;
        if (r === i.childElementCount) throw y(`AUR0708`);
        const o = new Set;
        const l = [];
        for (const e of n) {
            if (e.parentNode !== i) throw y(`AUR0709`);
            const n = rn(e, o);
            const r = class LocalTemplate {};
            const h = e.content;
            const a = t.toArray(h.querySelectorAll("bindable"));
            const c = j.for(r);
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
                    mode: on(t)
                });
                const i = t.getAttributeNames().filter((t => !sn.includes(t)));
                if (i.length > 0) ;
                h.removeChild(t);
            }
            l.push(r);
            s.Fe(zs({
                name: n,
                template: e
            }, r));
            i.removeChild(e);
        }
        let h = 0;
        const a = l.length;
        for (;a > h; ++h) Qs(l[h]).dependencies.push(...s.def.dependencies ?? t.emptyArray, ...s.deps ?? t.emptyArray);
    }
    _e(t, e) {
        const s = t.nodeName;
        return "INPUT" === s && 1 === tn[t.type] || "SELECT" === s && (t.hasAttribute("multiple") || e?.some((t => "rg" === t.type && "multiple" === t.to)));
    }
    qe(t, e) {
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
    Oe(t) {
        return t.nodeName === Ni && Gi(Vi = At(t)) && Vi.textContent === Wi && Gi(Vi = At(Vi)) && Vi.textContent === Hi;
    }
    Pe(t) {
        t.classList.add("au");
        return t;
    }
    Ue(t, e) {
        if (zi(t)) return t;
        const s = t.parentNode;
        const i = this.Pe(e.h(Ni));
        kt(s, t, [ e.De(Hi), e.De(Wi), i ]);
        s.removeChild(t);
        return i;
    }
}

let Vi;

const Ni = "AU-M";

const ji = "TEMPLATE";

const Hi = "au-start";

const Wi = "au-end";

const zi = t => t.nodeName === Ni && Gi(Vi = At(t)) && Vi.textContent === Wi && Gi(Vi = At(Vi)) && Vi.textContent === Hi;

const Gi = t => 8 === t?.nodeType;

class CompilationContext {
    constructor(e, i, n, r, o, l) {
        this.hasSlot = false;
        this.Ve = b();
        const h = null !== r;
        this.c = i;
        this.root = null === o ? this : o;
        this.def = e;
        this.ci = n;
        this.parent = r;
        this.ye = h ? r.ye : i.get(Mi);
        this.pe = h ? r.pe : i.get(ht);
        this.ep = h ? r.ep : i.get(s.IExpressionParser);
        this.m = h ? r.m : i.get($i);
        this.Ne = h ? r.Ne : i.get(t.ILogger);
        this.p = h ? r.p : i.get(ve);
        this.localEls = h ? r.localEls : new Set;
        this.rows = l ?? [];
    }
    Fe(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    Me(t) {
        return bt(this.p, t);
    }
    De(t) {
        return vt(this.p, t);
    }
    h(t) {
        const e = gt(this.p, t);
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
        return this.c.find(ge, t);
    }
    $e(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Se(t) {
        if (this.root !== this) return this.root.Se(t);
        const e = t.command;
        if (null === e) return null;
        let s = this.Ve[e];
        if (void 0 === s) {
            s = this.c.create(Li, e);
            if (null === s) throw y(`AUR0713:${e}`);
            this.Ve[e] = s;
        }
        return s;
    }
}

const Xi = t => {
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

const Ki = () => {
    Zi.node = Zi.attr = Zi.bindable = Zi.def = null;
};

const Qi = {
    projections: null
};

const Yi = {
    name: "unnamed"
};

const Zi = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Ji = C(b(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const tn = {
    checkbox: 1,
    radio: 1
};

const en = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let s = en.get(t);
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
            en.set(t, s = new BindablesInfo(n, i, a));
        }
        return s;
    }
    constructor(t, e, s) {
        this.attrs = t;
        this.bindables = e;
        this.primary = s;
    }
}

const sn = A([ "property", "attribute", "mode" ]);

const nn = "as-custom-element";

const rn = (t, e) => {
    const s = t.getAttribute(nn);
    if (null === s || "" === s) throw y(`AUR0715`);
    if (e.has(s)) throw y(`AUR0716:${s}`); else {
        e.add(s);
        t.removeAttribute(nn);
    }
    return s;
};

const on = t => {
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

const ln = Q("ITemplateCompilerHooks");

const hn = new WeakMap;

const an = d("compiler-hooks");

const cn = A({
    name: an,
    define(t) {
        let e = hn.get(t);
        if (void 0 === e) {
            hn.set(t, e = new TemplateCompilerHooksDefinition(t));
            a(an, e, t);
            p(t, an);
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
        t.register(Y(ln, this.Type));
    }
}

const un = t => {
    return void 0 === t ? e : e(t);
    function e(t) {
        return cn.define(t);
    }
};

const fn = "default";

const dn = "au-slot";

const pn = new Map;

class BindingModeBehavior {
    bind(t, e) {
        pn.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = pn.get(e);
        pn.delete(e);
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

qt("oneTime")(OneTimeBindingBehavior);

qt("toView")(ToViewBindingBehavior);

qt("fromView")(FromViewBindingBehavior);

qt("twoWay")(TwoWayBindingBehavior);

const xn = new WeakMap;

const mn = 200;

class DebounceBindingBehavior {
    constructor(t) {
        this.p = t;
    }
    bind(e, s, i, n) {
        const r = {
            type: "debounce",
            delay: i ?? mn,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: P(n) ? [ n ] : n ?? t.emptyArray
        };
        const o = s.limit?.(r);
        if (null == o) ; else xn.set(s, o);
    }
    unbind(t, e) {
        xn.get(e)?.dispose();
        xn.delete(e);
    }
}

DebounceBindingBehavior.inject = [ t.IPlatform ];

qt("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor(t) {
        this.je = new Map;
        this.He = t;
    }
    bind(t, e, ...s) {
        if (!("handleChange" in e)) throw y(`AUR0817`);
        if (0 === s.length) throw y(`AUR0818`);
        this.je.set(e, s);
        let i;
        for (i of s) M(this.He, i, e);
    }
    unbind(t, e) {
        const s = this.je.get(e);
        this.je.delete(e);
        let i;
        for (i of s) F(this.He, i, e);
    }
}

SignalBindingBehavior.inject = [ s.ISignaler ];

qt("signal")(SignalBindingBehavior);

const gn = new WeakMap;

const vn = 200;

class ThrottleBindingBehavior {
    constructor(t) {
        this.We = t.performanceNow;
        this.ct = t.taskQueue;
    }
    bind(e, s, i, n) {
        const r = {
            type: "throttle",
            delay: i ?? vn,
            now: this.We,
            queue: this.ct,
            signals: P(n) ? [ n ] : n ?? t.emptyArray
        };
        const o = s.limit?.(r);
        if (null == o) ; else gn.set(s, o);
    }
    unbind(t, e) {
        gn.get(e)?.dispose();
        gn.delete(e);
    }
}

ThrottleBindingBehavior.inject = [ t.IPlatform ];

qt("throttle")(ThrottleBindingBehavior);

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

ke(DataAttributeAccessor);

const wn = new DataAttributeAccessor;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) throw y(`AURxxxx`);
        e.useTargetObserver(wn);
    }
}

qt("attr")(AttrBindingBehavior);

class SelfBindingBehavior {
    bind(t, e) {
        if (!(e instanceof ListenerBinding)) throw y(`AUR0801`);
        e.self = true;
    }
    unbind(t, e) {
        e.self = false;
    }
}

qt("self")(SelfBindingBehavior);

const bn = b();

class AttributeNSAccessor {
    static forNs(t) {
        return bn[t] ?? (bn[t] = new AttributeNSAccessor(t));
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

ke(AttributeNSAccessor);

function yn(t, e) {
    return t === e;
}

class CheckedObserver {
    constructor(t, e, s, i) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.ze = void 0;
        this.Ge = void 0;
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
        this.Xe();
        this.Ke();
        this.it();
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
        const s = k.call(e, "model") ? e.model : e.value;
        const i = "radio" === e.type;
        const n = void 0 !== e.matcher ? e.matcher : yn;
        if (i) e.checked = !!n(t, s); else if (true === t) e.checked = true; else {
            let i = false;
            if (L(t)) i = -1 !== t.findIndex((t => !!n(t, s))); else if (t instanceof Set) {
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
        const n = void 0 !== e.matcher ? e.matcher : yn;
        if ("checkbox" === e.type) {
            if (L(t)) {
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
        this.Xe();
    }
    kt() {
        this.ze?.unsubscribe(this);
        this.Ge?.unsubscribe(this);
        this.ze = this.Ge = void 0;
    }
    it() {
        kn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, kn);
    }
    Xe() {
        const t = this.wt;
        (this.Ge ?? (this.Ge = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.ze?.unsubscribe(this);
        this.ze = void 0;
        if ("checkbox" === t.type) (this.ze = qn(this.v, this.oL))?.subscribe(this);
    }
}

ye(CheckedObserver);

s.subscriberCollection(CheckedObserver);

let kn;

const An = {
    childList: true,
    subtree: true,
    characterData: true
};

function Cn(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, s, i) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.J = false;
        this.Qe = void 0;
        this.Ye = void 0;
        this.iO = false;
        this.bt = false;
        this.wt = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.iO ? this.v : this.wt.multiple ? Bn(this.wt.options) : this.wt.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.J = t !== this.ov;
        this.Ze(t instanceof Array ? t : null);
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
        const s = L(t);
        const i = e.matcher ?? Cn;
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
            const o = t.matcher || Cn;
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
        (this.Ye = Rt(this.wt, this.Je.bind(this))).observe(this.wt, An);
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
            if (!this.wt.multiple) throw y(`AUR0654`);
            (this.Qe = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) this.it();
    }
    Je(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) this.it();
    }
    it() {
        Sn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Sn);
    }
}

ye(SelectValueObserver);

s.subscriberCollection(SelectValueObserver);

function Bn(t) {
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

let Sn;

const Rn = "--";

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
    ts(t) {
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
    es(e) {
        let s;
        let i;
        const n = [];
        for (i in e) {
            s = e[i];
            if (null == s) continue;
            if (P(s)) {
                if (i.startsWith(Rn)) {
                    n.push([ i, s ]);
                    continue;
                }
                n.push([ t.kebabCase(i), s ]);
                continue;
            }
            n.push(...this.ss(s));
        }
        return n;
    }
    rs(e) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) t.push(...this.ss(e[i]));
            return t;
        }
        return t.emptyArray;
    }
    ss(e) {
        if (P(e)) return this.ts(e);
        if (e instanceof Array) return this.rs(e);
        if (e instanceof Object) return this.es(e);
        return t.emptyArray;
    }
    st() {
        if (this.J) {
            this.J = false;
            const t = this.v;
            const e = this.styles;
            const s = this.ss(t);
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
        if (null != e && E(e.indexOf) && e.includes("!important")) {
            s = "important";
            e = e.replace("!important", "");
        }
        this.obj.style.setProperty(t, e, s);
    }
    bind() {
        this.v = this.ov = this.obj.style.cssText;
    }
}

ke(StyleAttributeAccessor);

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
        In = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, In);
    }
}

ye(ValueAttributeObserver);

s.subscriberCollection(ValueAttributeObserver);

let In;

const Tn = "http://www.w3.org/1999/xlink";

const Ln = "http://www.w3.org/XML/1998/namespace";

const En = "http://www.w3.org/2000/xmlns/";

const Pn = C(b(), {
    "xlink:actuate": [ "actuate", Tn ],
    "xlink:arcrole": [ "arcrole", Tn ],
    "xlink:href": [ "href", Tn ],
    "xlink:role": [ "role", Tn ],
    "xlink:show": [ "show", Tn ],
    "xlink:title": [ "title", Tn ],
    "xlink:type": [ "type", Tn ],
    "xml:lang": [ "lang", Ln ],
    "xml:space": [ "space", Ln ],
    xmlns: [ "xmlns", En ],
    "xmlns:xlink": [ "xlink", En ]
});

const _n = new s.PropertyAccessor;

_n.type = 2 | 4;

class NodeObserverLocator {
    constructor(t, e, s, i) {
        this.locator = t;
        this.platform = e;
        this.dirtyChecker = s;
        this.svgAnalyzer = i;
        this.allowDirtyCheck = true;
        this.os = b();
        this.ls = b();
        this.cs = b();
        this.us = b();
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
        Z(s.INodeObserverLocator, NodeObserverLocator).register(t);
        Y(s.INodeObserverLocator, NodeObserverLocator).register(t);
    }
    handles(t, e) {
        return t instanceof this.platform.Node;
    }
    useConfig(t, e, s) {
        const i = this.os;
        let n;
        if (P(t)) {
            n = i[t] ?? (i[t] = b());
            if (null == n[e]) n[e] = s; else $n(t, e);
        } else for (const s in t) {
            n = i[s] ?? (i[s] = b());
            const r = t[s];
            for (e in r) if (null == n[e]) n[e] = r[e]; else $n(s, e);
        }
    }
    useConfigGlobal(t, e) {
        const s = this.ls;
        if ("object" === typeof t) for (const e in t) if (null == s[e]) s[e] = t[e]; else $n("*", e); else if (null == s[t]) s[t] = e; else $n("*", t);
    }
    getAccessor(e, s, i) {
        if (s in this.us || s in (this.cs[e.tagName] ?? t.emptyObject)) return this.getObserver(e, s, i);
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
            return wn;

          default:
            {
                const t = Pn[s];
                if (void 0 !== t) return AttributeNSAccessor.forNs(t[1]);
                if (I(e, s, this.svgAnalyzer)) return wn;
                return _n;
            }
        }
    }
    overrideAccessor(t, e) {
        var s, i;
        let n;
        if (P(t)) {
            n = (s = this.cs)[t] ?? (s[t] = b());
            n[e] = true;
        } else for (const e in t) for (const s of t[e]) {
            n = (i = this.cs)[e] ?? (i[e] = b());
            n[s] = true;
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) this.us[e] = true;
    }
    getNodeObserverConfig(t, e) {
        return this.os[t.tagName]?.[e] ?? this.ls[e];
    }
    getNodeObserver(t, e, i) {
        const n = this.os[t.tagName]?.[e] ?? this.ls[e];
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
        const r = Pn[e];
        if (void 0 !== r) return AttributeNSAccessor.forNs(r[1]);
        if (I(t, e, this.svgAnalyzer)) return wn;
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) return this.dirtyChecker.createProperty(t, e);
            throw y(`AUR0652:${v(e)}`);
        } else return new s.SetterObserver(t, e);
    }
}

NodeObserverLocator.inject = [ t.IServiceLocator, ve, s.IDirtyChecker, _i ];

function qn(t, e) {
    if (t instanceof Array) return e.getArrayObserver(t);
    if (t instanceof Map) return e.getMapObserver(t);
    if (t instanceof Set) return e.getSetObserver(t);
}

function $n(t, e) {
    throw y(`AUR0653:${v(e)}@${t}`);
}

class UpdateTriggerBindingBehavior {
    constructor(t, e) {
        if (!(e instanceof NodeObserverLocator)) throw y("AURxxxx: updateTrigger binding behavior only works with the default implementation of Aurelia HTML observation. Implement your own node observation + updateTrigger");
        this.oL = t;
        this.ds = e;
    }
    bind(t, e, ...s) {
        if (0 === s.length) throw y(`AUR0802`);
        if (!(e instanceof PropertyBinding) || !(4 & e.mode)) throw y(`AUR0803`);
        const i = this.ds.getNodeObserverConfig(e.target, e.targetProperty);
        if (null == i) throw y(`AURxxxx`);
        const n = this.ds.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: i.readonly,
            default: i.default,
            events: s
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.inject = [ s.IObserverLocator, s.INodeObserverLocator ];

qt("updateTrigger")(UpdateTriggerBindingBehavior);

class Focus {
    constructor(t, e) {
        this.ps = false;
        this.xs = t;
        this.p = e;
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) this.gs(); else this.ps = true;
    }
    attached() {
        if (this.ps) {
            this.ps = false;
            this.gs();
        }
        this.xs.addEventListener("focus", this);
        this.xs.addEventListener("blur", this);
    }
    detaching() {
        const t = this.xs;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if ("focus" === t.type) this.value = true; else if (!this.vs) this.value = false;
    }
    gs() {
        const t = this.xs;
        const e = this.vs;
        const s = this.value;
        if (s && !e) t.focus(); else if (!s && e) t.blur();
    }
    get vs() {
        return this.xs === this.p.document.activeElement;
    }
}

Focus.inject = [ vs, ve ];

r([ O({
    mode: 6
}) ], Focus.prototype, "value", void 0);

he("focus")(Focus);

let Un = class Show {
    constructor(t, e, s) {
        this.el = t;
        this.p = e;
        this.ws = false;
        this.lt = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.lt = null;
            if (Boolean(this.value) !== this.bs) if (this.bs === this.ys) {
                this.bs = !this.ys;
                this.$val = this.el.style.getPropertyValue("display");
                this.$prio = this.el.style.getPropertyPriority("display");
                this.el.style.setProperty("display", "none", "important");
            } else {
                this.bs = this.ys;
                this.el.style.setProperty("display", this.$val, this.$prio);
                if ("" === this.el.getAttribute("style")) this.el.removeAttribute("style");
            }
        };
        this.bs = this.ys = "hide" !== s.alias;
    }
    binding() {
        this.ws = true;
        this.update();
    }
    detaching() {
        this.ws = false;
        this.lt?.cancel();
        this.lt = null;
    }
    valueChanged() {
        if (this.ws && null === this.lt) this.lt = this.p.domWriteQueue.queueTask(this.update);
    }
};

r([ O ], Un.prototype, "value", void 0);

Un = r([ o(0, vs), o(1, ve), o(2, li) ], Un);

st("hide")(Un);

he("show")(Un);

class Portal {
    constructor(t, e, s) {
        this.position = "beforeend";
        this.strict = false;
        this.p = s;
        this.ks = s.document.createElement("div");
        (this.view = t.create()).setLocation(this.As = wt(s));
        Cs(this.view.nodes, e);
    }
    attaching(t) {
        if (null == this.callbackContext) this.callbackContext = this.$controller.scope.bindingContext;
        const e = this.ks = this.Cs();
        this.Bs(e, this.position);
        return this.Ss(t, e);
    }
    detaching(t) {
        return this.Rs(t, this.ks);
    }
    targetChanged() {
        const {$controller: e} = this;
        if (!e.isActive) return;
        const s = this.Cs();
        if (this.ks === s) return;
        this.ks = s;
        const i = t.onResolve(this.Rs(null, s), (() => {
            this.Bs(s, this.position);
            return this.Ss(null, s);
        }));
        if (T(i)) i.catch(q);
    }
    positionChanged() {
        const {$controller: e, ks: s} = this;
        if (!e.isActive) return;
        const i = t.onResolve(this.Rs(null, s), (() => {
            this.Bs(s, this.position);
            return this.Ss(null, s);
        }));
        if (T(i)) i.catch(q);
    }
    Ss(e, s) {
        const {activating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.Is(e, s)));
    }
    Is(e, s) {
        const {$controller: i, view: n} = this;
        if (null === e) n.nodes.insertBefore(this.As); else return t.onResolve(n.activate(e ?? n, i, i.scope), (() => this.Ts(s)));
        return this.Ts(s);
    }
    Ts(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    Rs(e, s) {
        const {deactivating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.Ls(e, s)));
    }
    Ls(e, s) {
        const {$controller: i, view: n} = this;
        if (null === e) n.nodes.remove(); else return t.onResolve(n.deactivate(e, i), (() => this.Es(s)));
        return this.Es(s);
    }
    Es(t) {
        const {deactivated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    Cs() {
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
    Bs(t, e) {
        const s = this.As;
        const i = s.$start;
        const n = t.parentNode;
        const r = [ i, s ];
        switch (e) {
          case "beforeend":
            kt(t, null, r);
            break;

          case "afterbegin":
            kt(t, t.firstChild, r);
            break;

          case "beforebegin":
            kt(n, t, r);
            break;

          case "afterend":
            kt(n, t.nextSibling, r);
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

Portal.inject = [ Oe, bs, ve ];

r([ O({
    primary: true
}) ], Portal.prototype, "target", void 0);

r([ O() ], Portal.prototype, "position", void 0);

r([ O({
    callback: "targetChanged"
}) ], Portal.prototype, "renderContext", void 0);

r([ O() ], Portal.prototype, "strict", void 0);

r([ O() ], Portal.prototype, "deactivating", void 0);

r([ O() ], Portal.prototype, "activating", void 0);

r([ O() ], Portal.prototype, "deactivated", void 0);

r([ O() ], Portal.prototype, "activated", void 0);

r([ O() ], Portal.prototype, "callbackContext", void 0);

ae("portal")(Portal);

class If {
    constructor(t, e) {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.Ps = false;
        this._s = 0;
        this.qs = t;
        this.l = e;
    }
    attaching(e, s) {
        let i;
        const n = this.$controller;
        const r = this._s++;
        const o = () => !this.Ps && this._s === r + 1;
        return t.onResolve(this.pending, (() => {
            if (!o()) return;
            this.pending = void 0;
            if (this.value) i = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.qs.create(); else i = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : this.elseFactory?.create();
            if (null == i) return;
            i.setLocation(this.l);
            this.pending = t.onResolve(i.activate(e, n, n.scope), (() => {
                if (o()) this.pending = void 0;
            }));
        }));
    }
    detaching(e, s) {
        this.Ps = true;
        return t.onResolve(this.pending, (() => {
            this.Ps = false;
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
        const r = this._s++;
        const o = () => !this.Ps && this._s === r + 1;
        let l;
        return t.onResolve(this.pending, (() => this.pending = t.onResolve(i?.deactivate(i, n), (() => {
            if (!o()) return;
            if (e) l = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.qs.create(); else l = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : this.elseFactory?.create();
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

If.inject = [ Oe, bs ];

r([ O ], If.prototype, "value", void 0);

r([ O({
    set: t => "" === t || !!t && "false" !== t
}) ], If.prototype, "cache", void 0);

ae("if")(If);

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

Else.inject = [ Oe ];

ae({
    name: "else"
})(Else);

function Dn(t) {
    t.dispose();
}

const Mn = [ 18, 17 ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.key = null;
        this.$s = new Map;
        this.Us = new Map;
        this.Ds = void 0;
        this.Ms = false;
        this.Fs = false;
        this.Os = null;
        this.Vs = void 0;
        this.Ns = false;
        const r = t.props[0].props[0];
        if (void 0 !== r) {
            const {to: t, value: s, command: i} = r;
            if ("key" === t) if (null === i) this.key = s; else if ("bind" === i) this.key = e.parse(s, 16); else throw y(`AUR775:${i}`); else throw y(`AUR776:${t}`);
        }
        this.l = s;
        this.js = i;
        this.f = n;
    }
    binding(t, e) {
        const i = this.js.bindings;
        const n = i.length;
        let r;
        let o;
        let l = 0;
        for (;n > l; ++l) {
            r = i[l];
            if (r.target === this && "items" === r.targetProperty) {
                o = this.forOf = r.ast;
                this.Hs = r;
                let t = o.iterable;
                while (null != t && Mn.includes(t.$kind)) {
                    t = t.expression;
                    this.Ms = true;
                }
                this.Os = t;
                break;
            }
        }
        this.Ws();
        const h = o.declaration;
        if (!(this.Ns = 24 === h.$kind || 25 === h.$kind)) this.local = s.astEvaluate(h, this.$controller.scope, r, null);
    }
    attaching(t, e) {
        this.zs();
        return this.Gs(t);
    }
    detaching(t, e) {
        this.Ws();
        return this.Xs(t);
    }
    unbinding(t, e) {
        this.Us.clear();
        this.$s.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) return;
        this.Ws();
        this.zs();
        this.Ks(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) return;
        if (this.Ms) {
            if (this.Fs) return;
            this.Fs = true;
            this.items = s.astEvaluate(this.forOf.iterable, i.scope, this.Hs, null);
            this.Fs = false;
            return;
        }
        this.zs();
        this.Ks(t, e);
    }
    Ks(e, i) {
        const n = this.views;
        const r = n.length;
        const o = this.key;
        const l = null !== o;
        if (l || void 0 === i) {
            const t = this.local;
            const e = this.Vs;
            const h = e.length;
            const a = this.forOf;
            const c = a.declaration;
            const u = this.Hs;
            const f = this.Ns;
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
                const C = this.$s;
                const B = this.Us;
                const S = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (l) {
                            x = p[d];
                            m = e[d];
                            g = Zn(C, o, x, Jn(B, x, a, S, u, t, f), u);
                            v = Zn(C, o, m, Jn(B, m, a, S, u, t, f), u);
                        } else {
                            x = g = tr(p[d], d);
                            m = v = tr(e[d], d);
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
                            g = Zn(C, o, x, Jn(B, x, a, S, u, t, f), u);
                            v = Zn(C, o, m, Jn(B, m, a, S, u, t, f), u);
                        } else {
                            x = g = tr(p[d], d);
                            m = v = tr(e[d], d);
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
                const R = d;
                const I = d;
                for (d = I; d <= y; ++d) {
                    if (C.has(m = l ? e[d] : tr(e[d], d))) v = C.get(m); else {
                        v = l ? Zn(C, o, m, Jn(B, m, a, S, u, t, f), u) : m;
                        C.set(m, v);
                    }
                    A.set(v, d);
                }
                for (d = R; d <= b; ++d) {
                    if (C.has(x = l ? p[d] : tr(p[d], d))) g = C.get(x); else g = l ? Zn(C, o, x, n[d].scope, u) : x;
                    k.set(g, d);
                    if (A.has(g)) i[A.get(g)] = d; else {
                        i.deletedIndices.push(d);
                        i.deletedItems.push(x);
                    }
                }
                for (d = I; d <= y; ++d) if (!k.has(C.get(l ? e[d] : tr(e[d], d)))) i[d] = -2;
                k.clear();
                A.clear();
            }
        }
        if (void 0 === i) {
            const e = t.onResolve(this.Xs(null), (() => this.Gs(null)));
            if (T(e)) e.catch(q);
        } else {
            const e = s.applyMutationsToIndices(i);
            if (e.deletedIndices.length > 0) {
                const s = t.onResolve(this.Qs(e), (() => this.Ys(r, e)));
                if (T(s)) s.catch(q);
            } else this.Ys(r, e);
        }
    }
    Ws() {
        const t = this.$controller.scope;
        let e = this.Zs;
        let i = this.Ms;
        let n;
        if (i) {
            e = this.Zs = s.astEvaluate(this.Os, t, this.Hs, null) ?? null;
            i = this.Ms = !$(this.items, e);
        }
        const r = this.Ds;
        if (this.$controller.isActive) {
            n = this.Ds = s.getCollectionObserver(i ? e : this.items);
            if (r !== n) {
                r?.unsubscribe(this);
                n?.subscribe(this);
            }
        } else {
            r?.unsubscribe(this);
            this.Ds = void 0;
        }
    }
    zs() {
        const {items: t} = this;
        if (L(t)) {
            this.Vs = t;
            return;
        }
        const e = [];
        Gn(t, ((t, s) => {
            e[s] = t;
        }));
        this.Vs = e;
    }
    Gs(t) {
        let e;
        let s;
        let i;
        let n;
        const {$controller: r, f: o, local: l, l: h, items: a, Us: c, Hs: u, forOf: f, Ns: d} = this;
        const p = r.scope;
        const x = zn(a);
        const m = this.views = Array(x);
        Gn(a, ((a, g) => {
            i = m[g] = o.create().setLocation(h);
            i.nodes.unlink();
            n = Jn(c, a, f, p, u, l, d);
            Hn(n.overrideContext, g, x);
            s = i.activate(t ?? i, r, n);
            if (T(s)) (e ?? (e = [])).push(s);
        }));
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    Xs(t) {
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
    Qs(t) {
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
    Ys(t, e) {
        let i;
        let n;
        let r;
        let o;
        let l = 0;
        const {$controller: h, f: a, local: c, Vs: u, l: f, views: d, Ns: p, Hs: x, Us: m, forOf: g} = this;
        const v = e.length;
        for (;v > l; ++l) if (-2 === e[l]) {
            r = a.create();
            d.splice(l, 0, r);
        }
        if (d.length !== v) throw jn(d.length, v);
        const w = h.scope;
        const b = e.length;
        s.synchronizeIndices(d, e);
        const y = Nn(e);
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
                o = Jn(m, u[l], g, w, x, c, p);
                Hn(o.overrideContext, l, b);
                r.setLocation(f);
                n = r.activate(r, h, o);
                if (T(n)) (i ?? (i = [])).push(n);
            } else if (B < 0 || 1 === k || l !== y[B]) {
                if (p) s.astAssign(A, r.scope, x, u[l]); else r.scope.bindingContext[c] = u[l];
                Hn(r.scope.overrideContext, l, b);
                r.nodes.insertBefore(r.location);
            } else {
                if (p) s.astAssign(A, r.scope, x, u[l]); else r.scope.bindingContext[c] = u[l];
                if (t !== b) Hn(r.scope.overrideContext, l, b);
                --B;
            }
        }
        if (void 0 !== i) return 1 === i.length ? i[0] : Promise.all(i);
    }
    dispose() {
        this.views.forEach(Dn);
        this.views = void 0;
    }
    accept(t) {
        const {views: e} = this;
        if (void 0 !== e) for (let s = 0, i = e.length; s < i; ++s) if (true === e[s].accept(t)) return true;
    }
}

Repeat.inject = [ li, s.IExpressionParser, bs, ts, Oe ];

r([ O ], Repeat.prototype, "items", void 0);

ae("repeat")(Repeat);

let Fn = 16;

let On = new Int32Array(Fn);

let Vn = new Int32Array(Fn);

function Nn(t) {
    const e = t.length;
    if (e > Fn) {
        Fn = e;
        On = new Int32Array(e);
        Vn = new Int32Array(e);
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
            o = On[s];
            n = t[o];
            if (-2 !== n && n < i) {
                Vn[r] = o;
                On[++s] = r;
                continue;
            }
            l = 0;
            h = s;
            while (l < h) {
                a = l + h >> 1;
                n = t[On[a]];
                if (-2 !== n && n < i) l = a + 1; else h = a;
            }
            n = t[On[l]];
            if (i < n || -2 === n) {
                if (l > 0) Vn[r] = On[l - 1];
                On[l] = r;
            }
        }
    }
    r = ++s;
    const c = new Int32Array(r);
    i = On[s - 1];
    while (s-- > 0) {
        c[s] = i;
        i = Vn[i];
    }
    while (r-- > 0) On[r] = 0;
    return c;
}

const jn = (t, e) => y(`AUR0814:${t}!=${e}`);

const Hn = (t, e, s) => {
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

const Wn = w.toString;

const zn = t => {
    switch (Wn.call(t)) {
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
        throw y(`Cannot count ${Wn.call(t)}`);
    }
};

const Gn = (t, e) => {
    switch (Wn.call(t)) {
      case "[object Array]":
        return Xn(t, e);

      case "[object Map]":
        return Kn(t, e);

      case "[object Set]":
        return Qn(t, e);

      case "[object Number]":
        return Yn(t, e);

      case "[object Null]":
        return;

      case "[object Undefined]":
        return;

      default:
        throw y(`Cannot iterate over ${Wn.call(t)}`);
    }
};

const Xn = (t, e) => {
    const s = t.length;
    let i = 0;
    for (;i < s; ++i) e(t[i], i, t);
};

const Kn = (t, e) => {
    let s = -0;
    let i;
    for (i of t.entries()) e(i, s++, t);
};

const Qn = (t, e) => {
    let s = 0;
    let i;
    for (i of t.keys()) e(i, s++, t);
};

const Yn = (t, e) => {
    let s = 0;
    for (;s < t; ++s) e(s, s, t);
};

const Zn = (t, e, i, n, r) => {
    let o = t.get(i);
    if (void 0 === o) {
        if ("string" === typeof e) o = i[e]; else o = s.astEvaluate(e, n, r, null);
        t.set(i, o);
    }
    return o;
};

const Jn = (t, e, i, n, r, o, l) => {
    let h = t.get(e);
    if (void 0 === h) {
        if (l) s.astAssign(i.declaration, h = s.Scope.fromParent(n, new s.BindingContext), r, e); else h = s.Scope.fromParent(n, new s.BindingContext(o, e));
        t.set(e, h);
    }
    return h;
};

const tr = (t, e) => {
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

With.inject = [ Oe, bs ];

r([ O ], With.prototype, "value", void 0);

ae("with")(With);

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
        this.queue((() => this.Js(t)));
    }
    Js(e) {
        const s = e.isMatch(this.value);
        const i = this.activeCases;
        const n = i.length;
        if (!s) {
            if (n > 0 && i[0].id === e.id) return this.ti(null);
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
        return t.onResolve(this.ti(null, r), (() => {
            this.activeCases = r;
            return this.ei(null);
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
        return t.onResolve(this.activeCases.length > 0 ? this.ti(e, i) : void 0, (() => {
            this.activeCases = i;
            if (0 === i.length) return;
            return this.ei(e);
        }));
    }
    ei(e) {
        const s = this.$controller;
        if (!s.isActive) return;
        const i = this.activeCases;
        const n = i.length;
        if (0 === n) return;
        const r = s.scope;
        if (1 === n) return i[0].activate(e, r);
        return t.resolveAll(...i.map((t => t.activate(e, r))));
    }
    ti(e, s = []) {
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

r([ O ], exports.Switch.prototype, "value", void 0);

exports.Switch = r([ ae("switch"), o(0, Oe), o(1, bs) ], exports.Switch);

let er = 0;

exports.Case = class Case {
    constructor(t, e, s, i) {
        this.f = t;
        this.si = e;
        this.l = s;
        this.id = ++er;
        this.fallThrough = false;
        this.view = void 0;
        this.ii = i.config.level <= 1;
        this.Ne = i.scopeTo(`${this.constructor.name}-#${this.id}`);
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
        this.Ne.debug("isMatch()");
        const e = this.value;
        if (L(e)) {
            if (void 0 === this.Ds) this.Ds = this.ni(e);
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (L(t)) {
            this.Ds?.unsubscribe(this);
            this.Ds = this.ni(t);
        } else if (void 0 !== this.Ds) this.Ds.unsubscribe(this);
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
        this.Ds?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    ni(t) {
        const e = this.si.getArrayObserver(t);
        e.subscribe(this);
        return e;
    }
    accept(t) {
        if (true === this.$controller.accept(t)) return true;
        return this.view?.accept(t);
    }
};

exports.Case.inject = [ Oe, s.IObserverLocator, bs, t.ILogger ];

r([ O ], exports.Case.prototype, "value", void 0);

r([ O({
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

exports.Case = r([ ae("case") ], exports.Case);

exports.DefaultCase = class DefaultCase extends exports.Case {
    linkToSwitch(t) {
        if (void 0 !== t.defaultCase) throw y(`AUR0816`);
        t.defaultCase = this;
    }
};

exports.DefaultCase = r([ ae("default-case") ], exports.DefaultCase);

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

r([ O ], exports.PromiseTemplateController.prototype, "value", void 0);

exports.PromiseTemplateController = r([ ae("promise"), o(0, Oe), o(1, bs), o(2, ve), o(3, t.ILogger) ], exports.PromiseTemplateController);

exports.PendingTemplateController = class PendingTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, s, i) {
        sr(t).pending = this;
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

r([ O({
    mode: 2
}) ], exports.PendingTemplateController.prototype, "value", void 0);

exports.PendingTemplateController = r([ ae("pending"), o(0, Oe), o(1, bs) ], exports.PendingTemplateController);

exports.FulfilledTemplateController = class FulfilledTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, s, i) {
        sr(t).fulfilled = this;
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

r([ O({
    mode: 4
}) ], exports.FulfilledTemplateController.prototype, "value", void 0);

exports.FulfilledTemplateController = r([ ae("then"), o(0, Oe), o(1, bs) ], exports.FulfilledTemplateController);

exports.RejectedTemplateController = class RejectedTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, s, i) {
        sr(t).rejected = this;
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

r([ O({
    mode: 4
}) ], exports.RejectedTemplateController.prototype, "value", void 0);

exports.RejectedTemplateController = r([ ae("catch"), o(0, Oe), o(1, bs) ], exports.RejectedTemplateController);

function sr(t) {
    const e = t.parent;
    const s = e?.viewModel;
    if (s instanceof exports.PromiseTemplateController) return s;
    throw y(`AUR0813`);
}

let ir = class PromiseAttributePattern {
    "promise.resolve"(t, e, s) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

ir = r([ at({
    pattern: "promise.resolve",
    symbols: ""
}) ], ir);

let nr = class FulfilledAttributePattern {
    then(t, e, s) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

nr = r([ at({
    pattern: "then",
    symbols: ""
}) ], nr);

let rr = class RejectedAttributePattern {
    catch(t, e, s) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

rr = r([ at({
    pattern: "catch",
    symbols: ""
}) ], rr);

class AuCompose {
    static get inject() {
        return [ t.IContainer, ts, vs, bs, ve, li, t.transient(CompositionContextFactory) ];
    }
    get pending() {
        return this.ri;
    }
    get composition() {
        return this.oi;
    }
    constructor(t, e, s, i, n, r, o) {
        this.c = t;
        this.parent = e;
        this.host = s;
        this.l = i;
        this.p = n;
        this.scopeBehavior = "auto";
        this.oi = void 0;
        this.r = t.get(Ve);
        this.li = r;
        this.hi = o;
    }
    attaching(e, s) {
        return this.ri = t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), e), (t => {
            if (this.hi.isCurrent(t)) this.ri = void 0;
        }));
    }
    detaching(e) {
        const s = this.oi;
        const i = this.ri;
        this.hi.invalidate();
        this.oi = this.ri = void 0;
        return t.onResolve(i, (() => s?.deactivate(e)));
    }
    propertyChanged(e) {
        if ("model" === e && null != this.oi) {
            this.oi.update(this.model);
            return;
        }
        this.ri = t.onResolve(this.ri, (() => t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, e), void 0), (t => {
            if (this.hi.isCurrent(t)) this.ri = void 0;
        }))));
    }
    queue(e, s) {
        const i = this.hi;
        const n = this.oi;
        return t.onResolve(i.create(e), (e => {
            if (i.isCurrent(e)) return t.onResolve(this.compose(e), (r => {
                if (i.isCurrent(e)) return t.onResolve(r.activate(s), (() => {
                    if (i.isCurrent(e)) {
                        this.oi = r;
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
        const {be: o, ai: l, ui: h} = e.change;
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
            i = this.fi(p, l, n);
        } else {
            n = null == f ? c : f;
            i = this.fi(p, l, n);
        }
        const m = () => {
            if (null !== d) {
                const s = Controller.$el(p, i, n, {
                    projections: this.li.projections
                }, d);
                return new CompositionController(s, (t => s.activate(t ?? s, u, u.scope.parent)), (e => t.onResolve(s.deactivate(e ?? s, u), r)), (t => i.activate?.(t)), e);
            } else {
                const t = CustomElementDefinition.create({
                    name: Js.generateName(),
                    template: o
                });
                const r = this.r.getViewFactory(t, p);
                const l = Controller.$view(r, u);
                const h = "auto" === this.scopeBehavior ? s.Scope.fromParent(this.parent.scope, i) : s.Scope.create(i);
                if (Ss(n)) l.setLocation(n); else l.setHost(n);
                return new CompositionController(l, (t => l.activate(t ?? l, u, h)), (t => l.deactivate(t ?? l, u)), (t => i.activate?.(t)), e);
            }
        };
        if ("activate" in i) return t.onResolve(i.activate(h), (() => m())); else return m();
    }
    fi(e, s, i) {
        if (null == s) return new EmptyComponent;
        if ("object" === typeof s) return s;
        const n = this.p;
        const r = Ss(i);
        et(e, n.Element, et(e, vs, new t.InstanceProvider("ElementResolver", r ? null : i)));
        et(e, bs, new t.InstanceProvider("IRenderLocation", r ? i : null));
        const o = e.invoke(s);
        et(e, s, new t.InstanceProvider("au-compose.component", o));
        return o;
    }
    getDef(t) {
        const e = E(t) ? t : t?.constructor;
        return Js.isType(e) ? Js.getDefinition(e) : null;
    }
}

r([ O ], AuCompose.prototype, "template", void 0);

r([ O ], AuCompose.prototype, "component", void 0);

r([ O ], AuCompose.prototype, "model", void 0);

r([ O({
    set: t => {
        if ("scoped" === t || "auto" === t) return t;
        throw y(`AUR0805`);
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
    create(e) {
        return t.onResolve(e.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, s, i) {
        this.be = t;
        this.ai = e;
        this.ui = s;
        this.di = i;
    }
    load() {
        if (T(this.be) || T(this.ai)) return Promise.all([ this.be, this.ai ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.ui, this.di))); else return new LoadedChangeInfo(this.be, this.ai, this.ui, this.di);
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.be = t;
        this.ai = e;
        this.ui = s;
        this.di = i;
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
        return [ bs, li, es, Ve ];
    }
    constructor(e, s, i, n) {
        this.pi = null;
        this.xi = null;
        this.mi = false;
        this.expose = null;
        this.slotchange = null;
        this.gi = new Set;
        this.Ds = null;
        let r;
        let o;
        const l = s.auSlot;
        const h = i.instruction?.projections?.[l.name];
        const a = i.controller;
        this.name = l.name;
        if (null == h) {
            r = n.getViewFactory(l.fallback, a.container);
            this.vi = false;
        } else {
            o = i.parent.controller.container.createChild();
            et(o, a.definition.Type, new t.InstanceProvider(void 0, a.viewModel));
            r = n.getViewFactory(h, o);
            this.vi = true;
            this.wi = a.container.getAll(ri, false)?.filter((t => "*" === t.slotName || t.slotName === l.name)) ?? t.emptyArray;
        }
        this.bi = (this.wi ?? (this.wi = t.emptyArray)).length > 0;
        this.yi = i;
        this.view = r.create().setLocation(this.l = e);
    }
    get nodes() {
        const t = [];
        const e = this.l;
        let s = e.$start.nextSibling;
        while (null != s && s !== e) {
            if (8 !== s.nodeType) t.push(s);
            s = s.nextSibling;
        }
        return t;
    }
    subscribe(t) {
        this.gi.add(t);
    }
    unsubscribe(t) {
        this.gi.delete(t);
    }
    binding(t, e) {
        this.pi = this.$controller.scope.parent;
        let i;
        if (this.vi) {
            i = this.yi.controller.scope.parent;
            (this.xi = s.Scope.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.pi.bindingContext;
        }
    }
    attaching(e, s) {
        return t.onResolve(this.view.activate(e, this.$controller, this.vi ? this.xi : this.pi), (() => {
            if (this.bi) {
                this.wi.forEach((t => t.watch(this)));
                this.Xe();
                this.ki();
                this.mi = true;
            }
        }));
    }
    detaching(t, e) {
        this.mi = false;
        this.Ai();
        this.wi.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.vi && null != this.xi) this.xi.overrideContext.$host = t;
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        if (true === this.view?.accept(t)) return true;
    }
    Xe() {
        if (null != this.Ds) return;
        const t = this.l;
        const e = t.parentElement;
        if (null == e) return;
        (this.Ds = Rt(e, (e => {
            if (lr(t, e)) this.ki();
        }))).observe(e, {
            childList: true
        });
    }
    Ai() {
        this.Ds?.disconnect();
        this.Ds = null;
    }
    ki() {
        const t = this.nodes;
        const e = new Set(this.gi);
        let s;
        if (this.mi) this.slotchange?.call(void 0, this.name, t);
        for (s of e) s.handleSlotChange(this, t);
    }
};

r([ O ], exports.AuSlot.prototype, "expose", void 0);

r([ O ], exports.AuSlot.prototype, "slotchange", void 0);

exports.AuSlot = r([ Ls({
    name: "au-slot",
    template: null,
    containerless: true
}) ], exports.AuSlot);

const or = (t, e) => t.compareDocumentPosition(e);

const lr = (t, e) => {
    for (const {addedNodes: s, removedNodes: i, nextSibling: n} of e) {
        let e = 0;
        let r = s.length;
        let o;
        for (;e < r; ++e) {
            o = s[e];
            if (4 === or(t.$start, o) && 2 === or(t, o)) return true;
        }
        if (i.length > 0) if (null != n && 4 === or(t.$start, n) && 2 === or(t, n)) return true;
    }
};

const hr = Q("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw y('"sanitize" method not implemented');
    }
})));

exports.SanitizeValueConverter = class SanitizeValueConverter {
    constructor(t) {
        this.Ci = t;
    }
    toView(t) {
        if (null == t) return null;
        return this.Ci.sanitize(t);
    }
};

exports.SanitizeValueConverter = r([ o(0, hr) ], exports.SanitizeValueConverter);

Mt("sanitize")(exports.SanitizeValueConverter);

const ar = DebounceBindingBehavior;

const cr = OneTimeBindingBehavior;

const ur = ToViewBindingBehavior;

const fr = FromViewBindingBehavior;

const dr = SignalBindingBehavior;

const pr = ThrottleBindingBehavior;

const xr = TwoWayBindingBehavior;

const mr = TemplateCompiler;

const gr = NodeObserverLocator;

const vr = [ mr, gr ];

const wr = SVGAnalyzer;

const br = exports.AtPrefixedTriggerAttributePattern;

const yr = exports.ColonPrefixedBindAttributePattern;

const kr = exports.RefAttributePattern;

const Ar = exports.DotSeparatedAttributePattern;

const Cr = pt;

const Br = [ kr, Ar, Cr ];

const Sr = [ br, yr ];

const Rr = exports.DefaultBindingCommand;

const Ir = exports.ForBindingCommand;

const Tr = exports.FromViewBindingCommand;

const Lr = exports.OneTimeBindingCommand;

const Er = exports.ToViewBindingCommand;

const Pr = exports.TwoWayBindingCommand;

const _r = Ei;

const qr = exports.TriggerBindingCommand;

const $r = exports.CaptureBindingCommand;

const Ur = exports.AttrBindingCommand;

const Dr = exports.ClassBindingCommand;

const Mr = exports.StyleBindingCommand;

const Fr = Pi;

const Or = [ Rr, Lr, Tr, Er, Pr, Ir, _r, qr, $r, Dr, Mr, Ur, Fr ];

const Vr = exports.SanitizeValueConverter;

const Nr = If;

const jr = Else;

const Hr = Repeat;

const Wr = With;

const zr = exports.Switch;

const Gr = exports.Case;

const Xr = exports.DefaultCase;

const Kr = exports.PromiseTemplateController;

const Qr = exports.PendingTemplateController;

const Yr = exports.FulfilledTemplateController;

const Zr = exports.RejectedTemplateController;

const Jr = ir;

const to = nr;

const eo = rr;

const so = SelfBindingBehavior;

const io = UpdateTriggerBindingBehavior;

const no = AuCompose;

const ro = Portal;

const oo = Focus;

const lo = Un;

const ho = [ ar, cr, ur, fr, dr, pr, xr, Vr, Nr, jr, Hr, Wr, zr, Gr, Xr, Kr, Qr, Yr, Zr, Jr, to, eo, AttrBindingBehavior, so, io, no, ro, oo, lo, exports.AuSlot ];

const ao = [ exports.PropertyBindingRenderer, exports.IteratorBindingRenderer, exports.RefBindingRenderer, exports.InterpolationBindingRenderer, exports.SetPropertyRenderer, exports.CustomElementRenderer, exports.CustomAttributeRenderer, exports.TemplateControllerRenderer, exports.LetElementRenderer, exports.ListenerBindingRenderer, exports.AttributeBindingRenderer, exports.SetAttributeRenderer, exports.SetClassAttributeRenderer, exports.SetStyleAttributeRenderer, exports.StylePropertyBindingRenderer, exports.TextBindingRenderer, exports.SpreadRenderer ];

const co = uo(t.noop);

function uo(t) {
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
            return e.register(J(s.ICoercionConfiguration, i.coercingOptions), ...vr, ...ho, ...Br, ...Or, ...ao);
        },
        customize(e) {
            return uo(e ?? t);
        }
    };
}

const fo = Q("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.Bi;
    }
    get isStopping() {
        return this.Si;
    }
    get root() {
        if (null == this.Ri) {
            if (null == this.next) throw y(`AUR0767`);
            return this.next;
        }
        return this.Ri;
    }
    constructor(e = t.DI.createContainer()) {
        this.container = e;
        this.ir = false;
        this.Bi = false;
        this.Si = false;
        this.Ri = void 0;
        this.next = void 0;
        this.Ii = void 0;
        this.Ti = void 0;
        if (e.has(fo, true)) throw y(`AUR0768`);
        et(e, fo, new t.InstanceProvider("IAurelia", this));
        et(e, xs, this.Li = new t.InstanceProvider("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.Ei(t.host), this.container, this.Li);
        return this;
    }
    enhance(e, s) {
        const i = e.container ?? this.container.createChild();
        const n = e.host;
        const r = this.Ei(n);
        const o = e.component;
        let l;
        if (E(o)) {
            et(i, r.HTMLElement, et(i, r.Element, et(i, vs, new t.InstanceProvider("ElementResolver", n))));
            l = i.invoke(o);
        } else l = o;
        et(i, ws, new t.InstanceProvider("IEventTarget", n));
        s = s ?? null;
        const h = Controller.$el(i, l, n, null, CustomElementDefinition.create({
            name: Hs(),
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
    Ei(t) {
        let e;
        if (!this.container.has(ve, false)) {
            if (null === t.ownerDocument.defaultView) throw y(`AUR0769`);
            e = new n.BrowserPlatform(t.ownerDocument.defaultView);
            this.container.register(J(ve, e));
        } else e = this.container.get(ve);
        return e;
    }
    start(e = this.next) {
        if (null == e) throw y(`AUR0770`);
        if (T(this.Ii)) return this.Ii;
        return this.Ii = t.onResolve(this.stop(), (() => {
            Reflect.set(e.host, "$aurelia", this);
            this.Li.prepare(this.Ri = e);
            this.Bi = true;
            return t.onResolve(e.activate(), (() => {
                this.ir = true;
                this.Bi = false;
                this.Ii = void 0;
                this.Pi(e, "au-started", e.host);
            }));
        }));
    }
    stop(e = false) {
        if (T(this.Ti)) return this.Ti;
        if (true === this.ir) {
            const s = this.Ri;
            this.ir = false;
            this.Si = true;
            return this.Ti = t.onResolve(s.deactivate(), (() => {
                Reflect.deleteProperty(s.host, "$aurelia");
                if (e) s.dispose();
                this.Ri = void 0;
                this.Li.dispose();
                this.Si = false;
                this.Pi(s, "au-stopped", s.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.Si) throw y(`AUR0771`);
        this.container.dispose();
    }
    Pi(t, e, s) {
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

function po(t, e) {
    let s;
    const i = "dependencies";
    function n(t, e, n) {
        if (arguments.length > 1) s.name = e;
        if ("function" === typeof t || "undefined" !== typeof n?.value) throw new Error(`Invalid usage. @children can only be used on a field`);
        const r = t.constructor;
        let o = Js.getAnnotation(r, i);
        if (null == o) Js.annotate(r, i, o = []);
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
    static create(t, e, s, i, n = go, r = vo, o = wo, l = xo) {
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
    constructor(t, e, s, i = go, n = vo, r = wo, o = xo) {
        this._i = void 0;
        this.ce = go;
        this.qi = vo;
        this.$i = wo;
        this.isBound = false;
        this.ht = t;
        this.cb = (this.obj = e)[s];
        this.ce = i;
        this.qi = n;
        this.$i = r;
        this.vt = o;
        this.Ds = Rt(this.Ui = t.host, (() => {
            this.Di();
        }));
    }
    getValue() {
        return this.isBound ? this._i : this.Mi();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) return;
        this.isBound = true;
        this.Ds.observe(this.Ui, this.vt);
        this._i = this.Mi();
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.Ds.disconnect();
        this._i = t.emptyArray;
    }
    Di() {
        this._i = this.Mi();
        this.cb?.call(this.obj);
        this.subs.notify(this._i, void 0);
    }
    get() {
        throw mo("get");
    }
    Mi() {
        return yo(this.ht, this.ce, this.qi, this.$i);
    }
}

s.subscriberCollection(ChildrenBinding);

const xo = {
    childList: true
};

const mo = t => y(`Method "${t}": not implemented`);

const go = t => t.host.childNodes;

const vo = (t, e, s) => !!s;

const wo = (t, e, s) => s;

const bo = {
    optional: true
};

const yo = (t, e, s, i) => {
    const n = e(t);
    const r = n.length;
    const o = [];
    let l;
    let h;
    let a;
    let c = 0;
    for (;c < r; ++c) {
        l = n[c];
        h = Xs(l, bo);
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
        J($e, this).register(t);
    }
    hydrating(t, e) {
        const s = this.def;
        e.addBinding(ChildrenBinding.create(e, e.viewModel, s.name, s.callback ?? `${v(s.name)}Changed`, s.query ?? go, s.filter ?? vo, s.map ?? wo, s.options ?? xo));
    }
}

Fe()(ChildrenLifecycleHooks);

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = se;

exports.AtPrefixedTriggerAttributePatternRegistration = br;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrBindingCommandRegistration = Ur;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = dt;

exports.AuCompose = AuCompose;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = j;

exports.BindableDefinition = BindableDefinition;

exports.BindableObserver = BindableObserver;

exports.BindablesInfo = BindablesInfo;

exports.BindingBehavior = Dt;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingCommand = Li;

exports.BindingCommandDefinition = BindingCommandDefinition;

exports.BindingModeBehavior = BindingModeBehavior;

exports.BindingTargetSubscriber = BindingTargetSubscriber;

exports.CSSModulesProcessorRegistry = CSSModulesProcessorRegistry;

exports.CaptureBindingCommandRegistration = $r;

exports.CheckedObserver = CheckedObserver;

exports.ChildrenBinding = ChildrenBinding;

exports.ClassAttributeAccessor = ClassAttributeAccessor;

exports.ClassBindingCommandRegistration = Dr;

exports.ColonPrefixedBindAttributePatternRegistration = yr;

exports.ComputedWatcher = ComputedWatcher;

exports.ContentBinding = ContentBinding;

exports.Controller = Controller;

exports.CustomAttribute = ge;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomElement = Js;

exports.CustomElementDefinition = CustomElementDefinition;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DebounceBindingBehaviorRegistration = ar;

exports.DefaultBindingCommandRegistration = Rr;

exports.DefaultBindingLanguage = Or;

exports.DefaultBindingSyntax = Br;

exports.DefaultComponents = vr;

exports.DefaultRenderers = ao;

exports.DefaultResources = ho;

exports.DotSeparatedAttributePatternRegistration = Ar;

exports.Else = Else;

exports.ElseRegistration = jr;

exports.ExpressionWatcher = ExpressionWatcher;

exports.FlushQueue = FlushQueue;

exports.Focus = Focus;

exports.ForBindingCommandRegistration = Ir;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.FromViewBindingBehaviorRegistration = fr;

exports.FromViewBindingCommandRegistration = Tr;

exports.HooksDefinition = HooksDefinition;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAppRoot = xs;

exports.IAppTask = ee;

exports.IAttrMapper = $i;

exports.IAttributeParser = ht;

exports.IAttributePattern = lt;

exports.IAuSlotWatcher = ri;

exports.IAuSlotsInfo = ni;

exports.IAurelia = fo;

exports.IController = ts;

exports.IEventTarget = ws;

exports.IFlushQueue = Wt;

exports.IHistory = Ts;

exports.IHydrationContext = es;

exports.IInstruction = li;

exports.ILifecycleHooks = $e;

exports.ILocation = Is;

exports.INode = vs;

exports.INodeObserverLocatorRegistration = gr;

exports.IPlatform = ve;

exports.IRenderLocation = bs;

exports.IRenderer = ci;

exports.IRendering = Ve;

exports.ISVGAnalyzer = _i;

exports.ISanitizer = hr;

exports.IShadowDOMGlobalStyles = Te;

exports.IShadowDOMStyles = Ie;

exports.ISyntaxInterpreter = nt;

exports.ITemplateCompiler = ai;

exports.ITemplateCompilerHooks = ln;

exports.ITemplateCompilerRegistration = mr;

exports.ITemplateElementFactory = Mi;

exports.IViewFactory = Oe;

exports.IWindow = Rs;

exports.If = If;

exports.IfRegistration = Nr;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LifecycleHooks = Me;

exports.LifecycleHooksDefinition = LifecycleHooksDefinition;

exports.LifecycleHooksEntry = LifecycleHooksEntry;

exports.ListenerBinding = ListenerBinding;

exports.ListenerBindingInstruction = ListenerBindingInstruction;

exports.ListenerBindingOptions = ListenerBindingOptions;

exports.MultiAttrInstruction = MultiAttrInstruction;

exports.NodeObserverLocator = NodeObserverLocator;

exports.NoopSVGAnalyzer = NoopSVGAnalyzer;

exports.OneTimeBindingBehavior = OneTimeBindingBehavior;

exports.OneTimeBindingBehaviorRegistration = cr;

exports.OneTimeBindingCommandRegistration = Lr;

exports.Portal = Portal;

exports.PropertyBinding = PropertyBinding;

exports.PropertyBindingInstruction = PropertyBindingInstruction;

exports.RefAttributePatternRegistration = kr;

exports.RefBinding = RefBinding;

exports.RefBindingCommandRegistration = _r;

exports.RefBindingInstruction = RefBindingInstruction;

exports.Rendering = Rendering;

exports.Repeat = Repeat;

exports.RepeatRegistration = Hr;

exports.SVGAnalyzer = SVGAnalyzer;

exports.SVGAnalyzerRegistration = wr;

exports.SanitizeValueConverterRegistration = Vr;

exports.SelectValueObserver = SelectValueObserver;

exports.SelfBindingBehavior = SelfBindingBehavior;

exports.SelfBindingBehaviorRegistration = so;

exports.SetAttributeInstruction = SetAttributeInstruction;

exports.SetClassAttributeInstruction = SetClassAttributeInstruction;

exports.SetPropertyInstruction = SetPropertyInstruction;

exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;

exports.ShadowDOMRegistry = ShadowDOMRegistry;

exports.ShortHandBindingSyntax = Sr;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SignalBindingBehaviorRegistration = dr;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.StandardConfiguration = co;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleBindingCommandRegistration = Mr;

exports.StyleConfiguration = Le;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = cn;

exports.TextBindingInstruction = TextBindingInstruction;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ThrottleBindingBehaviorRegistration = pr;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.ToViewBindingBehaviorRegistration = ur;

exports.ToViewBindingCommandRegistration = Er;

exports.TriggerBindingCommandRegistration = qr;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.TwoWayBindingBehaviorRegistration = xr;

exports.TwoWayBindingCommandRegistration = Pr;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.UpdateTriggerBindingBehaviorRegistration = io;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ValueConverter = Vt;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ViewFactory = ViewFactory;

exports.Watch = le;

exports.With = With;

exports.WithRegistration = Wr;

exports.alias = st;

exports.allResources = K;

exports.attributePattern = at;

exports.bindable = O;

exports.bindingBehavior = qt;

exports.bindingCommand = Si;

exports.capture = ii;

exports.children = po;

exports.coercer = H;

exports.containerless = Ps;

exports.convertToRenderLocation = Bs;

exports.cssModules = Be;

exports.customAttribute = he;

exports.customElement = Ls;

exports.getEffectiveParentNode = As;

exports.getRef = ms;

exports.isCustomElementController = Qe;

exports.isCustomElementViewModel = Ye;

exports.isInstruction = hi;

exports.isRenderLocation = Ss;

exports.lifecycleHooks = Fe;

exports.mixinAstEvaluator = jt;

exports.mixinUseScope = Nt;

exports.mixingBindingLimited = Xt;

exports.processContent = ei;

exports.registerAliases = it;

exports.renderer = ui;

exports.setEffectiveParentNode = Cs;

exports.setRef = gs;

exports.shadowCSS = Se;

exports.slotted = oi;

exports.strict = qs;

exports.templateCompilerHooks = un;

exports.templateController = ae;

exports.useShadowDOM = Es;

exports.valueConverter = Mt;

exports.watch = ne;
//# sourceMappingURL=index.cjs.map
