"use strict";

var t = require("@aurelia/kernel");

var e = require("@aurelia/metadata");

var n = require("@aurelia/expression-parser");

const isString = t => typeof t === "string";

const s = t.DI.createInterface;

const i = Object.freeze;

const {aliasTo: r, singleton: l} = t.Registration;

const o = "Interpolation";

const c = "IsFunction";

const u = "IsProperty";

const a = "custom-element";

const h = /*@__PURE__*/ i({
    default: 0,
    oneTime: 1,
    toView: 2,
    fromView: 4,
    twoWay: 6
});

const f = /*@__PURE__*/ s("ITemplateCompiler");

const d = /*@__PURE__*/ s("IAttrMapper");

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
        this.H = [];
        this.M = null;
        this._ = false;
        this.L = e;
    }
    findChild(t) {
        const e = this.H;
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
            this.H.push(s);
            if (t.repeat) {
                s.H.push(s);
            }
        }
        return s;
    }
    findMatches(t, e) {
        const n = [];
        const s = this.H;
        const i = s.length;
        let r = 0;
        let l = null;
        let o = 0;
        let c = 0;
        for (;o < i; ++o) {
            l = s[o];
            if (l.charSpec.has(t)) {
                n.push(l);
                r = l.L.length;
                c = 0;
                if (l.charSpec.isSymbol) {
                    for (;c < r; ++c) {
                        e.next(l.L[c]);
                    }
                } else {
                    for (;c < r; ++c) {
                        e.append(l.L[c], t);
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
        const e = this.F = t.length;
        const n = this.$ = [];
        let s = 0;
        for (;e > s; ++s) {
            n.push(new CharSpec(t[s], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.F;
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
        this.O = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.O);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.O = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.O);
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
        this.V = new AttrParsingState(null);
        this.W = [ this.V ];
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
        let c;
        let u = 0;
        let a;
        while (e > u) {
            n = this.V;
            s = t[u];
            i = s.pattern;
            r = new SegmentTypes;
            l = this.N(s, r);
            o = l.length;
            c = t => n = n.append(t, i);
            for (a = 0; o > a; ++a) {
                l[a].eachChar(c);
            }
            n.M = r;
            n._ = true;
            ++u;
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
        let c = "";
        while (l < i) {
            c = s.charAt(l);
            if (r.length === 0 || !r.includes(c)) {
                if (l === o) {
                    if (c === "P" && s.slice(l, l + 4) === "PART") {
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
    const n = t.M;
    const s = e.M;
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

const x = /*@__PURE__*/ I.define([ {
    pattern: ":PART",
    symbols: ":"
} ], class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, n) {
        return new AttrSyntax(t, e, n[0], "bind");
    }
});

const B = /*@__PURE__*/ I.define([ {
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

const S = /*@__PURE__*/ I.define([ {
    pattern: "...$attrs",
    symbols: ""
} ], class SpreadAttributePattern {
    "...$attrs"(t, e, n) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
});

const C = e.Metadata.get;

e.Metadata.has;

const T = e.Metadata.define;

const P = "ra";

const R = "rb";

const E = "rc";

const v = "rd";

const _ = "re";

const k = "rf";

const L = "rg";

const D = "ri";

const H = "rj";

const M = "rk";

const F = "rl";

const $ = "ha";

const O = "hb";

const V = "hc";

const W = "hd";

const N = "he";

const q = "hf";

const U = "hg";

const j = "hs";

const z = "hp";

const G = /*@__PURE__*/ i({
    hydrateElement: P,
    hydrateAttribute: R,
    hydrateTemplateController: E,
    hydrateLetElement: v,
    setProperty: _,
    interpolation: k,
    propertyBinding: L,
    letBinding: D,
    refBinding: H,
    iteratorBinding: M,
    multiAttr: F,
    textBinding: $,
    listenerBinding: O,
    attributeBinding: V,
    stylePropertyBinding: W,
    setAttribute: N,
    setClassAttribute: q,
    setStyleAttribute: U,
    spreadBinding: j,
    spreadElementProp: z
});

const J = /*@__PURE__*/ s("Instruction");

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = k;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, n) {
        this.from = t;
        this.to = e;
        this.mode = n;
        this.type = L;
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
        this.type = H;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = _;
    }
}

class MultiAttrInstruction {
    constructor(t, e, n) {
        this.value = t;
        this.to = e;
        this.command = n;
        this.type = F;
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
        this.type = P;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, n) {
        this.res = t;
        this.alias = e;
        this.props = n;
        this.type = R;
    }
}

class HydrateTemplateController {
    constructor(t, e, n, s) {
        this.def = t;
        this.res = e;
        this.alias = n;
        this.props = s;
        this.type = E;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = v;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = D;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = $;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, n, s) {
        this.from = t;
        this.to = e;
        this.capture = n;
        this.modifier = s;
        this.type = O;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = W;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = N;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = q;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = U;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, n) {
        this.attr = t;
        this.from = e;
        this.to = n;
        this.type = V;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = j;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
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

const getCommandAnnotation = (e, n) => C(t.Protocol.annotation.keyFor(n), e);

const X = /*@__PURE__*/ (() => {
    const e = "__au_static_resource__";
    const getDefinitionFromStaticAu = (t, n, s) => {
        let i = C(e, t);
        if (i == null) {
            if (t.$au?.type === n) {
                i = s(t.$au, t);
                T(i, t, e);
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
            T(s, i, Q, t.resourceBaseName);
            return i;
        },
        getAnnotation: getCommandAnnotation,
        find(t, e) {
            const n = t.find(K, e);
            return n == null ? null : C(Q, n) ?? getDefinitionFromStaticAu(n, K, BindingCommandDefinition.create) ?? null;
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
        if (e.bindable == null) {
            r = s.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === a) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(l, u), r, 1);
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
        if (e.bindable == null) {
            r = s.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === a) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(l, u), r, 2);
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
        if (e.bindable == null) {
            r = s.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === a) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(l, u), r, 4);
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
        if (e.bindable == null) {
            r = s.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === a) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(l, u), r, 6);
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
        let l;
        let o;
        let c = i.target;
        let f = i.rawValue;
        if (r == null) {
            o = s.isTwoWay(e.node, c) ? 6 : 2;
            c = s.map(e.node, c) ?? t.camelCase(c);
        } else {
            if (f === "" && e.def.type === a) {
                f = t.camelCase(c);
            }
            l = e.def.defaultBindingMode ?? 0;
            o = r.mode === 0 || r.mode == null ? l == null || l === 0 ? 2 : l : r.mode;
            c = r.name;
        }
        return new PropertyBindingInstruction(n.parse(f, u), c, isString(o) ? h[o] ?? 0 : o);
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
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, c), t.attr.target, false, t.attr.parts?.[2] ?? null);
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
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, c), t.attr.target, true, t.attr.parts?.[2] ?? null);
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
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, u), t.attr.target);
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
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, u), t.attr.target);
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
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, u), t.attr.target);
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
        return new RefBindingInstruction(e.parse(t.attr.rawValue, u), t.attr.target);
    }
}

RefBindingCommand.$au = {
    type: K,
    name: "ref"
};

class SpreadBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
}

