"use strict";

var t = require("@aurelia/kernel");

var e = require("@aurelia/metadata");

var n = require("@aurelia/expression-parser");

const isString = t => typeof t === "string";

const s = t.DI.createInterface;

const i = Object.freeze;

const {aliasTo: r, singleton: l} = t.Registration;

const o = "Interpolation";

const u = "IsFunction";

const c = "IsProperty";

const a = "custom-element";

const h = /*@__PURE__*/ i({
    default: 0,
    oneTime: 1,
    toView: 2,
    fromView: 4,
    twoWay: 6
});

const d = /*@__PURE__*/ s("ITemplateCompiler");

const f = /*@__PURE__*/ s("IAttrMapper");

class CharSpec {
    constructor(t, e, n, s) {
        this.chars = t;
        this.repeat = e;
        this.isSymbol = n;
        this.isInverted = s;
        if (s) {
            switch (t.length) {
              case 0:
                this.has = this.i;
                break;

              case 1:
                this.has = this.u;
                break;

              default:
                this.has = this.I;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.A;
                break;

              case 1:
                this.has = this.B;
                break;

              default:
                this.has = this.C;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    C(t) {
        return this.chars.includes(t);
    }
    B(t) {
        return this.chars === t;
    }
    A(t) {
        return false;
    }
    I(t) {
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
        this.parts = t.emptyArray;
        this.T = "";
        this.P = {};
        this.R = {};
    }
    get pattern() {
        const t = this.T;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(e) {
        if (e == null) {
            this.T = "";
            this.parts = t.emptyArray;
        } else {
            this.T = e;
            this.parts = this.R[e];
        }
    }
    append(t, e) {
        const n = this.P;
        if (n[t] === undefined) {
            n[t] = e;
        } else {
            n[t] += e;
        }
    }
    next(t) {
        const e = this.P;
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
    get T() {
        return this._ ? this.L[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.M = [];
        this.V = null;
        this._ = false;
        this.L = e;
    }
    findChild(t) {
        const e = this.M;
        const n = e.length;
        let s = null;
        let i = 0;
        for (;i < n; ++i) {
            s = e[i];
            if (t.equals(s.charSpec)) {
                return s;
            }
        }
        return null;
    }
    append(t, e) {
        const n = this.L;
        if (!n.includes(e)) {
            n.push(e);
        }
        let s = this.findChild(t);
        if (s == null) {
            s = new AttrParsingState(t, e);
            this.M.push(s);
            if (t.repeat) {
                s.M.push(s);
            }
        }
        return s;
    }
    findMatches(t, e) {
        const n = [];
        const s = this.M;
        const i = s.length;
        let r = 0;
        let l = null;
        let o = 0;
        let u = 0;
        for (;o < i; ++o) {
            l = s[o];
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
        const e = this.H = t.length;
        const n = this.$ = [];
        let s = 0;
        for (;e > s; ++s) {
            n.push(new CharSpec(t[s], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.H;
        const n = this.$;
        let s = 0;
        for (;e > s; ++s) {
            t(n[s]);
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

const p = /*@__PURE__*/ s("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.O = new AttrParsingState(null);
        this.W = [ this.O ];
    }
    add(t) {
        t = t.slice(0).sort(((t, e) => t.pattern > e.pattern ? 1 : -1));
        const e = t.length;
        let n;
        let s;
        let i;
        let r;
        let l;
        let o;
        let u;
        let c = 0;
        let a;
        while (e > c) {
            n = this.O;
            s = t[c];
            i = s.pattern;
            r = new SegmentTypes;
            l = this.N(s, r);
            o = l.length;
            u = t => n = n.append(t, i);
            for (a = 0; o > a; ++a) {
                l[a].eachChar(u);
            }
            n.V = r;
            n._ = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const n = t.length;
        let s = this.W;
        let i = 0;
        let r;
        for (;i < n; ++i) {
            s = this.q(s, t.charAt(i), e);
            if (s.length === 0) {
                break;
            }
        }
        s = s.filter(isEndpoint);
        if (s.length > 0) {
            s.sort(sortEndpoint);
            r = s[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.T);
            }
            e.pattern = r.T;
        }
        return e;
    }
    q(t, e, n) {
        const s = [];
        let i = null;
        const r = t.length;
        let l = 0;
        for (;l < r; ++l) {
            i = t[l];
            s.push(...i.findMatches(e, n));
        }
        return s;
    }
    N(t, e) {
        const n = [];
        const s = t.pattern;
        const i = s.length;
        const r = t.symbols;
        let l = 0;
        let o = 0;
        let u = "";
        while (l < i) {
            u = s.charAt(l);
            if (r.length === 0 || !r.includes(u)) {
                if (l === o) {
                    if (u === "P" && s.slice(l, l + 4) === "PART") {
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
                n.push(new StaticSegment(s.slice(o, l)));
                ++e.statics;
                o = l;
            } else {
                n.push(new SymbolSegment(s.slice(o, l + 1)));
                ++e.symbols;
                o = ++l;
            }
        }
        if (o !== l) {
            n.push(new StaticSegment(s.slice(o, l)));
            ++e.statics;
        }
        return n;
    }
}

function isEndpoint(t) {
    return t._;
}

function sortEndpoint(t, e) {
    const n = t.V;
    const s = e.V;
    if (n.statics !== s.statics) {
        return s.statics - n.statics;
    }
    if (n.dynamics !== s.dynamics) {
        return s.dynamics - n.dynamics;
    }
    if (n.symbols !== s.symbols) {
        return s.symbols - n.symbols;
    }
    return 0;
}

class AttrSyntax {
    constructor(t, e, n, s, i = null) {
        this.rawName = t;
        this.rawValue = e;
        this.target = n;
        this.command = s;
        this.parts = i;
    }
}

const m = /*@__PURE__*/ s("IAttributePattern");

const g = /*@__PURE__*/ s("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.U = {};
        const e = this.j = t.resolve(p);
        const n = I.findAll(t.resolve(t.IContainer));
        const s = this.L = {};
        const i = n.reduce(((t, e) => {
            const n = getAllPatternDefinitions(e.constructor);
            n.forEach((t => s[t.pattern] = e));
            return t.concat(n);
        }), t.emptyArray);
        e.add(i);
    }
    parse(t, e) {
        let n = this.U[t];
        if (n == null) {
            n = this.U[t] = this.j.interpret(t);
        }
        const s = n.pattern;
        if (s == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.L[s][s](t, e, n.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(e) {
        return I.define(t, e);
    };
}

const getAllPatternDefinitions = e => w.get(e) ?? t.emptyArray;

const w = new WeakMap;

const I = /*@__PURE__*/ i({
    name: t.getResourceKeyFor("attribute-pattern"),
    define(e, n) {
        w.set(n, e);
        return t.Registrable.define(n, (t => {
            l(m, n).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(m)
});

const y = /*@__PURE__*/ I.define([ {
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
} ], class DotSeparatedAttributePattern {
    "PART.PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], n[1]);
    }
    "PART.PART.PART"(t, e, n) {
        return new AttrSyntax(t, e, `${n[0]}.${n[1]}`, n[2]);
    }
});

const A = /*@__PURE__*/ I.define([ {
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
} ], class RefAttributePattern {
    ref(t, e, n) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, n) {
        let s = n[0];
        if (s === "view-model") {
            s = "component";
        }
        return new AttrSyntax(t, e, s, "ref");
    }
});

const b = /*@__PURE__*/ I.define([ {
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
} ], class EventAttributePattern {
    "PART.trigger:PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "trigger", n);
    }
    "PART.capture:PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "capture", n);
    }
});

const B = /*@__PURE__*/ I.define([ {
    pattern: ":PART",
    symbols: ":"
} ], class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "bind");
    }
});

const x = /*@__PURE__*/ I.define([ {
    pattern: "@PART",
    symbols: "@"
}, {
    pattern: "@PART:PART",
    symbols: "@:"
} ], class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "trigger");
    }
    "@PART:PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "trigger", [ n[0], "trigger", ...n.slice(1) ]);
    }
});

const S = e.Metadata.get;

e.Metadata.has;

const C = e.Metadata.define;

const T = "ra";

const P = "rb";

const R = "rc";

const E = "rd";

const v = "re";

const _ = "rf";

const k = "rg";

const L = "ri";

const D = "rj";

const M = "rk";

const V = "rl";

const H = "ha";

const $ = "hb";

const F = "hc";

const O = "hd";

const W = "he";

const N = "hf";

const q = "hg";

const U = "hs";

const j = "hp";

const z = "svb";

const G = /*@__PURE__*/ i({
    hydrateElement: T,
    hydrateAttribute: P,
    hydrateTemplateController: R,
    hydrateLetElement: E,
    setProperty: v,
    interpolation: _,
    propertyBinding: k,
    letBinding: L,
    refBinding: D,
    iteratorBinding: M,
    multiAttr: V,
    textBinding: H,
    listenerBinding: $,
    attributeBinding: F,
    stylePropertyBinding: O,
    setAttribute: W,
    setClassAttribute: N,
    setStyleAttribute: q,
    spreadTransferedBinding: U,
    spreadElementProp: j,
    spreadValueBinding: z
});

const J = /*@__PURE__*/ s("Instruction");

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = _;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, n) {
        this.from = t;
        this.to = e;
        this.mode = n;
        this.type = k;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, n) {
        this.forOf = t;
        this.to = e;
        this.props = n;
        this.type = M;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = D;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = v;
    }
}

class MultiAttrInstruction {
    constructor(t, e, n) {
        this.value = t;
        this.to = e;
        this.command = n;
        this.type = V;
    }
}

class HydrateElementInstruction {
    constructor(t, e, n, s, i, r) {
        this.res = t;
        this.props = e;
        this.projections = n;
        this.containerless = s;
        this.captures = i;
        this.data = r;
        this.type = T;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, n) {
        this.res = t;
        this.alias = e;
        this.props = n;
        this.type = P;
    }
}

class HydrateTemplateController {
    constructor(t, e, n, s) {
        this.def = t;
        this.res = e;
        this.alias = n;
        this.props = s;
        this.type = R;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = E;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = L;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = H;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, n, s) {
        this.from = t;
        this.to = e;
        this.capture = n;
        this.modifier = s;
        this.type = $;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = O;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = W;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = N;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = q;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, n) {
        this.attr = t;
        this.from = e;
        this.to = n;
        this.type = F;
    }
}

class SpreadTransferedBindingInstruction {
    constructor() {
        this.type = U;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instruction = t;
        this.type = j;
    }
}

class SpreadValueBindingInstruction {
    constructor(t, e) {
        this.target = t;
        this.from = e;
        this.type = z;
    }
}

const createMappedError = (t, ...e) => new Error(`AUR${String(t).padStart(4, "0")}:${e.map(String)}`);

function bindingCommand(t) {
    return function(e, n) {
        n.addInitializer((function() {
            X.define(t, e);
        }));
        return e;
    };
}

class BindingCommandDefinition {
    constructor(t, e, n, s) {
        this.Type = t;
        this.name = e;
        this.aliases = n;
        this.key = s;
    }
    static create(e, n) {
        let s;
        let i;
        if (isString(e)) {
            s = e;
            i = {
                name: s
            };
        } else {
            s = e.name;
            i = e;
        }
        return new BindingCommandDefinition(n, t.firstDefined(getCommandAnnotation(n, "name"), s), t.mergeArrays(getCommandAnnotation(n, "aliases"), i.aliases, n.aliases), getCommandKeyFrom(s));
    }
    register(t, e) {
        const n = this.Type;
        const s = typeof e === "string" ? getCommandKeyFrom(e) : this.key;
        const i = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(n, false) ? null : l(n, n), r(n, s), ...i.map((t => r(n, getCommandKeyFrom(t)))));
        }
    }
}

const K = "binding-command";

const Q = /*@__PURE__*/ t.getResourceKeyFor(K);

const getCommandKeyFrom = t => `${Q}:${t}`;

const getCommandAnnotation = (e, n) => S(t.Protocol.annotation.keyFor(n), e);

const X = /*@__PURE__*/ (() => {
    const e = "__au_static_resource__";
    const getDefinitionFromStaticAu = (t, n, s) => {
        let i = S(e, t);
        if (i == null) {
            if (t.$au?.type === n) {
                i = s(t.$au, t);
                C(i, t, e);
            }
        }
        return i;
    };
    return i({
        name: Q,
        keyFrom: getCommandKeyFrom,
        define(e, n) {
            const s = BindingCommandDefinition.create(e, n);
            const i = s.Type;
            C(s, i, Q, t.resourceBaseName);
            return i;
        },
        getAnnotation: getCommandAnnotation,
        find(t, e) {
            const n = t.find(K, e);
            return n == null ? null : S(Q, n) ?? getDefinitionFromStaticAu(n, K, BindingCommandDefinition.create) ?? null;
        },
        get(e, n) {
            return e.get(t.resource(getCommandKeyFrom(n)));
        }
    });
})();

class OneTimeBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(e, n, s) {
        const i = e.attr;
        let r = i.target;
        let l = e.attr.rawValue;
        l = l === "" ? t.camelCase(r) : l;
        if (e.bindable == null) {
            r = s.map(e.node, r) ?? t.camelCase(r);
        } else {
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(l, c), r, 1);
    }
}

OneTimeBindingCommand.$au = {
    type: K,
    name: "one-time"
};

class ToViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(e, n, s) {
        const i = e.attr;
        let r = i.target;
        let l = e.attr.rawValue;
        l = l === "" ? t.camelCase(r) : l;
        if (e.bindable == null) {
            r = s.map(e.node, r) ?? t.camelCase(r);
        } else {
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(l, c), r, 2);
    }
}

ToViewBindingCommand.$au = {
    type: K,
    name: "to-view"
};

class FromViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(e, n, s) {
        const i = e.attr;
        let r = i.target;
        let l = i.rawValue;
        l = l === "" ? t.camelCase(r) : l;
        if (e.bindable == null) {
            r = s.map(e.node, r) ?? t.camelCase(r);
        } else {
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(l, c), r, 4);
    }
}

FromViewBindingCommand.$au = {
    type: K,
    name: "from-view"
};

class TwoWayBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(e, n, s) {
        const i = e.attr;
        let r = i.target;
        let l = i.rawValue;
        l = l === "" ? t.camelCase(r) : l;
        if (e.bindable == null) {
            r = s.map(e.node, r) ?? t.camelCase(r);
        } else {
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(l, c), r, 6);
    }
}

TwoWayBindingCommand.$au = {
    type: K,
    name: "two-way"
};

class DefaultBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(e, n, s) {
        const i = e.attr;
        const r = e.bindable;
        let l = i.rawValue;
        let o = i.target;
        let u;
        let a;
        l = l === "" ? t.camelCase(o) : l;
        if (r == null) {
            a = s.isTwoWay(e.node, o) ? 6 : 2;
            o = s.map(e.node, o) ?? t.camelCase(o);
        } else {
            u = e.def.defaultBindingMode ?? 0;
            a = r.mode === 0 || r.mode == null ? u == null || u === 0 ? 2 : u : r.mode;
            o = r.name;
        }
        return new PropertyBindingInstruction(n.parse(l, c), o, isString(a) ? h[a] ?? 0 : a);
    }
}

