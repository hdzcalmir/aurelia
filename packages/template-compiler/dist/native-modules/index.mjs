import { DI as t, Registration as e, getResourceKeyFor as n, registrableMetadataKey as i, emptyArray as s, resolve as r, IContainer as l, firstDefined as o, mergeArrays as u, Protocol as c, resourceBaseName as a, resource as h, camelCase as d, IPlatform as f, createImplementationRegister as m, noop as p, toArray as g, pascalCase as w, ILogger as b, allResources as A } from "../../../kernel/dist/native-modules/index.mjs";

import { Metadata as y } from "../../../metadata/dist/native-modules/index.mjs";

import { PrimitiveLiteralExpression as I, IExpressionParser as B } from "../../../expression-parser/dist/native-modules/index.mjs";

const isString = t => typeof t === "string";

const S = t.createInterface;

const P = Object.freeze;

const {aliasTo: C, singleton: T} = e;

const R = "Interpolation";

const E = "IsFunction";

const x = "IsProperty";

const v = "custom-element";

const _ = /*@__PURE__*/ P({
    default: 0,
    oneTime: 1,
    toView: 2,
    fromView: 4,
    twoWay: 6
});

const k = /*@__PURE__*/ S("ITemplateCompiler");

const L = /*@__PURE__*/ S("IAttrMapper");

const createMappedError = (t, ...e) => new Error(`AUR${String(t).padStart(4, "0")}:${e.map(String)}`);

var D, V, H, M, $;

class CharSpec {
    constructor(t, e, n, i) {
        this.chars = t;
        this.repeat = e;
        this.isSymbol = n;
        this.isInverted = i;
        if (i) {
            switch (t.length) {
              case 0:
                this.has = this.i;
                break;

              case 1:
                this.has = this.u;
                break;

              default:
                this.has = this.A;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.I;
                break;

              case 1:
                this.has = this.B;
                break;

              default:
                this.has = this.P;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    P(t) {
        return this.chars.includes(t);
    }
    B(t) {
        return this.chars === t;
    }
    I(t) {
        return false;
    }
    A(t) {
        return !this.chars.includes(t);
    }
    u(t) {
        return this.chars !== t;
    }
    i(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = s;
        this.C = "";
        this.T = {};
        this.R = {};
    }
    get pattern() {
        const t = this.C;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(t) {
        if (t == null) {
            this.C = "";
            this.parts = s;
        } else {
            this.C = t;
            this.parts = this.R[t];
        }
    }
    append(t, e) {
        const n = this.T;
        if (n[t] === undefined) {
            n[t] = e;
        } else {
            n[t] += e;
        }
    }
    next(t) {
        const e = this.T;
        let n;
        if (e[t] !== undefined) {
            n = this.R;
            if (n[t] === undefined) {
                n[t] = [ e[t] ];
            } else {
                n[t].push(e[t]);
            }
            e[t] = undefined;
        }
    }
}

class AttrParsingState {
    get C() {
        return this._ ? this.L[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.V = [];
        this.H = null;
        this._ = false;
        this.L = e;
    }
    findChild(t) {
        const e = this.V;
        const n = e.length;
        let i = null;
        let s = 0;
        for (;s < n; ++s) {
            i = e[s];
            if (t.equals(i.charSpec)) {
                return i;
            }
        }
        return null;
    }
    append(t, e) {
        const n = this.L;
        if (!n.includes(e)) {
            n.push(e);
        }
        let i = this.findChild(t);
        if (i == null) {
            i = new AttrParsingState(t, e);
            this.V.push(i);
            if (t.repeat) {
                i.V.push(i);
            }
        }
        return i;
    }
    findMatches(t, e) {
        const n = [];
        const i = this.V;
        const s = i.length;
        let r = 0;
        let l = null;
        let o = 0;
        let u = 0;
        for (;o < s; ++o) {
            l = i[o];
            if (l.charSpec.has(t)) {
                n.push(l);
                r = l.L.length;
                u = 0;
                if (l.charSpec.isSymbol) {
                    for (;u < r; ++u) {
                        e.next(l.L[u]);
                    }
                } else {
                    for (;u < r; ++u) {
                        e.append(l.L[u], t);
                    }
                }
            }
        }
        return n;
    }
}

class StaticSegment {
    constructor(t) {
        this.text = t;
        const e = this.M = t.length;
        const n = this.$ = [];
        let i = 0;
        for (;e > i; ++i) {
            n.push(new CharSpec(t[i], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.M;
        const n = this.$;
        let i = 0;
        for (;e > i; ++i) {
            t(n[i]);
        }
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.F = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.F);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.F = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.F);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const F = /*@__PURE__*/ S("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.O = new AttrParsingState(null);
        this.W = [ this.O ];
    }
    add(t) {
        t = t.slice(0).sort(((t, e) => t.pattern > e.pattern ? 1 : -1));
        const e = t.length;
        let n;
        let i;
        let s;
        let r;
        let l;
        let o;
        let u;
        let c = 0;
        let a;
        while (e > c) {
            n = this.O;
            i = t[c];
            s = i.pattern;
            r = new SegmentTypes;
            l = this.N(i, r);
            o = l.length;
            u = t => n = n.append(t, s);
            for (a = 0; o > a; ++a) {
                l[a].eachChar(u);
            }
            n.H = r;
            n._ = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const n = t.length;
        let i = this.W;
        let s = 0;
        let r;
        for (;s < n; ++s) {
            i = this.j(i, t.charAt(s), e);
            if (i.length === 0) {
                break;
            }
        }
        i = i.filter(isEndpoint);
        if (i.length > 0) {
            i.sort(sortEndpoint);
            r = i[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.C);
            }
            e.pattern = r.C;
        }
        return e;
    }
    j(t, e, n) {
        const i = [];
        let s = null;
        const r = t.length;
        let l = 0;
        for (;l < r; ++l) {
            s = t[l];
            i.push(...s.findMatches(e, n));
        }
        return i;
    }
    N(t, e) {
        const n = [];
        const i = t.pattern;
        const s = i.length;
        const r = t.symbols;
        let l = 0;
        let o = 0;
        let u = "";
        while (l < s) {
            u = i.charAt(l);
            if (r.length === 0 || !r.includes(u)) {
                if (l === o) {
                    if (u === "P" && i.slice(l, l + 4) === "PART") {
                        o = l = l + 4;
                        n.push(new DynamicSegment(r));
                        ++e.dynamics;
                    } else {
                        ++l;
                    }
                } else {
                    ++l;
                }
            } else if (l !== o) {
                n.push(new StaticSegment(i.slice(o, l)));
                ++e.statics;
                o = l;
            } else {
                n.push(new SymbolSegment(i.slice(o, l + 1)));
                ++e.symbols;
                o = ++l;
            }
        }
        if (o !== l) {
            n.push(new StaticSegment(i.slice(o, l)));
            ++e.statics;
        }
        return n;
    }
}

function isEndpoint(t) {
    return t._;
}

function sortEndpoint(t, e) {
    const n = t.H;
    const i = e.H;
    if (n.statics !== i.statics) {
        return i.statics - n.statics;
    }
    if (n.dynamics !== i.dynamics) {
        return i.dynamics - n.dynamics;
    }
    if (n.symbols !== i.symbols) {
        return i.symbols - n.symbols;
    }
    return 0;
}

class AttrSyntax {
    constructor(t, e, n, i, s = null) {
        this.rawName = t;
        this.rawValue = e;
        this.target = n;
        this.command = i;
        this.parts = s;
    }
}

const O = /*@__PURE__*/ S("IAttributePattern");

const W = /*@__PURE__*/ S("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.U = {};
        this.L = {};
        this.q = false;
        this.G = [];
        this.J = r(F);
        this.c = r(l);
    }
    registerPattern(t, e) {
        if (this.q) throw createMappedError(88);
        const n = this.L;
        for (const {pattern: i} of t) {
            if (n[i] != null) throw createMappedError(89, i);
            n[i] = {
                patternType: e
            };
        }
        this.G.push(...t);
    }
    K() {
        this.J.add(this.G);
        const t = this.c;
        for (const [, e] of Object.entries(this.L)) {
            e.pattern = t.get(e.patternType);
        }
    }
    parse(t, e) {
        if (!this.q) {
            this.K();
            this.q = true;
        }
        let n = this.U[t];
        if (n == null) {
            n = this.U[t] = this.J.interpret(t);
        }
        const i = n.pattern;
        if (i == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.L[i].pattern[i](t, e, n.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(e, n) {
        const s = N.create(t, e);
        n.metadata[i] = s;
        return e;
    };
}

const N = /*@__PURE__*/ P({
    name: n("attribute-pattern"),
    create(t, e) {
        return {
            register(n) {
                n.get(W).registerPattern(t, e);
                T(O, e).register(n);
            }
        };
    }
});

class DotSeparatedAttributePattern {
    "PART.PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], n[1]);
    }
    "PART.PART.PART"(t, e, n) {
        return new AttrSyntax(t, e, `${n[0]}.${n[1]}`, n[2]);
    }
}

D = Symbol.metadata;

DotSeparatedAttributePattern[D] = {
    [i]: /*@__PURE__*/ N.create([ {
        pattern: "PART.PART",
        symbols: "."
    }, {
        pattern: "PART.PART.PART",
        symbols: "."
    } ], DotSeparatedAttributePattern)
};

class RefAttributePattern {
    ref(t, e, n) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, n) {
        let i = n[0];
        if (i === "view-model") {
            i = "component";
        }
        return new AttrSyntax(t, e, i, "ref");
    }
}

V = Symbol.metadata;

RefAttributePattern[V] = {
    [i]: /*@__PURE__*/ N.create([ {
        pattern: "ref",
        symbols: ""
    }, {
        pattern: "PART.ref",
        symbols: "."
    } ], RefAttributePattern)
};

class EventAttributePattern {
    "PART.trigger:PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "trigger", n);
    }
    "PART.capture:PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "capture", n);
    }
}

H = Symbol.metadata;

EventAttributePattern[H] = {
    [i]: /*@__PURE__*/ N.create([ {
        pattern: "PART.trigger:PART",
        symbols: ".:"
    }, {
        pattern: "PART.capture:PART",
        symbols: ".:"
    } ], EventAttributePattern)
};

class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "bind");
    }
}

M = Symbol.metadata;

ColonPrefixedBindAttributePattern[M] = {
    [i]: /*@__PURE__*/ N.create([ {
        pattern: ":PART",
        symbols: ":"
    } ], ColonPrefixedBindAttributePattern)
};

class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "trigger");
    }
    "@PART:PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "trigger", [ n[0], "trigger", ...n.slice(1) ]);
    }
}