SpreadBindingCommand.$au = {
    type: K,
    name: "...$attrs"
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

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createText = (t, e) => t.document.createTextNode(e);

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

const tt = "au-slot";

const et = "default";

const nt = (t => () => `anonymous-${++t}`)(0);

class TemplateCompiler {
    constructor() {
        this.K = t.resolve(at);
        this.debug = false;
        this.resolveResources = true;
    }
    compile(e, n) {
        if (e.template == null || e.needsCompile === false) {
            return e;
        }
        const s = new CompilationContext(e, n, null, null, void 0);
        const i = isString(e.template) || !e.enhance ? s.X.createTemplate(e.template) : e.template;
        const r = i.nodeName === st && i.content != null;
        const l = r ? i.content : i;
        const o = mt.findAll(n);
        const c = o.length;
        let u = 0;
        if (c > 0) {
            while (c > u) {
                o[u].compiling?.(i);
                ++u;
            }
        }
        if (i.hasAttribute(dt)) {
            throw createMappedError(701, e);
        }
        this.Y(l, s);
        this.Z(l, s);
        const a = {
            ...e,
            name: e.name || nt(),
            dependencies: (e.dependencies ?? t.emptyArray).concat(s.deps ?? t.emptyArray),
            instructions: s.rows,
            surrogates: r ? this.tt(i, s) : t.emptyArray,
            template: i,
            hasSlots: s.hasSlot,
            needsCompile: false
        };
        return a;
    }
    compileSpread(e, n, s, i, r) {
        const l = new CompilationContext(e, s, null, null, void 0);
        const c = [];
        const u = r ?? l.et(i.nodeName.toLowerCase());
        const a = u !== null;
        const h = l.ep;
        const f = n.length;
        let d = 0;
        let p;
        let m = null;
        let g;
        let w;
        let I;
        let y;
        let A;
        let b = null;
        let x;
        let B;
        let S;
        let C;
        for (;f > d; ++d) {
            p = n[d];
            S = p.target;
            C = p.rawValue;
            b = l.nt(p);
            if (b !== null && b.ignoreAttr) {
                ot.node = i;
                ot.attr = p;
                ot.bindable = null;
                ot.def = null;
                c.push(b.build(ot, l.ep, l.m));
                continue;
            }
            m = l.st(S);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, S);
                }
                I = this.K.get(m);
                B = m.noMultiBindings === false && b === null && hasInlineBindings(C);
                if (B) {
                    w = this.it(i, C, m, l);
                } else {
                    A = I.primary;
                    if (b === null) {
                        x = h.parse(C, o);
                        w = [ x === null ? new SetPropertyInstruction(C, A.name) : new InterpolationInstruction(x, A.name) ];
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
            if (b === null) {
                x = h.parse(C, o);
                if (a) {
                    I = this.K.get(u);
                    y = I.attrs[S];
                    if (y !== void 0) {
                        x = h.parse(C, o);
                        c.push(new SpreadElementPropBindingInstruction(x == null ? new SetPropertyInstruction(C, y.name) : new InterpolationInstruction(x, y.name)));
                        continue;
                    }
                }
                if (x != null) {
                    c.push(new InterpolationInstruction(x, l.m.map(i, S) ?? t.camelCase(S)));
                } else {
                    switch (S) {
                      case "class":
                        c.push(new SetClassAttributeInstruction(C));
                        break;

                      case "style":
                        c.push(new SetStyleAttributeInstruction(C));
                        break;

                      default:
                        c.push(new SetAttributeInstruction(C, S));
                    }
                }
            } else {
                if (a) {
                    I = this.K.get(u);
                    y = I.attrs[S];
                    if (y !== void 0) {
                        ot.node = i;
                        ot.attr = p;
                        ot.bindable = y;
                        ot.def = u;
                        c.push(new SpreadElementPropBindingInstruction(b.build(ot, l.ep, l.m)));
                        continue;
                    }
                }
                ot.node = i;
                ot.attr = p;
                ot.bindable = null;
                ot.def = null;
                c.push(b.build(ot, l.ep, l.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(c);
        }
        return c;
    }
    tt(e, n) {
        const s = [];
        const i = e.attributes;
        const r = n.ep;
        let l = i.length;
        let c = 0;
        let u;
        let a;
        let h;
        let f;
        let d = null;
        let p;
        let m;
        let g;
        let w;
        let I = null;
        let y;
        let A;
        let b;
        let x;
        for (;l > c; ++c) {
            u = i[c];
            a = u.name;
            h = u.value;
            f = n.G.parse(a, h);
            b = f.target;
            x = f.rawValue;
            if (ct[b]) {
                throw createMappedError(702, a);
            }
            I = n.nt(f);
            if (I !== null && I.ignoreAttr) {
                ot.node = e;
                ot.attr = f;
                ot.bindable = null;
                ot.def = null;
                s.push(I.build(ot, n.ep, n.m));
                continue;
            }
            d = n.st(b);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createMappedError(703, b);
                }
                g = this.K.get(d);
                A = d.noMultiBindings === false && I === null && hasInlineBindings(x);
                if (A) {
                    m = this.it(e, x, d, n);
                } else {
                    w = g.primary;
                    if (I === null) {
                        y = r.parse(x, o);
                        m = y === null ? x === "" ? [] : [ new SetPropertyInstruction(x, w.name) ] : [ new InterpolationInstruction(y, w.name) ];
                    } else {
                        ot.node = e;
                        ot.attr = f;
                        ot.bindable = w;
                        ot.def = d;
                        m = [ I.build(ot, n.ep, n.m) ];
                    }
                }
                e.removeAttribute(a);
                --c;
                --l;
                (p ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, d.aliases != null && d.aliases.includes(b) ? b : void 0, m));
                continue;
            }
            if (I === null) {
                y = r.parse(x, o);
                if (y != null) {
                    e.removeAttribute(a);
                    --c;
                    --l;
                    s.push(new InterpolationInstruction(y, n.m.map(e, b) ?? t.camelCase(b)));
                } else {
                    switch (a) {
                      case "class":
                        s.push(new SetClassAttributeInstruction(x));
                        break;

                      case "style":
                        s.push(new SetStyleAttributeInstruction(x));
                        break;

                      default:
                        s.push(new SetAttributeInstruction(x, a));
                    }
                }
            } else {
                ot.node = e;
                ot.attr = f;
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
    Z(t, e) {
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
                    n = this.Z(n, e);
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
        const c = s.ep;
        let a = false;
        let h = 0;
        let f;
        let d;
        let p;
        let m;
        let g;
        let w;
        let I;
        let y;
        for (;r > h; ++h) {
            f = i[h];
            p = f.name;
            m = f.value;
            if (p === "to-binding-context") {
                a = true;
                continue;
            }
            d = s.G.parse(p, m);
            w = d.target;
            I = d.rawValue;
            g = s.nt(d);
            if (g !== null) {
                if (d.command === "bind") {
                    l.push(new LetBindingInstruction(c.parse(I, u), t.camelCase(w)));
                } else {
                    throw createMappedError(704, d);
                }
                continue;
            }
            y = c.parse(I, o);
            l.push(new LetBindingInstruction(y === null ? new n.PrimitiveLiteralExpression(I) : y, t.camelCase(w)));
        }
        s.rows.push([ new HydrateLetElementInstruction(l, a) ]);
        return this.ct(e, s).nextSibling;
    }
    lt(e, n) {
        const s = e.nextSibling;
        const i = (e.getAttribute("as-element") ?? e.nodeName).toLowerCase();
        const r = n.et(i);
        const l = r !== null;
        const c = l && r.shadowOptions != null;
        const u = r?.capture;
        const h = u != null && typeof u !== "boolean";
        const f = u ? [] : t.emptyArray;
        const d = n.ep;
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
        let x;
        let B;
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
        let H;
        let M;
        let F;
        let $;
        let O = true;
        let V = false;
        let W = false;
        let N = false;
        let q;
        if (i === "slot") {
            if (n.root.def.shadowOptions == null) {
                throw createMappedError(717, n.root.def.name);
            }
            n.root.hasSlot = true;
        }
        if (l) {
            q = {};
            O = r.processContent?.call(r.Type, e, n.p, q);
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
                if (!V) {
                    V = A === "containerless";
                }
                continue;
            }
            x = n.G.parse(A, b);
            D = n.nt(x);
            F = x.target;
            $ = x.rawValue;
            if (u && (!h || h && u(F))) {
                if (D != null && D.ignoreAttr) {
                    p();
                    f.push(x);
                    continue;
                }
                W = F !== tt && F !== "slot";
                if (W) {
                    H = this.K.get(r);
                    if (H.attrs[F] == null && !n.st(F)?.isTemplateController) {
                        p();
                        f.push(x);
                        continue;
                    }
                }
            }
            if (D?.ignoreAttr) {
                ot.node = e;
                ot.attr = x;
                ot.bindable = null;
                ot.def = null;
                (B ??= []).push(D.build(ot, n.ep, n.m));
                p();
                continue;
            }
            if (l) {
                H = this.K.get(r);
                P = H.attrs[F];
                if (P !== void 0) {
                    if (D === null) {
                        k = d.parse($, o);
                        (S ??= []).push(k == null ? new SetPropertyInstruction($, P.name) : new InterpolationInstruction(k, P.name));
                    } else {
                        ot.node = e;
                        ot.attr = x;
                        ot.bindable = P;
                        ot.def = r;
                        (S ??= []).push(D.build(ot, n.ep, n.m));
                    }
                    p();
                    continue;
                }
            }
            C = n.st(F);
            if (C !== null) {
                H = this.K.get(C);
                T = C.noMultiBindings === false && D === null && hasInlineBindings($);
                if (T) {
                    E = this.it(e, $, C, n);
                } else {
                    M = H.primary;
                    if (D === null) {
                        k = d.parse($, o);
                        E = k === null ? $ === "" ? [] : [ new SetPropertyInstruction($, M.name) ] : [ new InterpolationInstruction(k, M.name) ];
                    } else {
                        ot.node = e;
                        ot.attr = x;
                        ot.bindable = M;
                        ot.def = C;
                        E = [ D.build(ot, n.ep, n.m) ];
                    }
                }
                p();
                if (C.isTemplateController) {
                    (v ??= []).push(new HydrateTemplateController(lt, this.resolveResources ? C : C.name, void 0, E));
                } else {
                    (R ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? C : C.name, C.aliases != null && C.aliases.includes(F) ? F : void 0, E));
                }
                continue;
            }
            if (D === null) {
                k = d.parse($, o);
                if (k != null) {
                    p();
                    (B ??= []).push(new InterpolationInstruction(k, n.m.map(e, F) ?? t.camelCase(F)));
                }
                continue;
            }
            ot.node = e;
            ot.attr = x;
            ot.bindable = null;
            ot.def = null;
            (B ??= []).push(D.build(ot, n.ep, n.m));
            p();
        }
        resetCommandBuildInfo();
        if (this.ut(e, B) && B != null && B.length > 1) {
            this.ht(e, B);
        }
        if (l) {
            L = new HydrateElementInstruction(this.resolveResources ? r : r.name, S ?? t.emptyArray, null, V, f, q);
        }
        if (B != null || L != null || R != null) {
            g = t.emptyArray.concat(L ?? t.emptyArray, R ?? t.emptyArray, B ?? t.emptyArray);
            N = true;
        }
        let U;
        if (v != null) {
            w = v.length - 1;
            I = w;
            _ = v[I];
            let t;
            if (isMarker(e)) {
                t = n.t();
                appendManyToTemplate(t, [ n.ft(), n.dt(it), n.dt(rt) ]);
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
            let u;
            let h;
            let f = false;
            let d;
            let p;
            let m;
            let y;
            let A;
            let b;
            let x = 0, B = 0;
            let S = e.firstChild;
            let C = false;
            if (O !== false) {
                while (S !== null) {
                    h = isElement(S) ? S.getAttribute(tt) : null;
                    f = h !== null || l && !c;
                    u = S.nextSibling;
                    if (f) {
                        if (!l) {
                            throw createMappedError(706, h, i);
                        }
                        S.removeAttribute?.(tt);
                        C = isTextNode(S) && S.textContent.trim() === "";
                        if (!C) {
                            ((p ??= {})[h || et] ??= []).push(S);
                        }
                        e.removeChild(S);
                    }
                    S = u;
                }
            }
            if (p != null) {
                d = {};
                for (h in p) {
                    t = n.t();
                    m = p[h];
                    for (x = 0, B = m.length; B > x; ++x) {
                        y = m[x];
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
                    this.Z(t.content, b);
                    d[h] = {
                        name: nt(),
                        type: a,
                        template: t,
                        instructions: b.rows,
                        needsCompile: false
                    };
                }
                L.projections = d;
            }
            if (N) {
                if (l && (V || r.containerless)) {
                    this.gt(e, n);
                } else {
                    this.ct(e, n);
                }
            }
            U = !l || !r.containerless && !V && O !== false;
            if (U) {
                if (e.nodeName === st) {
                    this.Z(e.content, o);
                } else {
                    S = e.firstChild;
                    while (S !== null) {
                        S = this.Z(S, o);
                    }
                }
            }
            _.def = {
                name: nt(),
                type: a,
                template: s,
                instructions: o.rows,
                needsCompile: false
            };
            while (I-- > 0) {
                _ = v[I];
                t = n.t();
                A = n.ft();
                appendManyToTemplate(t, [ A, n.dt(it), n.dt(rt) ]);
                _.def = {
                    name: nt(),
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
            let u = false;
            let h = null;
            let f;
            let d;
            let p;
            let m;
            let w;
            let I = false;
            let y = 0, A = 0;
            if (O !== false) {
                while (t !== null) {
                    o = isElement(t) ? t.getAttribute(tt) : null;
                    u = o !== null || l && !c;
                    s = t.nextSibling;
                    if (u) {
                        if (!l) {
                            throw createMappedError(706, o, i);
                        }
                        t.removeAttribute?.(tt);
                        I = isTextNode(t) && t.textContent.trim() === "";
                        if (!I) {
                            ((f ??= {})[o || et] ??= []).push(t);
                        }
                        e.removeChild(t);
                    }
                    t = s;
                }
            }
            if (f != null) {
                h = {};
                for (o in f) {
                    m = n.t();
                    d = f[o];
                    for (y = 0, A = d.length; A > y; ++y) {
                        p = d[y];
                        if (p.nodeName === st) {
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
                    this.Z(m.content, w);
                    h[o] = {
                        name: nt(),
                        type: a,
                        template: m,
                        instructions: w.rows,
                        needsCompile: false
                    };
                }
                L.projections = h;
            }
            if (N) {
                if (l && (V || r.containerless)) {
                    this.gt(e, n);
                } else {
                    this.ct(e, n);
                }
            }
            U = !l || !r.containerless && !V && O !== false;
            if (U && e.childNodes.length > 0) {
                t = e.firstChild;
                while (t !== null) {
                    t = this.Z(t, n);
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
        let c;
        let u;
        let a;
        if (s !== null) {
            ({parts: r, expressions: l} = s);
            if (a = r[0]) {
                insertBefore(n, e.It(a), t);
            }
            for (c = 0, u = l.length; u > c; ++c) {
                insertManyBefore(n, t, [ e.ft(), e.It(" ") ]);
                if (a = r[c + 1]) {
                    insertBefore(n, e.It(a), t);
                }
                e.rows.push([ new TextBindingInstruction(l[c]) ]);
            }
            n.removeChild(t);
        }
        return i;
    }
    it(t, e, n, s) {
        const i = this.K.get(n);
        const r = e.length;
        const l = [];
        let c = void 0;
        let u = void 0;
        let a = 0;
        let h = 0;
        let f;
        let d;
        let p;
        let m;
        for (let g = 0; g < r; ++g) {
            h = e.charCodeAt(g);
            if (h === 92) {
                ++g;
            } else if (h === 58) {
                c = e.slice(a, g);
                while (e.charCodeAt(++g) <= 32) ;
                a = g;
                for (;g < r; ++g) {
                    h = e.charCodeAt(g);
                    if (h === 92) {
                        ++g;
                    } else if (h === 59) {
                        u = e.slice(a, g);
                        break;
                    }
                }
                if (u === void 0) {
                    u = e.slice(a);
                }
                d = s.G.parse(c, u);
                p = s.nt(d);
                m = i.attrs[d.target];
                if (m == null) {
                    throw createMappedError(707, d.target, n.name);
                }
                if (p === null) {
                    f = s.ep.parse(u, o);
                    l.push(f === null ? new SetPropertyInstruction(u, m.name) : new InterpolationInstruction(f, m.name));
                } else {
                    ot.node = t;
                    ot.attr = d;
                    ot.bindable = m;
                    ot.def = n;
                    l.push(p.build(ot, s.ep, s.m));
                }
                while (g < r && e.charCodeAt(++g) <= 32) ;
                a = g;
                c = void 0;
                u = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    Y(e, n) {
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
        const c = [];
        for (const e of r) {
            if (e.parentNode !== i) {
                throw createMappedError(709, s);
            }
            const n = processTemplateName(s, e, o);
            const r = e.content;
            const l = t.toArray(r.querySelectorAll("bindable"));
            const u = new Set;
            const h = new Set;
            const f = l.reduce(((e, s) => {
                if (s.parentNode !== r) {
                    throw createMappedError(710, n);
                }
                const i = s.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, s, n);
                }
                const l = s.getAttribute("attribute");
                if (l !== null && h.has(l) || u.has(i)) {
                    throw createMappedError(712, u, l);
                } else {
                    if (l !== null) {
                        h.add(l);
                    }
                    u.add(i);
                }
                const o = t.toArray(s.attributes).filter((t => !ft.includes(t.name)));
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
                bindables: f
            };
            Reflect.defineProperty(LocalDepType, "name", {
                value: t.pascalCase(n)
            });
            c.push(LocalDepType);
            i.removeChild(e);
        }
        const u = (n.root.def.dependencies ?? []).concat(n.root.def.Type == null ? t.emptyArray : [ n.root.def.Type ]);
        for (const t of c) {
            t.dependencies = u.concat(c.filter((e => e !== t)));
            n.yt(t);
        }
    }
    ut(t, e) {
        const n = t.nodeName;
        return n === "INPUT" && ut[t.type] === 1 || n === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === L && t.to === "multiple")));
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
    ct(t, e) {
        insertBefore(t.parentNode, e.dt("au*"), t);
        return t;
    }
    gt(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const n = t.parentNode;
        const s = e.ft();
        insertManyBefore(n, t, [ s, e.dt(it), e.dt(rt) ]);
        n.removeChild(t);
        return s;
    }
}

TemplateCompiler.register = t.createImplementationRegister(f);

const st = "TEMPLATE";

const it = "au-start";

const rt = "au-end";

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
        this.At = o ? i.At : s.get(ht);
        this.X = o ? i.X : s.get(Y);
        this.G = o ? i.G : s.get(g);
        this.ep = o ? i.ep : s.get(n.IExpressionParser);
        this.m = o ? i.m : s.get(d);
        this.bt = o ? i.bt : s.get(t.ILogger);
        if (typeof (this.p = o ? i.p : s.get(t.IPlatform)).document?.nodeType !== "number") {
            throw new Error("Invalid platform");
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
        return createText(this.p, t);
    }
    dt(t) {
        return createComment(this.p, t);
    }
    ft() {
        return this.dt("au*");
    }
    h(t) {
        const e = createElement(this.p, t);
        if (t === "template") {
            this.p.document.adoptNode(e.content);
        }
        return e;
    }
    t() {
        return this.h("template");
    }
    et(t) {
        return this.At.el(this.c, t);
    }
    st(t) {
        return this.At.attr(this.c, t);
    }
    wt(t) {
        return new CompilationContext(this.def, this.c, this, this.root, t);
    }
    nt(t) {
        const e = t.command;
        if (e === null) {
            return null;
        }
        return this.At.command(this.c, e);
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

const ct = {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
};

const ut = {
    checkbox: 1,
    radio: 1
};

const at = /*@__PURE__*/ s("IBindablesInfoResolver");

const ht = /*@__PURE__*/ s("IResourceResolver");

const ft = i([ "name", "attribute", "mode" ]);

const dt = "as-custom-element";

const processTemplateName = (t, e, n) => {
    const s = e.getAttribute(dt);
    if (s === null || s === "") {
        throw createMappedError(715, t);
    }
    if (n.has(s)) {
        throw createMappedError(716, s, t);
    } else {
        n.add(s);
        e.removeAttribute(dt);
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

exports.AtPrefixedTriggerAttributePattern = B;

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

exports.ColonPrefixedBindAttributePattern = x;

exports.DefaultBindingCommand = DefaultBindingCommand;

exports.DotSeparatedAttributePattern = y;

exports.EventAttributePattern = b;

exports.ForBindingCommand = ForBindingCommand;

exports.FromViewBindingCommand = FromViewBindingCommand;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAttrMapper = d;

exports.IAttributeParser = g;

exports.IAttributePattern = m;

exports.IBindablesInfoResolver = at;

exports.IInstruction = J;

exports.IResourceResolver = ht;

exports.ISyntaxInterpreter = p;

exports.ITemplateCompiler = f;

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

exports.SpreadAttributePattern = S;

exports.SpreadBindingCommand = SpreadBindingCommand;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

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

exports.templateCompilerHooks = templateCompilerHooks;
//# sourceMappingURL=index.cjs.map