DefaultBindingCommand.$au = {
    type: K,
    name: "bind"
};

class ForBindingCommand {
    constructor() {
        this.G = t.resolve(g);
    }
    get ignoreAttr() {
        return false;
    }
    build(e, n) {
        const s = e.bindable === null ? t.camelCase(e.attr.target) : e.bindable.name;
        const i = n.parse(e.attr.rawValue, "IsIterator");
        let r = t.emptyArray;
        if (i.semiIdx > -1) {
            const t = e.attr.rawValue.slice(i.semiIdx + 1);
            const n = t.indexOf(":");
            if (n > -1) {
                const e = t.slice(0, n).trim();
                const s = t.slice(n + 1).trim();
                const i = this.G.parse(e, s);
                r = [ new MultiAttrInstruction(s, i.target, i.command) ];
            }
        }
        return new IteratorBindingInstruction(i, s, r);
    }
}

ForBindingCommand.$au = {
    type: K,
    name: "for"
};

class TriggerBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, u), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
}

TriggerBindingCommand.$au = {
    type: K,
    name: "trigger"
};

class CaptureBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, u), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
}

CaptureBindingCommand.$au = {
    type: K,
    name: "capture"
};

class AttrBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(e, n) {
        const s = e.attr;
        const i = s.target;
        let r = s.rawValue;
        r = r === "" ? t.camelCase(i) : r;
        return new AttributeBindingInstruction(i, n.parse(r, c), i);
    }
}