$ = Symbol.metadata;

AtPrefixedTriggerAttributePattern[$] = {
    [i]: /*@__PURE__*/ N.create([ {
        pattern: "@PART",
        symbols: "@"
    }, {
        pattern: "@PART:PART",
        symbols: "@:"
    } ], AtPrefixedTriggerAttributePattern)
};

const j = y.get;

y.has;

const U = y.define;

const q = "ra";

const z = "rb";

const G = "rc";

const J = "rd";

const K = "re";

const Q = "rf";

const X = "rg";

const Y = "ri";

const Z = "rj";

const tt = "rk";

const et = "rl";

const nt = "ha";

const it = "hb";

const st = "hc";

const rt = "hd";

const lt = "he";

const ot = "hf";

const ut = "hg";

const ct = "hs";

const at = "hp";

const ht = "svb";

const dt = /*@__PURE__*/ P({
    hydrateElement: q,
    hydrateAttribute: z,
    hydrateTemplateController: G,
    hydrateLetElement: J,
    setProperty: K,
    interpolation: Q,
    propertyBinding: X,
    letBinding: Y,
    refBinding: Z,
    iteratorBinding: tt,
    multiAttr: et,
    textBinding: nt,
    listenerBinding: it,
    attributeBinding: st,
    stylePropertyBinding: rt,
    setAttribute: lt,
    setClassAttribute: ot,
    setStyleAttribute: ut,
    spreadTransferedBinding: ct,
    spreadElementProp: at,
    spreadValueBinding: ht
});

const ft = /*@__PURE__*/ S("Instruction");

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Q;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, n) {
        this.from = t;
        this.to = e;
        this.mode = n;
        this.type = X;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, n) {
        this.forOf = t;
        this.to = e;
        this.props = n;
        this.type = tt;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Z;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = K;
    }
}

class MultiAttrInstruction {
    constructor(t, e, n) {
        this.value = t;
        this.to = e;
        this.command = n;
        this.type = et;
    }
}

class HydrateElementInstruction {
    constructor(t, e, n, i, s, r) {
        this.res = t;
        this.props = e;
        this.projections = n;
        this.containerless = i;
        this.captures = s;
        this.data = r;
        this.type = q;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, n) {
        this.res = t;
        this.alias = e;
        this.props = n;
        this.type = z;
    }
}