AttrBindingCommand.$au = {
    type: K,
    name: "attr"
};

class StyleBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, c), t.attr.target);
    }
}

StyleBindingCommand.$au = {
    type: K,
    name: "style"
};

class ClassBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, c), t.attr.target);
    }
}

ClassBindingCommand.$au = {
    type: K,
    name: "class"
};

class RefBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, c), t.attr.target);
    }
}

RefBindingCommand.$au = {
    type: K,
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
    type: K,
    name: "spread"
};

const Y = /*@__PURE__*/ s("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Z = {};

class TemplateElementFactory {
    constructor() {
        this.p = t.resolve(t.IPlatform);
        this.J = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Z[t];
            if (e === void 0) {
                const n = this.J;
                n.innerHTML = t;
                const s = n.content.firstElementChild;
                if (needsWrapping(s)) {
                    this.J = this.t();
                    e = n;
                } else {
                    n.content.removeChild(s);
                    e = s;
                }
                Z[t] = e;
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
            const s = t.nextSibling;
            if (s != null) {
                switch (s.nodeType) {
                  case 3:
                    return s.textContent.trim().length > 0;
                }
            }
            return false;
        }
    }
}

const tt = "au-start";

const et = "au-end";

const insertBefore = (t, e, n) => t.insertBefore(e, n);

const insertManyBefore = (t, e, n) => {
    if (t === null) {
        return;
    }
    const s = n.length;
    let i = 0;
    while (s > i) {
        t.insertBefore(n[i], e);
        ++i;
    }
};

const appendToTemplate = (t, e) => t.content.appendChild(e);

const appendManyToTemplate = (t, e) => {
    const n = e.length;
    let s = 0;
    while (n > s) {
        t.content.appendChild(e[s]);
        ++s;
    }
};

const isElement = t => t.nodeType === 1;

const isTextNode = t => t.nodeType === 3;

const nt = "au-slot";

const st = "default";

const it = (t => () => `anonymous-${++t}`)(0);

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    compile(e, n) {
        if (e.template == null || e.needsCompile === false) {
            return e;
        }
        const s = new CompilationContext(e, n, null, null, void 0);
        const i = isString(e.template) || !e.enhance ? s.K.createTemplate(e.template) : e.template;
        const r = i.nodeName === rt && i.content != null;
        const l = r ? i.content : i;
        const o = mt.findAll(n);
        const u = o.length;
        let c = 0;
        if (u > 0) {
            while (u > c) {
                o[c].compiling?.(i);
                ++c;
            }
        }
        if (i.hasAttribute(ft)) {
            throw createMappedError(701, e);
        }
        this.X(l, s);
        this.Y(l, s);
        const a = {
            ...e,
            name: e.name || it(),
            dependencies: (e.dependencies ?? t.emptyArray).concat(s.deps ?? t.emptyArray),
            instructions: s.rows,
            surrogates: r ? this.Z(i, s) : t.emptyArray,
            template: i,
            hasSlots: s.hasSlot,
            needsCompile: false
        };
        return a;
    }
    compileSpread(e, n, s, i, r) {
        const l = new CompilationContext(e, s, null, null, void 0);
        const u = [];
        const c = r ?? l.tt(i.nodeName.toLowerCase());
        const a = c !== null;
        const h = l.ep;
        const d = n.length;
        let f = 0;
        let p;
        let m = null;
        let g;
        let w;
        let I;
        let y;
        let A;
        let b = null;
        let B;
        let x;
        let S;
        let C;
        for (;d > f; ++f) {
            p = n[f];
            S = p.target;
            C = p.rawValue;
            if (S === "...$attrs") {
                u.push(new SpreadTransferedBindingInstruction);
                continue;
            }
            b = l.et(p);
            if (b !== null && b.ignoreAttr) {
                ot.node = i;
                ot.attr = p;
                ot.bindable = null;
                ot.def = null;
                u.push(b.build(ot, l.ep, l.m));
                continue;
            }
            if (a) {
                I = l.nt(c);
                y = I.attrs[S];
                if (y !== void 0) {
                    if (b == null) {
                        B = h.parse(C, o);
                        u.push(new SpreadElementPropBindingInstruction(B == null ? new SetPropertyInstruction(C, y.name) : new InterpolationInstruction(B, y.name)));
                    } else {
                        ot.node = i;
                        ot.attr = p;
                        ot.bindable = y;
                        ot.def = c;
                        u.push(new SpreadElementPropBindingInstruction(b.build(ot, l.ep, l.m)));
                    }
                    continue;
                }
            }
            m = l.st(S);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, S);
                }
                I = l.nt(m);
                x = m.noMultiBindings === false && b === null && hasInlineBindings(C);
                if (x) {
                    w = this.it(i, C, m, l);
                } else {
                    A = I.primary;
                    if (b === null) {
                        B = h.parse(C, o);
                        w = [ B === null ? new SetPropertyInstruction(C, A.name) : new InterpolationInstruction(B, A.name) ];
                    } else {
                        ot.node = i;
                        ot.attr = p;
                        ot.bindable = A;
                        ot.def = m;
                        w = [ b.build(ot, l.ep, l.m) ];
                    }
                }
                (g ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(S) ? S : void 0, w));
                continue;
            }
            if (b == null) {
                B = h.parse(C, o);
                if (B != null) {
                    u.push(new InterpolationInstruction(B, l.m.map(i, S) ?? t.camelCase(S)));
                } else {
                    switch (S) {
                      case "class":
                        u.push(new SetClassAttributeInstruction(C));
                        break;

                      case "style":
                        u.push(new SetStyleAttributeInstruction(C));
                        break;

                      default:
                        u.push(new SetAttributeInstruction(C, S));
                    }
                }
            } else {
                ot.node = i;
                ot.attr = p;
                ot.bindable = null;
                ot.def = null;
                u.push(b.build(ot, l.ep, l.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(u);
        }
        return u;
    }
    Z(e, n) {
        const s = [];
        const i = e.attributes;
        const r = n.ep;
        let l = i.length;
        let u = 0;
        let c;
        let a;
        let h;
        let d;
        let f = null;
        let p;
        let m;
        let g;
        let w;
        let I = null;
        let y;
        let A;
        let b;
        let B;
        for (;l > u; ++u) {
            c = i[u];
            a = c.name;
            h = c.value;
            d = n.G.parse(a, h);
            b = d.target;
            B = d.rawValue;
            if (ut[b]) {
                throw createMappedError(702, a);
            }
            I = n.et(d);
            if (I !== null && I.ignoreAttr) {
                ot.node = e;
                ot.attr = d;
                ot.bindable = null;
                ot.def = null;
                s.push(I.build(ot, n.ep, n.m));
                continue;
            }
            f = n.st(b);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createMappedError(703, b);
                }
                g = n.nt(f);
                A = f.noMultiBindings === false && I === null && hasInlineBindings(B);
                if (A) {
                    m = this.it(e, B, f, n);
                } else {
                    w = g.primary;
                    if (I === null) {
                        y = r.parse(B, o);
                        m = y === null ? B === "" ? [] : [ new SetPropertyInstruction(B, w.name) ] : [ new InterpolationInstruction(y, w.name) ];
                    } else {
                        ot.node = e;
                        ot.attr = d;
                        ot.bindable = w;
                        ot.def = f;
                        m = [ I.build(ot, n.ep, n.m) ];
                    }
                }
                e.removeAttribute(a);
                --u;
                --l;
                (p ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, f.aliases != null && f.aliases.includes(b) ? b : void 0, m));
                continue;
            }
            if (I === null) {
                y = r.parse(B, o);
                if (y != null) {
                    e.removeAttribute(a);
                    --u;
                    --l;
                    s.push(new InterpolationInstruction(y, n.m.map(e, b) ?? t.camelCase(b)));
                } else {
                    switch (a) {
                      case "class":
                        s.push(new SetClassAttributeInstruction(B));
                        break;

                      case "style":
                        s.push(new SetStyleAttributeInstruction(B));
                        break;

                      default:
                        s.push(new SetAttributeInstruction(B, a));
                    }
                }
            } else {
                ot.node = e;
                ot.attr = d;
                ot.bindable = null;
                ot.def = null;
                s.push(I.build(ot, n.ep, n.m));
            }
        }
        resetCommandBuildInfo();
        if (p != null) {
            return p.concat(s);
        }
        return s;
    }
    Y(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.rt(t, e);

              default:
                return this.lt(t, e);
            }

          case 3:
            return this.ot(t, e);

          case 11:
            {
                let n = t.firstChild;
                while (n !== null) {
                    n = this.Y(n, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    rt(e, s) {
        const i = e.attributes;
        const r = i.length;
        const l = [];
        const u = s.ep;
        let a = false;
        let h = 0;
        let d;
        let f;
        let p;
        let m;
        let g;
        let w;
        let I;
        let y;
        for (;r > h; ++h) {
            d = i[h];
            p = d.name;
            m = d.value;
            if (p === "to-binding-context") {
                a = true;
                continue;
            }
            f = s.G.parse(p, m);
            w = f.target;
            I = f.rawValue;
            g = s.et(f);
            if (g !== null) {
                if (f.command === "bind") {
                    l.push(new LetBindingInstruction(u.parse(I, c), t.camelCase(w)));
                } else {
                    throw createMappedError(704, f);
                }
                continue;
            }
            y = u.parse(I, o);
            l.push(new LetBindingInstruction(y === null ? new n.PrimitiveLiteralExpression(I) : y, t.camelCase(w)));
        }
        s.rows.push([ new HydrateLetElementInstruction(l, a) ]);
        return this.ut(e, s).nextSibling;
    }
    lt(e, n) {
        const s = e.nextSibling;
        const i = (e.getAttribute("as-element") ?? e.nodeName).toLowerCase();
        const r = n.tt(i);
        const l = r !== null;
        const u = l && r.shadowOptions != null;
        const c = r?.capture;
        const h = c != null && typeof c !== "boolean";
        const d = c ? [] : t.emptyArray;
        const f = n.ep;
        const p = this.debug ? t.noop : () => {
            e.removeAttribute(A);
            --I;
            --w;
        };
        let m = e.attributes;
        let g;
        let w = m.length;
        let I = 0;
        let y;
        let A;
        let b;
        let B;
        let x;
        let S;
        let C = null;
        let T = false;
        let P;
        let R;
        let E;
        let v;
        let _;
        let k;
        let L;
        let D = null;
        let M;
        let V;
        let H;
        let $;
        let F = true;
        let O = false;
        let W = false;
        let N = false;
        let q;
        let U = 0;
        if (i === "slot") {
            if (n.root.def.shadowOptions == null) {
                throw createMappedError(717, n.root.def.name);
            }
            n.root.hasSlot = true;
        }
        if (l) {
            q = {};
            F = r.processContent?.call(r.Type, e, n.p, q);
            m = e.attributes;
            w = m.length;
        }
        for (;w > I; ++I) {
            y = m[I];
            A = y.name;
            b = y.value;
            switch (A) {
              case "as-element":
              case "containerless":
                p();
                O = O || A === "containerless";
                continue;
            }
            B = n.G.parse(A, b);
            D = n.et(B);
            H = B.target;
            $ = B.rawValue;
            if (c && (!h || h && c(H))) {
                if (D != null && D.ignoreAttr) {
                    p();
                    d.push(B);
                    continue;
                }
                W = H !== nt && H !== "slot" && ((U = H.indexOf("...")) === -1 || U === 0 && H === "...$attrs");
                if (W) {
                    M = n.nt(r);
                    if (M.attrs[H] == null && !n.st(H)?.isTemplateController) {
                        p();
                        d.push(B);
                        continue;
                    }
                }
            }
            if (H === "...$attrs") {
                (x ??= []).push(new SpreadTransferedBindingInstruction);
                p();
                continue;
            }
            if (D?.ignoreAttr) {
                ot.node = e;
                ot.attr = B;
                ot.bindable = null;
                ot.def = null;
                (x ??= []).push(D.build(ot, n.ep, n.m));
                p();
                continue;
            }
            if (H.indexOf("...") === 0) {
                if (l && (H = H.slice(3)) !== "$element") {
                    (S ??= []).push(new SpreadValueBindingInstruction("$bindables", H === "$bindables" ? $ : H));
                    p();
                    continue;
                }
                throw createMappedError(720, H);
            }
            if (l) {
                M = n.nt(r);
                P = M.attrs[H];
                if (P !== void 0) {
                    if (D === null) {
                        k = f.parse($, o);
                        (S ??= []).push(k == null ? new SetPropertyInstruction($, P.name) : new InterpolationInstruction(k, P.name));
                    } else {
                        ot.node = e;
                        ot.attr = B;
                        ot.bindable = P;
                        ot.def = r;
                        (S ??= []).push(D.build(ot, n.ep, n.m));
                    }
                    p();
                    continue;
                }
                if (H === "$bindables") {
                    if (D != null) {
                        ot.node = e;
                        ot.attr = B;
                        ot.bindable = null;
                        ot.def = r;
                        {
                            (S ??= []).push(D.build(ot, n.ep, n.m));
                        }
                    }
                    p();
                    continue;
                }
            }
            if (H === "$bindables") {
                throw createMappedError(721, e.nodeName, H, $);
            }
            C = n.st(H);
            if (C !== null) {
                M = n.nt(C);
                T = C.noMultiBindings === false && D === null && hasInlineBindings($);
                if (T) {
                    E = this.it(e, $, C, n);
                } else {
                    V = M.primary;
                    if (D === null) {
                        k = f.parse($, o);
                        E = k === null ? $ === "" ? [] : [ new SetPropertyInstruction($, V.name) ] : [ new InterpolationInstruction(k, V.name) ];
                    } else {
                        ot.node = e;
                        ot.attr = B;
                        ot.bindable = V;
                        ot.def = C;
                        E = [ D.build(ot, n.ep, n.m) ];
                    }
                }
                p();
                if (C.isTemplateController) {
                    (v ??= []).push(new HydrateTemplateController(lt, this.resolveResources ? C : C.name, void 0, E));
                } else {
                    (R ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? C : C.name, C.aliases != null && C.aliases.includes(H) ? H : void 0, E));
                }
                continue;
            }
            if (D === null) {
                k = f.parse($, o);
                if (k != null) {
                    p();
                    (x ??= []).push(new InterpolationInstruction(k, n.m.map(e, H) ?? t.camelCase(H)));
                }
                continue;
            }
            ot.node = e;
            ot.attr = B;
            ot.bindable = null;
            ot.def = null;
            (x ??= []).push(D.build(ot, n.ep, n.m));
            p();
        }
        resetCommandBuildInfo();
        if (this.ct(e, x) && x != null && x.length > 1) {
            this.ht(e, x);
        }
        if (l) {
            L = new HydrateElementInstruction(this.resolveResources ? r : r.name, S ?? t.emptyArray, null, O, d, q);
        }
        if (x != null || L != null || R != null) {
            g = t.emptyArray.concat(L ?? t.emptyArray, R ?? t.emptyArray, x ?? t.emptyArray);
            N = true;
        }
        let j;
        if (v != null) {
            w = v.length - 1;
            I = w;
            _ = v[I];
            let t;
            if (isMarker(e)) {
                t = n.t();
                appendManyToTemplate(t, [ n.dt(), n.ft(tt), n.ft(et) ]);
            } else {
                this.gt(e, n);
                if (e.nodeName === "TEMPLATE") {
                    t = e;
                } else {
                    t = n.t();
                    appendToTemplate(t, e);
                }
            }
            const s = t;
            const o = n.wt(g == null ? [] : [ g ]);
            let c;
            let h;
            let d = false;
            let f;
            let p;
            let m;
            let y;
            let A;
            let b;
            let B = 0, x = 0;
            let S = e.firstChild;
            let C = false;
            if (F !== false) {
                while (S !== null) {
                    h = isElement(S) ? S.getAttribute(nt) : null;
                    d = h !== null || l && !u;
                    c = S.nextSibling;
                    if (d) {
                        if (!l) {
                            throw createMappedError(706, h, i);
                        }
                        S.removeAttribute?.(nt);
                        C = isTextNode(S) && S.textContent.trim() === "";
                        if (!C) {
                            ((p ??= {})[h || st] ??= []).push(S);
                        }
                        e.removeChild(S);
                    }
                    S = c;
                }
            }
            if (p != null) {
                f = {};
                for (h in p) {
                    t = n.t();
                    m = p[h];
                    for (B = 0, x = m.length; x > B; ++B) {
                        y = m[B];
                        if (y.nodeName === "TEMPLATE") {
                            if (y.attributes.length > 0) {
                                appendToTemplate(t, y);
                            } else {
                                appendToTemplate(t, y.content);
                            }
                        } else {
                            appendToTemplate(t, y);
                        }
                    }
                    b = n.wt();
                    this.Y(t.content, b);
                    f[h] = {
                        name: it(),
                        type: a,
                        template: t,
                        instructions: b.rows,
                        needsCompile: false
                    };
                }
                L.projections = f;
            }
            if (N) {
                if (l && (O || r.containerless)) {
                    this.gt(e, n);
                } else {
                    this.ut(e, n);
                }
            }
            j = !l || !r.containerless && !O && F !== false;
            if (j) {
                if (e.nodeName === rt) {
                    this.Y(e.content, o);
                } else {
                    S = e.firstChild;
                    while (S !== null) {
                        S = this.Y(S, o);
                    }
                }
            }
            _.def = {
                name: it(),
                type: a,
                template: s,
                instructions: o.rows,
                needsCompile: false
            };
            while (I-- > 0) {
                _ = v[I];
                t = n.t();
                A = n.dt();
                appendManyToTemplate(t, [ A, n.ft(tt), n.ft(et) ]);
                _.def = {
                    name: it(),
                    type: a,
                    template: t,
                    needsCompile: false,
                    instructions: [ [ v[I + 1] ] ]
                };
            }
            n.rows.push([ _ ]);
        } else {
            if (g != null) {
                n.rows.push(g);
            }
            let t = e.firstChild;
            let s;
            let o;
            let c = false;
            let h = null;
            let d;
            let f;
            let p;
            let m;
            let w;
            let I = false;
            let y = 0, A = 0;
            if (F !== false) {
                while (t !== null) {
                    o = isElement(t) ? t.getAttribute(nt) : null;
                    c = o !== null || l && !u;
                    s = t.nextSibling;
                    if (c) {
                        if (!l) {
                            throw createMappedError(706, o, i);
                        }
                        t.removeAttribute?.(nt);
                        I = isTextNode(t) && t.textContent.trim() === "";
                        if (!I) {
                            ((d ??= {})[o || st] ??= []).push(t);
                        }
                        e.removeChild(t);
                    }
                    t = s;
                }
            }
            if (d != null) {
                h = {};
                for (o in d) {
                    m = n.t();
                    f = d[o];
                    for (y = 0, A = f.length; A > y; ++y) {
                        p = f[y];
                        if (p.nodeName === rt) {
                            if (p.attributes.length > 0) {
                                appendToTemplate(m, p);
                            } else {
                                appendToTemplate(m, p.content);
                            }
                        } else {
                            appendToTemplate(m, p);
                        }
                    }
                    w = n.wt();
                    this.Y(m.content, w);
                    h[o] = {
                        name: it(),
                        type: a,
                        template: m,
                        instructions: w.rows,
                        needsCompile: false
                    };
                }
                L.projections = h;
            }
            if (N) {
                if (l && (O || r.containerless)) {
                    this.gt(e, n);
                } else {
                    this.ut(e, n);
                }
            }
            j = !l || !r.containerless && !O && F !== false;
            if (j && e.childNodes.length > 0) {
                t = e.firstChild;
                while (t !== null) {
                    t = this.Y(t, n);
                }
            }
        }
        return s;
    }
    ot(t, e) {
        const n = t.parentNode;
        const s = e.ep.parse(t.textContent, o);
        const i = t.nextSibling;
        let r;
        let l;
        let u;
        let c;
        let a;
        if (s !== null) {
            ({parts: r, expressions: l} = s);
            if (a = r[0]) {
                insertBefore(n, e.It(a), t);
            }
            for (u = 0, c = l.length; c > u; ++u) {
                insertManyBefore(n, t, [ e.dt(), e.It(" ") ]);
                if (a = r[u + 1]) {
                    insertBefore(n, e.It(a), t);
                }
                e.rows.push([ new TextBindingInstruction(l[u]) ]);
            }
            n.removeChild(t);
        }
        return i;
    }
    it(t, e, n, s) {
        const i = s.nt(n);
        const r = e.length;
        const l = [];
        let u = void 0;
        let c = void 0;
        let a = 0;
        let h = 0;
        let d;
        let f;
        let p;
        let m;
        for (let g = 0; g < r; ++g) {
            h = e.charCodeAt(g);
            if (h === 92) {
                ++g;
            } else if (h === 58) {
                u = e.slice(a, g);
                while (e.charCodeAt(++g) <= 32) ;
                a = g;
                for (;g < r; ++g) {
                    h = e.charCodeAt(g);
                    if (h === 92) {
                        ++g;
                    } else if (h === 59) {
                        c = e.slice(a, g);
                        break;
                    }
                }
                if (c === void 0) {
                    c = e.slice(a);
                }
                f = s.G.parse(u, c);
                p = s.et(f);
                m = i.attrs[f.target];
                if (m == null) {
                    throw createMappedError(707, f.target, n.name);
                }
                if (p === null) {
                    d = s.ep.parse(c, o);
                    l.push(d === null ? new SetPropertyInstruction(c, m.name) : new InterpolationInstruction(d, m.name));
                } else {
                    ot.node = t;
                    ot.attr = f;
                    ot.bindable = m;
                    ot.def = n;
                    l.push(p.build(ot, s.ep, s.m));
                }
                while (g < r && e.charCodeAt(++g) <= 32) ;
                a = g;
                u = void 0;
                c = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    X(e, n) {
        const s = n.root.def.name;
        const i = e;
        const r = t.toArray(i.querySelectorAll("template[as-custom-element]"));
        const l = r.length;
        if (l === 0) {
            return;
        }
        if (l === i.childElementCount) {
            throw createMappedError(708, s);
        }
        const o = new Set;
        const u = [];
        for (const e of r) {
            if (e.parentNode !== i) {
                throw createMappedError(709, s);
            }
            const n = processTemplateName(s, e, o);
            const r = e.content;
            const l = t.toArray(r.querySelectorAll("bindable"));
            const c = new Set;
            const h = new Set;
            const d = l.reduce(((e, s) => {
                if (s.parentNode !== r) {
                    throw createMappedError(710, n);
                }
                const i = s.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, s, n);
                }
                const l = s.getAttribute("attribute");
                if (l !== null && h.has(l) || c.has(i)) {
                    throw createMappedError(712, c, l);
                } else {
                    if (l !== null) {
                        h.add(l);
                    }
                    c.add(i);
                }
                const o = t.toArray(s.attributes).filter((t => !dt.includes(t.name)));
                if (o.length > 0) ;
                s.remove();
                e[i] = {
                    name: i,
                    attribute: l ?? void 0,
                    mode: s.getAttribute("mode") ?? "default"
                };
                return e;
            }), {});
            class LocalDepType {}
            LocalDepType.$au = {
                type: a,
                name: n,
                template: e,
                bindables: d
            };
            Reflect.defineProperty(LocalDepType, "name", {
                value: t.pascalCase(n)
            });
            u.push(LocalDepType);
            i.removeChild(e);
        }
        const c = (n.root.def.dependencies ?? []).concat(n.root.def.Type == null ? t.emptyArray : [ n.root.def.Type ]);
        for (const t of u) {
            t.dependencies = c.concat(u.filter((e => e !== t)));
            n.yt(t);
        }
    }
    ct(t, e) {
        const n = t.nodeName;
        return n === "INPUT" && ct[t.type] === 1 || n === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === k && t.to === "multiple")));
    }
    ht(t, e) {
        switch (t.nodeName) {
          case "INPUT":
            {
                const t = e;
                let n = void 0;
                let s = void 0;
                let i = 0;
                let r;
                for (let e = 0; e < t.length && i < 3; e++) {
                    r = t[e];
                    switch (r.to) {
                      case "model":
                      case "value":
                      case "matcher":
                        n = e;
                        i++;
                        break;

                      case "checked":
                        s = e;
                        i++;
                        break;
                    }
                }
                if (s !== void 0 && n !== void 0 && s < n) {
                    [t[n], t[s]] = [ t[s], t[n] ];
                }
                break;
            }

          case "SELECT":
            {
                const t = e;
                let n = 0;
                let s = 0;
                let i = 0;
                let r;
                for (let e = 0; e < t.length && i < 2; ++e) {
                    r = t[e];
                    switch (r.to) {
                      case "multiple":
                        s = e;
                        i++;
                        break;

                      case "value":
                        n = e;
                        i++;
                        break;
                    }
                    if (i === 2 && n < s) {
                        [t[s], t[n]] = [ t[n], t[s] ];
                    }
                }
            }
        }
    }
    ut(t, e) {
        insertBefore(t.parentNode, e.ft("au*"), t);
        return t;
    }
    gt(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const n = t.parentNode;
        const s = e.dt();
        insertManyBefore(n, t, [ s, e.ft(tt), e.ft(et) ]);
        n.removeChild(t);
        return s;
    }
}