class HydrateTemplateController {
    constructor(t, e, n, i) {
        this.def = t;
        this.res = e;
        this.alias = n;
        this.props = i;
        this.type = G;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = J;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Y;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = nt;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, n, i) {
        this.from = t;
        this.to = e;
        this.capture = n;
        this.modifier = i;
        this.type = it;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = rt;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = lt;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ot;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ut;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, n) {
        this.attr = t;
        this.from = e;
        this.to = n;
        this.type = st;
    }
}

class SpreadTransferedBindingInstruction {
    constructor() {
        this.type = ct;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instruction = t;
        this.type = at;
    }
}

class SpreadValueBindingInstruction {
    constructor(t, e) {
        this.target = t;
        this.from = e;
        this.type = ht;
    }
}

function bindingCommand(t) {
    return function(e, n) {
        n.addInitializer((function() {
            gt.define(t, e);
        }));
        return e;
    };
}

class BindingCommandDefinition {
    constructor(t, e, n, i) {
        this.Type = t;
        this.name = e;
        this.aliases = n;
        this.key = i;
    }
    static create(t, e) {
        let n;
        let i;
        if (isString(t)) {
            n = t;
            i = {
                name: n
            };
        } else {
            n = t.name;
            i = t;
        }
        return new BindingCommandDefinition(e, o(getCommandAnnotation(e, "name"), n), u(getCommandAnnotation(e, "aliases"), i.aliases, e.aliases), getCommandKeyFrom(n));
    }
    register(t, e) {
        const n = this.Type;
        const i = typeof e === "string" ? getCommandKeyFrom(e) : this.key;
        const s = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(n, false) ? null : T(n, n), C(n, i), ...s.map((t => C(n, getCommandKeyFrom(t)))));
        }
    }
}

const mt = "binding-command";

const pt = /*@__PURE__*/ n(mt);

const getCommandKeyFrom = t => `${pt}:${t}`;

const getCommandAnnotation = (t, e) => j(c.annotation.keyFor(e), t);

const gt = /*@__PURE__*/ (() => {
    const t = "__au_static_resource__";
    const getDefinitionFromStaticAu = (e, n, i) => {
        let s = j(t, e);
        if (s == null) {
            if (e.$au?.type === n) {
                s = i(e.$au, e);
                U(s, e, t);
            }
        }
        return s;
    };
    return P({
        name: pt,
        keyFrom: getCommandKeyFrom,
        define(t, e) {
            const n = BindingCommandDefinition.create(t, e);
            const i = n.Type;
            U(n, i, pt, a);
            return i;
        },
        getAnnotation: getCommandAnnotation,
        find(t, e) {
            const n = t.find(mt, e);
            return n == null ? null : j(pt, n) ?? getDefinitionFromStaticAu(n, mt, BindingCommandDefinition.create) ?? null;
        },
        get(t, e) {
            return t.get(h(getCommandKeyFrom(e)));
        }
    });
})();

class OneTimeBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, n) {
        const i = t.attr;
        let s = i.target;
        let r = t.attr.rawValue;
        r = r === "" ? d(s) : r;
        if (t.bindable == null) {
            s = n.map(t.node, s) ?? d(s);
        } else {
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, x), s, 1);
    }
}

OneTimeBindingCommand.$au = {
    type: mt,
    name: "one-time"
};

class ToViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, n) {
        const i = t.attr;
        let s = i.target;
        let r = t.attr.rawValue;
        r = r === "" ? d(s) : r;
        if (t.bindable == null) {
            s = n.map(t.node, s) ?? d(s);
        } else {
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, x), s, 2);
    }
}

ToViewBindingCommand.$au = {
    type: mt,
    name: "to-view"
};

class FromViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, n) {
        const i = t.attr;
        let s = i.target;
        let r = i.rawValue;
        r = r === "" ? d(s) : r;
        if (t.bindable == null) {
            s = n.map(t.node, s) ?? d(s);
        } else {
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, x), s, 4);
    }
}

FromViewBindingCommand.$au = {
    type: mt,
    name: "from-view"
};

class TwoWayBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, n) {
        const i = t.attr;
        let s = i.target;
        let r = i.rawValue;
        r = r === "" ? d(s) : r;
        if (t.bindable == null) {
            s = n.map(t.node, s) ?? d(s);
        } else {
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, x), s, 6);
    }
}

TwoWayBindingCommand.$au = {
    type: mt,
    name: "two-way"
};

class DefaultBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, n) {
        const i = t.attr;
        const s = t.bindable;
        let r = i.rawValue;
        let l = i.target;
        let o;
        let u;
        r = r === "" ? d(l) : r;
        if (s == null) {
            u = n.isTwoWay(t.node, l) ? 6 : 2;
            l = n.map(t.node, l) ?? d(l);
        } else {
            o = t.def.defaultBindingMode ?? 0;
            u = s.mode === 0 || s.mode == null ? o == null || o === 0 ? 2 : o : s.mode;
            l = s.name;
        }
        return new PropertyBindingInstruction(e.parse(r, x), l, isString(u) ? _[u] ?? 0 : u);
    }
}

DefaultBindingCommand.$au = {
    type: mt,
    name: "bind"
};

class ForBindingCommand {
    constructor() {
        this.X = r(W);
    }
    get ignoreAttr() {
        return false;
    }
    build(t, e) {
        const n = t.bindable === null ? d(t.attr.target) : t.bindable.name;
        const i = e.parse(t.attr.rawValue, "IsIterator");
        let r = s;
        if (i.semiIdx > -1) {
            const e = t.attr.rawValue.slice(i.semiIdx + 1);
            const n = e.indexOf(":");
            if (n > -1) {
                const t = e.slice(0, n).trim();
                const i = e.slice(n + 1).trim();
                const s = this.X.parse(t, i);
                r = [ new MultiAttrInstruction(i, s.target, s.command) ];
            }
        }
        return new IteratorBindingInstruction(i, n, r);
    }
}

ForBindingCommand.$au = {
    type: mt,
    name: "for"
};

class TriggerBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, E), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
}

TriggerBindingCommand.$au = {
    type: mt,
    name: "trigger"
};

class CaptureBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, E), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
}

CaptureBindingCommand.$au = {
    type: mt,
    name: "capture"
};

class AttrBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        const n = t.attr;
        const i = n.target;
        let s = n.rawValue;
        s = s === "" ? d(i) : s;
        return new AttributeBindingInstruction(i, e.parse(s, x), i);
    }
}

AttrBindingCommand.$au = {
    type: mt,
    name: "attr"
};

class StyleBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, x), t.attr.target);
    }
}

StyleBindingCommand.$au = {
    type: mt,
    name: "style"
};

class ClassBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, x), t.attr.target);
    }
}

ClassBindingCommand.$au = {
    type: mt,
    name: "class"
};

class RefBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, x), t.attr.target);
    }
}

RefBindingCommand.$au = {
    type: mt,
    name: "ref"
};

class SpreadValueBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t) {
        return new SpreadValueBindingInstruction(t.attr.target, t.attr.rawValue);
    }
}

SpreadValueBindingCommand.$au = {
    type: mt,
    name: "spread"
};

const wt = /*@__PURE__*/ S("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const bt = {};

class TemplateElementFactory {
    constructor() {
        this.p = r(f);
        this.Y = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = bt[t];
            if (e === void 0) {
                const n = this.Y;
                n.innerHTML = t;
                const i = n.content.firstElementChild;
                if (needsWrapping(i)) {
                    this.Y = this.t();
                    e = n;
                } else {
                    n.content.removeChild(i);
                    e = i;
                }
                bt[t] = e;
            }
            return e.cloneNode(true);
        }
        if (t.nodeName !== "TEMPLATE") {
            const e = this.t();
            e.content.appendChild(t);
            return e;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
        function needsWrapping(t) {
            if (t == null) return true;
            if (t.nodeName !== "TEMPLATE") return true;
            const e = t.nextElementSibling;
            if (e != null) return true;
            const n = t.previousSibling;
            if (n != null) {
                switch (n.nodeType) {
                  case 3:
                    return n.textContent.trim().length > 0;
                }
            }
            const i = t.nextSibling;
            if (i != null) {
                switch (i.nodeType) {
                  case 3:
                    return i.textContent.trim().length > 0;
                }
            }
            return false;
        }
    }
}

const At = "au-start";

const yt = "au-end";

const insertBefore = (t, e, n) => t.insertBefore(e, n);

const insertManyBefore = (t, e, n) => {
    if (t === null) {
        return;
    }
    const i = n.length;
    let s = 0;
    while (i > s) {
        t.insertBefore(n[s], e);
        ++s;
    }
};

const appendToTemplate = (t, e) => t.content.appendChild(e);

const appendManyToTemplate = (t, e) => {
    const n = e.length;
    let i = 0;
    while (n > i) {
        t.content.appendChild(e[i]);
        ++i;
    }
};

const isElement = t => t.nodeType === 1;

const isTextNode = t => t.nodeType === 3;

const It = "au-slot";

const Bt = "default";

const St = (t => () => `anonymous-${++t}`)(0);

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    compile(t, e) {
        if (t.template == null || t.needsCompile === false) {
            return t;
        }
        const n = new CompilationContext(t, e, null, null, void 0);
        const i = isString(t.template) || !t.enhance ? n.Z.createTemplate(t.template) : t.template;
        const r = i.nodeName === Pt && i.content != null;
        const l = r ? i.content : i;
        const o = Dt.findAll(e);
        const u = o.length;
        let c = 0;
        if (u > 0) {
            while (u > c) {
                o[c].compiling?.(i);
                ++c;
            }
        }
        if (i.hasAttribute(kt)) {
            throw createMappedError(701, t);
        }
        this.tt(l, n);
        this.et(l, n);
        const a = {
            ...t,
            name: t.name || St(),
            dependencies: (t.dependencies ?? s).concat(n.deps ?? s),
            instructions: n.rows,
            surrogates: r ? this.nt(i, n) : s,
            template: i,
            hasSlots: n.hasSlot,
            needsCompile: false
        };
        return a;
    }
    compileSpread(t, e, n, i, s) {
        const r = new CompilationContext(t, n, null, null, void 0);
        const l = [];
        const o = s ?? r.it(i.nodeName.toLowerCase());
        const u = o !== null;
        const c = r.ep;
        const a = e.length;
        let h = 0;
        let f;
        let m = null;
        let p;
        let g;
        let w;
        let b;
        let A;
        let y = null;
        let I;
        let B;
        let S;
        let P;
        for (;a > h; ++h) {
            f = e[h];
            S = f.target;
            P = f.rawValue;
            if (S === "...$attrs") {
                l.push(new SpreadTransferedBindingInstruction);
                continue;
            }
            y = r.st(f);
            if (y !== null && y.ignoreAttr) {
                Tt.node = i;
                Tt.attr = f;
                Tt.bindable = null;
                Tt.def = null;
                l.push(y.build(Tt, r.ep, r.m));
                continue;
            }
            if (u) {
                w = r.rt(o);
                b = w.attrs[S];
                if (b !== void 0) {
                    if (y == null) {
                        I = c.parse(P, R);
                        l.push(new SpreadElementPropBindingInstruction(I == null ? new SetPropertyInstruction(P, b.name) : new InterpolationInstruction(I, b.name)));
                    } else {
                        Tt.node = i;
                        Tt.attr = f;
                        Tt.bindable = b;
                        Tt.def = o;
                        l.push(new SpreadElementPropBindingInstruction(y.build(Tt, r.ep, r.m)));
                    }
                    continue;
                }
            }
            m = r.lt(S);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, S);
                }
                w = r.rt(m);
                B = m.noMultiBindings === false && y === null && hasInlineBindings(P);
                if (B) {
                    g = this.ot(i, P, m, r);
                } else {
                    A = w.primary;
                    if (y === null) {
                        I = c.parse(P, R);
                        g = [ I === null ? new SetPropertyInstruction(P, A.name) : new InterpolationInstruction(I, A.name) ];
                    } else {
                        Tt.node = i;
                        Tt.attr = f;
                        Tt.bindable = A;
                        Tt.def = m;
                        g = [ y.build(Tt, r.ep, r.m) ];
                    }
                }
                (p ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(S) ? S : void 0, g));
                continue;
            }
            if (y == null) {
                I = c.parse(P, R);
                if (I != null) {
                    l.push(new InterpolationInstruction(I, r.m.map(i, S) ?? d(S)));
                } else {
                    switch (S) {
                      case "class":
                        l.push(new SetClassAttributeInstruction(P));
                        break;

                      case "style":
                        l.push(new SetStyleAttributeInstruction(P));
                        break;

                      default:
                        l.push(new SetAttributeInstruction(P, S));
                    }
                }
            } else {
                Tt.node = i;
                Tt.attr = f;
                Tt.bindable = null;
                Tt.def = null;
                l.push(y.build(Tt, r.ep, r.m));
            }
        }
        resetCommandBuildInfo();
        if (p != null) {
            return p.concat(l);
        }
        return l;
    }
    nt(t, e) {
        const n = [];
        const i = t.attributes;
        const s = e.ep;
        let r = i.length;
        let l = 0;
        let o;
        let u;
        let c;
        let a;
        let h = null;
        let f;
        let m;
        let p;
        let g;
        let w = null;
        let b;
        let A;
        let y;
        let I;
        for (;r > l; ++l) {
            o = i[l];
            u = o.name;
            c = o.value;
            a = e.X.parse(u, c);
            y = a.target;
            I = a.rawValue;
            if (Rt[y]) {
                throw createMappedError(702, u);
            }
            w = e.st(a);
            if (w !== null && w.ignoreAttr) {
                Tt.node = t;
                Tt.attr = a;
                Tt.bindable = null;
                Tt.def = null;
                n.push(w.build(Tt, e.ep, e.m));
                continue;
            }
            h = e.lt(y);
            if (h !== null) {
                if (h.isTemplateController) {
                    throw createMappedError(703, y);
                }
                p = e.rt(h);
                A = h.noMultiBindings === false && w === null && hasInlineBindings(I);
                if (A) {
                    m = this.ot(t, I, h, e);
                } else {
                    g = p.primary;
                    if (w === null) {
                        b = s.parse(I, R);
                        m = b === null ? I === "" ? [] : [ new SetPropertyInstruction(I, g.name) ] : [ new InterpolationInstruction(b, g.name) ];
                    } else {
                        Tt.node = t;
                        Tt.attr = a;
                        Tt.bindable = g;
                        Tt.def = h;
                        m = [ w.build(Tt, e.ep, e.m) ];
                    }
                }
                t.removeAttribute(u);
                --l;
                --r;
                (f ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? h : h.name, h.aliases != null && h.aliases.includes(y) ? y : void 0, m));
                continue;
            }
            if (w === null) {
                b = s.parse(I, R);
                if (b != null) {
                    t.removeAttribute(u);
                    --l;
                    --r;
                    n.push(new InterpolationInstruction(b, e.m.map(t, y) ?? d(y)));
                } else {
                    switch (u) {
                      case "class":
                        n.push(new SetClassAttributeInstruction(I));
                        break;

                      case "style":
                        n.push(new SetStyleAttributeInstruction(I));
                        break;

                      default:
                        n.push(new SetAttributeInstruction(I, u));
                    }
                }
            } else {
                Tt.node = t;
                Tt.attr = a;
                Tt.bindable = null;
                Tt.def = null;
                n.push(w.build(Tt, e.ep, e.m));
            }
        }
        resetCommandBuildInfo();
        if (f != null) {
            return f.concat(n);
        }
        return n;
    }
    et(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.ut(t, e);

              default:
                return this.ct(t, e);
            }

          case 3:
            return this.ht(t, e);

          case 11:
            {
                let n = t.firstChild;
                while (n !== null) {
                    n = this.et(n, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    ut(t, e) {
        const n = t.attributes;
        const i = n.length;
        const s = [];
        const r = e.ep;
        let l = false;
        let o = 0;
        let u;
        let c;
        let a;
        let h;
        let f;
        let m;
        let p;
        let g;
        for (;i > o; ++o) {
            u = n[o];
            a = u.name;
            h = u.value;
            if (a === "to-binding-context") {
                l = true;
                continue;
            }
            c = e.X.parse(a, h);
            m = c.target;
            p = c.rawValue;
            f = e.st(c);
            if (f !== null) {
                if (c.command === "bind") {
                    s.push(new LetBindingInstruction(r.parse(p, x), d(m)));
                } else {
                    throw createMappedError(704, c);
                }
                continue;
            }
            g = r.parse(p, R);
            s.push(new LetBindingInstruction(g === null ? new I(p) : g, d(m)));
        }
        e.rows.push([ new HydrateLetElementInstruction(s, l) ]);
        return this.dt(t, e).nextSibling;
    }
    ct(t, e) {
        const n = t.nextSibling;
        const i = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const r = e.it(i);
        const l = r !== null;
        const o = l && r.shadowOptions != null;
        const u = r?.capture;
        const c = u != null && typeof u !== "boolean";
        const a = u ? [] : s;
        const h = e.ep;
        const f = this.debug ? p : () => {
            t.removeAttribute(y);
            --b;
            --w;
        };
        let m = t.attributes;
        let g;
        let w = m.length;
        let b = 0;
        let A;
        let y;
        let I;
        let B;
        let S;
        let P;
        let C = null;
        let T = false;
        let E;
        let x;
        let _;
        let k;
        let L;
        let D;
        let V;
        let H = null;
        let M;
        let $;
        let F;
        let O;
        let W = true;
        let N = false;
        let j = false;
        let U = false;
        let q;
        let z = 0;
        if (i === "slot") {
            if (e.root.def.shadowOptions == null) {
                throw createMappedError(717, e.root.def.name);
            }
            e.root.hasSlot = true;
        }
        if (l) {
            q = {};
            W = r.processContent?.call(r.Type, t, e.p, q);
            m = t.attributes;
            w = m.length;
        }
        for (;w > b; ++b) {
            A = m[b];
            y = A.name;
            I = A.value;
            switch (y) {
              case "as-element":
              case "containerless":
                f();
                N = N || y === "containerless";
                continue;
            }
            B = e.X.parse(y, I);
            H = e.st(B);
            F = B.target;
            O = B.rawValue;
            if (u && (!c || c && u(F))) {
                if (H != null && H.ignoreAttr) {
                    f();
                    a.push(B);
                    continue;
                }
                j = F !== It && F !== "slot" && ((z = F.indexOf("...")) === -1 || z === 0 && F === "...$attrs");
                if (j) {
                    M = e.rt(r);
                    if (M.attrs[F] == null && !e.lt(F)?.isTemplateController) {
                        f();
                        a.push(B);
                        continue;
                    }
                }
            }
            if (F === "...$attrs") {
                (S ??= []).push(new SpreadTransferedBindingInstruction);
                f();
                continue;
            }
            if (H?.ignoreAttr) {
                Tt.node = t;
                Tt.attr = B;
                Tt.bindable = null;
                Tt.def = null;
                (S ??= []).push(H.build(Tt, e.ep, e.m));
                f();
                continue;
            }
            if (F.indexOf("...") === 0) {
                if (l && (F = F.slice(3)) !== "$element") {
                    (P ??= []).push(new SpreadValueBindingInstruction("$bindables", F === "$bindables" ? O : F));
                    f();
                    continue;
                }
                throw createMappedError(720, F);
            }
            if (l) {
                M = e.rt(r);
                E = M.attrs[F];
                if (E !== void 0) {
                    if (H === null) {
                        D = h.parse(O, R);
                        (P ??= []).push(D == null ? new SetPropertyInstruction(O, E.name) : new InterpolationInstruction(D, E.name));
                    } else {
                        Tt.node = t;
                        Tt.attr = B;
                        Tt.bindable = E;
                        Tt.def = r;
                        (P ??= []).push(H.build(Tt, e.ep, e.m));
                    }
                    f();
                    continue;
                }
                if (F === "$bindables") {
                    if (H != null) {
                        Tt.node = t;
                        Tt.attr = B;
                        Tt.bindable = null;
                        Tt.def = r;
                        {
                            (P ??= []).push(H.build(Tt, e.ep, e.m));
                        }
                    }
                    f();
                    continue;
                }
            }
            if (F === "$bindables") {
                throw createMappedError(721, t.nodeName, F, O);
            }
            C = e.lt(F);
            if (C !== null) {
                M = e.rt(C);
                T = C.noMultiBindings === false && H === null && hasInlineBindings(O);
                if (T) {
                    _ = this.ot(t, O, C, e);
                } else {
                    $ = M.primary;
                    if (H === null) {
                        D = h.parse(O, R);
                        _ = D === null ? O === "" ? [] : [ new SetPropertyInstruction(O, $.name) ] : [ new InterpolationInstruction(D, $.name) ];
                    } else {
                        Tt.node = t;
                        Tt.attr = B;
                        Tt.bindable = $;
                        Tt.def = C;
                        _ = [ H.build(Tt, e.ep, e.m) ];
                    }
                }
                f();
                if (C.isTemplateController) {
                    (k ??= []).push(new HydrateTemplateController(Ct, this.resolveResources ? C : C.name, void 0, _));
                } else {
                    (x ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? C : C.name, C.aliases != null && C.aliases.includes(F) ? F : void 0, _));
                }
                continue;
            }
            if (H === null) {
                D = h.parse(O, R);
                if (D != null) {
                    f();
                    (S ??= []).push(new InterpolationInstruction(D, e.m.map(t, F) ?? d(F)));
                }
                continue;
            }
            Tt.node = t;
            Tt.attr = B;
            Tt.bindable = null;
            Tt.def = null;
            (S ??= []).push(H.build(Tt, e.ep, e.m));
            f();
        }
        resetCommandBuildInfo();
        if (this.ft(t, S) && S != null && S.length > 1) {
            this.gt(t, S);
        }
        if (l) {
            V = new HydrateElementInstruction(this.resolveResources ? r : r.name, P ?? s, null, N, a, q);
        }
        if (S != null || V != null || x != null) {
            g = s.concat(V ?? s, x ?? s, S ?? s);
            U = true;
        }
        let G;
        if (k != null) {
            w = k.length - 1;
            b = w;
            L = k[b];
            let n;
            if (isMarker(t)) {
                n = e.t();
                appendManyToTemplate(n, [ e.wt(), e.bt(At), e.bt(yt) ]);
            } else {
                this.At(t, e);
                if (t.nodeName === "TEMPLATE") {
                    n = t;
                } else {
                    n = e.t();
                    appendToTemplate(n, t);
                }
            }
            const s = n;
            const u = e.yt(g == null ? [] : [ g ]);
            let c;
            let a;
            let h = false;
            let d;
            let f;
            let m;
            let p;
            let A;
            let y;
            let I = 0, B = 0;
            let S = t.firstChild;
            let P = false;
            if (W !== false) {
                while (S !== null) {
                    a = isElement(S) ? S.getAttribute(It) : null;
                    h = a !== null || l && !o;
                    c = S.nextSibling;
                    if (h) {
                        if (!l) {
                            throw createMappedError(706, a, i);
                        }
                        S.removeAttribute?.(It);
                        P = isTextNode(S) && S.textContent.trim() === "";
                        if (!P) {
                            ((f ??= {})[a || Bt] ??= []).push(S);
                        }
                        t.removeChild(S);
                    }
                    S = c;
                }
            }
            if (f != null) {
                d = {};
                for (a in f) {
                    n = e.t();
                    m = f[a];
                    for (I = 0, B = m.length; B > I; ++I) {
                        p = m[I];
                        if (p.nodeName === "TEMPLATE") {
                            if (p.attributes.length > 0) {
                                appendToTemplate(n, p);
                            } else {
                                appendToTemplate(n, p.content);
                            }
                        } else {
                            appendToTemplate(n, p);
                        }
                    }
                    y = e.yt();
                    this.et(n.content, y);
                    d[a] = {
                        name: St(),
                        type: v,
                        template: n,
                        instructions: y.rows,
                        needsCompile: false
                    };
                }
                V.projections = d;
            }
            if (U) {
                if (l && (N || r.containerless)) {
                    this.At(t, e);
                } else {
                    this.dt(t, e);
                }
            }
            G = !l || !r.containerless && !N && W !== false;
            if (G) {
                if (t.nodeName === Pt) {
                    this.et(t.content, u);
                } else {
                    S = t.firstChild;
                    while (S !== null) {
                        S = this.et(S, u);
                    }
                }
            }
            L.def = {
                name: St(),
                type: v,
                template: s,
                instructions: u.rows,
                needsCompile: false
            };
            while (b-- > 0) {
                L = k[b];
                n = e.t();
                A = e.wt();
                appendManyToTemplate(n, [ A, e.bt(At), e.bt(yt) ]);
                L.def = {
                    name: St(),
                    type: v,
                    template: n,
                    needsCompile: false,
                    instructions: [ [ k[b + 1] ] ]
                };
            }
            e.rows.push([ L ]);
        } else {
            if (g != null) {
                e.rows.push(g);
            }
            let n = t.firstChild;
            let s;
            let u;
            let c = false;
            let a = null;
            let h;
            let d;
            let f;
            let m;
            let p;
            let w = false;
            let b = 0, A = 0;
            if (W !== false) {
                while (n !== null) {
                    u = isElement(n) ? n.getAttribute(It) : null;
                    c = u !== null || l && !o;
                    s = n.nextSibling;
                    if (c) {
                        if (!l) {
                            throw createMappedError(706, u, i);
                        }
                        n.removeAttribute?.(It);
                        w = isTextNode(n) && n.textContent.trim() === "";
                        if (!w) {
                            ((h ??= {})[u || Bt] ??= []).push(n);
                        }
                        t.removeChild(n);
                    }
                    n = s;
                }
            }
            if (h != null) {
                a = {};
                for (u in h) {
                    m = e.t();
                    d = h[u];
                    for (b = 0, A = d.length; A > b; ++b) {
                        f = d[b];
                        if (f.nodeName === Pt) {
                            if (f.attributes.length > 0) {
                                appendToTemplate(m, f);
                            } else {
                                appendToTemplate(m, f.content);
                            }
                        } else {
                            appendToTemplate(m, f);
                        }
                    }
                    p = e.yt();
                    this.et(m.content, p);
                    a[u] = {
                        name: St(),
                        type: v,
                        template: m,
                        instructions: p.rows,
                        needsCompile: false
                    };
                }
                V.projections = a;
            }
            if (U) {
                if (l && (N || r.containerless)) {
                    this.At(t, e);
                } else {
                    this.dt(t, e);
                }
            }
            G = !l || !r.containerless && !N && W !== false;
            if (G && t.childNodes.length > 0) {
                n = t.firstChild;
                while (n !== null) {
                    n = this.et(n, e);
                }
            }
        }
        return n;
    }
    ht(t, e) {
        const n = t.parentNode;
        const i = e.ep.parse(t.textContent, R);
        const s = t.nextSibling;
        let r;
        let l;
        let o;
        let u;
        let c;
        if (i !== null) {
            ({parts: r, expressions: l} = i);
            if (c = r[0]) {
                insertBefore(n, e.It(c), t);
            }
            for (o = 0, u = l.length; u > o; ++o) {
                insertManyBefore(n, t, [ e.wt(), e.It(" ") ]);
                if (c = r[o + 1]) {
                    insertBefore(n, e.It(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[o]) ]);
            }
            n.removeChild(t);
        }
        return s;
    }
    ot(t, e, n, i) {
        const s = i.rt(n);
        const r = e.length;
        const l = [];
        let o = void 0;
        let u = void 0;
        let c = 0;
        let a = 0;
        let h;
        let d;
        let f;
        let m;
        for (let p = 0; p < r; ++p) {
            a = e.charCodeAt(p);
            if (a === 92) {
                ++p;
            } else if (a === 58) {
                o = e.slice(c, p);
                while (e.charCodeAt(++p) <= 32) ;
                c = p;
                for (;p < r; ++p) {
                    a = e.charCodeAt(p);
                    if (a === 92) {
                        ++p;
                    } else if (a === 59) {
                        u = e.slice(c, p);
                        break;
                    }
                }
                if (u === void 0) {
                    u = e.slice(c);
                }
                d = i.X.parse(o, u);
                f = i.st(d);
                m = s.attrs[d.target];
                if (m == null) {
                    throw createMappedError(707, d.target, n.name);
                }
                if (f === null) {
                    h = i.ep.parse(u, R);
                    l.push(h === null ? new SetPropertyInstruction(u, m.name) : new InterpolationInstruction(h, m.name));
                } else {
                    Tt.node = t;
                    Tt.attr = d;
                    Tt.bindable = m;
                    Tt.def = n;
                    l.push(f.build(Tt, i.ep, i.m));
                }
                while (p < r && e.charCodeAt(++p) <= 32) ;
                c = p;
                o = void 0;
                u = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    tt(t, e) {
        const n = e.root.def.name;
        const i = t;
        const r = g(i.querySelectorAll("template[as-custom-element]"));
        const l = r.length;
        if (l === 0) {
            return;
        }
        if (l === i.childElementCount) {
            throw createMappedError(708, n);
        }
        const o = new Set;
        const u = [];
        for (const t of r) {
            if (t.parentNode !== i) {
                throw createMappedError(709, n);
            }
            const e = processTemplateName(n, t, o);
            const s = t.content;
            const r = g(s.querySelectorAll("bindable"));
            const l = new Set;
            const c = new Set;
            const a = r.reduce(((t, n) => {
                if (n.parentNode !== s) {
                    throw createMappedError(710, e);
                }
                const i = n.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, n, e);
                }
                const r = n.getAttribute("attribute");
                if (r !== null && c.has(r) || l.has(i)) {
                    throw createMappedError(712, l, r);
                } else {
                    if (r !== null) {
                        c.add(r);
                    }
                    l.add(i);
                }
                const o = g(n.attributes).filter((t => !_t.includes(t.name)));
                if (o.length > 0) ;
                n.remove();
                t[i] = {
                    name: i,
                    attribute: r ?? void 0,
                    mode: n.getAttribute("mode") ?? "default"
                };
                return t;
            }), {});
            class LocalDepType {}
            LocalDepType.$au = {
                type: v,
                name: e,
                template: t,
                bindables: a
            };
            Reflect.defineProperty(LocalDepType, "name", {
                value: w(e)
            });
            u.push(LocalDepType);
            i.removeChild(t);
        }
        const c = (e.root.def.dependencies ?? []).concat(e.root.def.Type == null ? s : [ e.root.def.Type ]);
        for (const t of u) {
            t.dependencies = c.concat(u.filter((e => e !== t)));
            e.Bt(t);
        }
    }
    ft(t, e) {
        const n = t.nodeName;
        return n === "INPUT" && Et[t.type] === 1 || n === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === X && t.to === "multiple")));
    }
    gt(t, e) {
        switch (t.nodeName) {
          case "INPUT":
            {
                const t = e;
                let n = void 0;
                let i = void 0;
                let s = 0;
                let r;
                for (let e = 0; e < t.length && s < 3; e++) {
                    r = t[e];
                    switch (r.to) {
                      case "model":
                      case "value":
                      case "matcher":
                        n = e;
                        s++;
                        break;

                      case "checked":
                        i = e;
                        s++;
                        break;
                    }
                }
                if (i !== void 0 && n !== void 0 && i < n) {
                    [t[n], t[i]] = [ t[i], t[n] ];
                }
                break;
            }

          case "SELECT":
            {
                const t = e;
                let n = 0;
                let i = 0;
                let s = 0;
                let r;
                for (let e = 0; e < t.length && s < 2; ++e) {
                    r = t[e];
                    switch (r.to) {
                      case "multiple":
                        i = e;
                        s++;
                        break;

                      case "value":
                        n = e;
                        s++;
                        break;
                    }
                    if (s === 2 && n < i) {
                        [t[i], t[n]] = [ t[n], t[i] ];
                    }
                }
            }
        }
    }
    dt(t, e) {
        insertBefore(t.parentNode, e.bt("au*"), t);
        return t;
    }
    At(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const n = t.parentNode;
        const i = e.wt();
        insertManyBefore(n, t, [ i, e.bt(At), e.bt(yt) ]);
        n.removeChild(t);
        return i;
    }
}