TemplateCompiler.register = t.createImplementationRegister(d);

const rt = "TEMPLATE";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(e, s, i, r, l) {
        this.hasSlot = false;
        this.deps = null;
        const o = i !== null;
        this.c = s;
        this.root = r === null ? this : r;
        this.def = e;
        this.parent = i;
        this.At = o ? i.At : s.get(at);
        this.bt = o ? i.bt : s.get(ht);
        this.K = o ? i.K : s.get(Y);
        this.G = o ? i.G : s.get(g);
        this.ep = o ? i.ep : s.get(n.IExpressionParser);
        this.m = o ? i.m : s.get(f);
        this.Bt = o ? i.Bt : s.get(t.ILogger);
        if (typeof (this.p = o ? i.p : s.get(t.IPlatform)).document?.nodeType !== "number") {
            throw createMappedError(722);
        }
        this.localEls = o ? i.localEls : new Set;
        this.rows = l ?? [];
    }
    yt(t) {
        (this.root.deps ??= []).push(t);
        this.root.c.register(t);
        return this;
    }
    It(t) {
        return this.p.document.createTextNode(t);
    }
    ft(t) {
        return this.p.document.createComment(t);
    }
    dt() {
        return this.ft("au*");
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
    tt(t) {
        return this.At.el(this.c, t);
    }
    st(t) {
        return this.At.attr(this.c, t);
    }
    nt(t) {
        return this.At.bindables(t);
    }
    wt(t) {
        return new CompilationContext(this.def, this.c, this, this.root, t);
    }
    et(t) {
        const e = t.command;
        if (e === null) {
            return null;
        }
        return this.bt.get(this.c, e);
    }
}