TemplateCompiler.register = m(k);

const Pt = "TEMPLATE";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(t, e, n, i, s) {
        this.hasSlot = false;
        this.deps = null;
        const r = n !== null;
        this.c = e;
        this.root = i === null ? this : i;
        this.def = t;
        this.parent = n;
        this.St = r ? n.St : e.get(xt);
        this.Pt = r ? n.Pt : e.get(vt);
        this.Z = r ? n.Z : e.get(wt);
        this.X = r ? n.X : e.get(W);
        this.ep = r ? n.ep : e.get(B);
        this.m = r ? n.m : e.get(L);
        this.Ct = r ? n.Ct : e.get(b);
        if (typeof (this.p = r ? n.p : e.get(f)).document?.nodeType !== "number") {
            throw createMappedError(722);
        }
        this.localEls = r ? n.localEls : new Set;
        this.rows = s ?? [];
    }
    Bt(t) {
        (this.root.deps ??= []).push(t);
        this.root.c.register(t);
        return this;
    }
    It(t) {
        return this.p.document.createTextNode(t);
    }
    bt(t) {
        return this.p.document.createComment(t);
    }
    wt() {
        return this.bt("au*");
    }
    h(t) {
        const e = this.p.document.createElement(t);
        if (t === "template") {
            this.p.document.adoptNode(e.content);
        }
        return e;
    }
    t() {
        return this.h("template");
    }
    it(t) {
        return this.St.el(this.c, t);
    }
    lt(t) {
        return this.St.attr(this.c, t);
    }
    rt(t) {
        return this.St.bindables(t);
    }
    yt(t) {
        return new CompilationContext(this.def, this.c, this, this.root, t);
    }
    st(t) {
        const e = t.command;
        if (e === null) {
            return null;
        }
        return this.Pt.get(this.c, e);
    }
}