const hasInlineBindings = t => {
    const e = t.length;
    let n = 0;
    let s = 0;
    while (e > s) {
        n = t.charCodeAt(s);
        if (n === 92) {
            ++s;
        } else if (n === 58) {
            return true;
        } else if (n === 36 && t.charCodeAt(s + 1) === 123) {
            return false;
        }
        ++s;
    }
    return false;
};

const resetCommandBuildInfo = () => {
    ot.node = ot.attr = ot.bindable = ot.def = null;
};

const lt = {
    name: "unnamed",
    type: a
};

const ot = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const ut = {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
};

const ct = {
    checkbox: 1,
    radio: 1
};

const at = /*@__PURE__*/ s("IResourceResolver");

const ht = /*@__PURE__*/ s("IBindingCommandResolver", (t => {
    class DefaultBindingCommandResolver {
        constructor() {
            this.U = new WeakMap;
        }
        get(t, e) {
            let n = this.U.get(t);
            if (!n) {
                this.U.set(t, n = {});
            }
            return e in n ? n[e] : n[e] = X.get(t, e);
        }
    }
    return t.singleton(DefaultBindingCommandResolver);
}));

const dt = i([ "name", "attribute", "mode" ]);

const ft = "as-custom-element";

const processTemplateName = (t, e, n) => {
    const s = e.getAttribute(ft);
    if (s === null || s === "") {
        throw createMappedError(715, t);
    }
    if (n.has(s)) {
        throw createMappedError(716, s, t);
    } else {
        n.add(s);
        e.removeAttribute(ft);
    }
    return s;
};

const pt = /*@__PURE__*/ s("ITemplateCompilerHooks");

const mt = i({
    name: /*@__PURE__*/ t.getResourceKeyFor("compiler-hooks"),
    define(e) {
        return t.Registrable.define(e, (function(t) {
            l(pt, this).register(t);
        }));
    },
    findAll(e) {
        return e.get(t.allResources(pt));
    }
});

const templateCompilerHooks = (t, e) => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return mt.define(t);
    }
};

exports.AtPrefixedTriggerAttributePattern = x;

exports.AttrBindingCommand = AttrBindingCommand;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeParser = AttributeParser;

exports.AttributePattern = I;

exports.BindingCommand = X;

exports.BindingCommandDefinition = BindingCommandDefinition;

exports.BindingMode = h;

exports.CaptureBindingCommand = CaptureBindingCommand;

exports.ClassBindingCommand = ClassBindingCommand;

exports.ColonPrefixedBindAttributePattern = B;

exports.DefaultBindingCommand = DefaultBindingCommand;

exports.DotSeparatedAttributePattern = y;

exports.EventAttributePattern = b;

exports.ForBindingCommand = ForBindingCommand;

exports.FromViewBindingCommand = FromViewBindingCommand;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAttrMapper = f;

exports.IAttributeParser = g;