const hasInlineBindings = t => {
    const e = t.length;
    let n = 0;
    let i = 0;
    while (e > i) {
        n = t.charCodeAt(i);
        if (n === 92) {
            ++i;
        } else if (n === 58) {
            return true;
        } else if (n === 36 && t.charCodeAt(i + 1) === 123) {
            return false;
        }
        ++i;
    }
    return false;
};

const resetCommandBuildInfo = () => {
    Tt.node = Tt.attr = Tt.bindable = Tt.def = null;
};

const Ct = {
    name: "unnamed",
    type: v
};

const Tt = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Rt = {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
};

const Et = {
    checkbox: 1,
    radio: 1
};

const xt = /*@__PURE__*/ S("IResourceResolver");

const vt = /*@__PURE__*/ S("IBindingCommandResolver", (t => {
    class DefaultBindingCommandResolver {
        constructor() {
            this.U = new WeakMap;
        }
        get(t, e) {
            let n = this.U.get(t);
            if (!n) {
                this.U.set(t, n = {});
            }
            return e in n ? n[e] : n[e] = gt.get(t, e);
        }
    }
    return t.singleton(DefaultBindingCommandResolver);
}));

const _t = P([ "name", "attribute", "mode" ]);

const kt = "as-custom-element";

const processTemplateName = (t, e, n) => {
    const i = e.getAttribute(kt);
    if (i === null || i === "") {
        throw createMappedError(715, t);
    }
    if (n.has(i)) {
        throw createMappedError(716, i, t);
    } else {
        n.add(i);
        e.removeAttribute(kt);
    }
    return i;
};

const Lt = /*@__PURE__*/ S("ITemplateCompilerHooks");

const Dt = P({
    name: /*@__PURE__*/ n("compiler-hooks"),
    define(t) {
        return {
            register(e) {
                T(Lt, t).register(e);
            }
        };
    },
    findAll(t) {
        return t.get(A(Lt));
    }
});

const templateCompilerHooks = (t, e) => {
    return t === void 0 ? decorator : decorator(t, e);
    function decorator(t, e) {
        e.metadata[i] = Dt.define(t);
        return t;
    }
};

export { AtPrefixedTriggerAttributePattern, AttrBindingCommand, AttrSyntax, AttributeBindingInstruction, AttributeParser, N as AttributePattern, gt as BindingCommand, BindingCommandDefinition, _ as BindingMode, CaptureBindingCommand, ClassBindingCommand, ColonPrefixedBindAttributePattern, DefaultBindingCommand, DotSeparatedAttributePattern, EventAttributePattern, ForBindingCommand, FromViewBindingCommand, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, L as IAttrMapper, W as IAttributeParser, O as IAttributePattern, vt as IBindingCommandResolver, ft as IInstruction, xt as IResourceResolver, F as ISyntaxInterpreter, k as ITemplateCompiler, Lt as ITemplateCompilerHooks, wt as ITemplateElementFactory, dt as InstructionType, InterpolationInstruction, Interpretation, IteratorBindingInstruction, LetBindingInstruction, ListenerBindingInstruction, MultiAttrInstruction, OneTimeBindingCommand, PropertyBindingInstruction, RefAttributePattern, RefBindingCommand, RefBindingInstruction, SetAttributeInstruction, SetClassAttributeInstruction, SetPropertyInstruction, SetStyleAttributeInstruction, SpreadElementPropBindingInstruction, SpreadTransferedBindingInstruction, SpreadValueBindingCommand, SpreadValueBindingInstruction, StyleBindingCommand, StylePropertyBindingInstruction, SyntaxInterpreter, TemplateCompiler, Dt as TemplateCompilerHooks, TextBindingInstruction, ToViewBindingCommand, TriggerBindingCommand, TwoWayBindingCommand, attributePattern, bindingCommand, St as generateElementName, templateCompilerHooks };