exports.IAttributePattern = m;

exports.IBindingCommandResolver = ht;

exports.IInstruction = J;

exports.IResourceResolver = at;

exports.ISyntaxInterpreter = p;

exports.ITemplateCompiler = d;

exports.ITemplateCompilerHooks = pt;

exports.ITemplateElementFactory = Y;

exports.InstructionType = G;

exports.InterpolationInstruction = InterpolationInstruction;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.LetBindingInstruction = LetBindingInstruction;

exports.ListenerBindingInstruction = ListenerBindingInstruction;

exports.MultiAttrInstruction = MultiAttrInstruction;

exports.OneTimeBindingCommand = OneTimeBindingCommand;

exports.PropertyBindingInstruction = PropertyBindingInstruction;

exports.RefAttributePattern = A;

exports.RefBindingCommand = RefBindingCommand;

exports.RefBindingInstruction = RefBindingInstruction;

exports.SetAttributeInstruction = SetAttributeInstruction;

exports.SetClassAttributeInstruction = SetClassAttributeInstruction;

exports.SetPropertyInstruction = SetPropertyInstruction;

exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.SpreadTransferedBindingInstruction = SpreadTransferedBindingInstruction;

exports.SpreadValueBindingCommand = SpreadValueBindingCommand;

exports.SpreadValueBindingInstruction = SpreadValueBindingInstruction;

exports.StyleBindingCommand = StyleBindingCommand;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.SyntaxInterpreter = SyntaxInterpreter;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = mt;

exports.TextBindingInstruction = TextBindingInstruction;

exports.ToViewBindingCommand = ToViewBindingCommand;

exports.TriggerBindingCommand = TriggerBindingCommand;

exports.TwoWayBindingCommand = TwoWayBindingCommand;

exports.attributePattern = attributePattern;

exports.bindingCommand = bindingCommand;

exports.generateElementName = it;

exports.templateCompilerHooks = templateCompilerHooks;
//# sourceMappingURL=index.cjs.map
