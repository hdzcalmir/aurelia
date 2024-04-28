import { DI as t, Registration as n, getResourceKeyFor as e, Registrable as i, emptyArray as s, resolve as r, IContainer as l, firstDefined as o, mergeArrays as c, Protocol as u, resourceBaseName as a, resource as h, camelCase as f, IPlatform as d, createImplementationRegister as m, noop as p, toArray as g, pascalCase as w, ILogger as I, allResources as y } from "@aurelia/kernel";

import { Metadata as A } from "@aurelia/metadata";

import { PrimitiveLiteralExpression as b, IExpressionParser as B } from "@aurelia/expression-parser";

const isString = t => typeof t === "string";

const S = t.createInterface;

const C = Object.freeze;

const {aliasTo: T, singleton: P} = n;

const R = "Interpolation";

const E = "IsFunction";

const x = "IsProperty";

const v = "custom-element";

const _ = /*@__PURE__*/ C({
    default: 0,
    oneTime: 1,
    toView: 2,
    fromView: 4,
    twoWay: 6
});

const k = /*@__PURE__*/ S("ITemplateCompiler");

const L = /*@__PURE__*/ S("IAttrMapper");

class CharSpec {
    constructor(t, n, e, i) {
        this.chars = t;
        this.repeat = n;
        this.isSymbol = e;
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
        this.parts = s;
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
    set pattern(t) {
        if (t == null) {
            this.T = "";
            this.parts = s;
        } else {
            this.T = t;
            this.parts = this.R[t];
        }
    }
    append(t, n) {
        const e = this.P;
        if (e[t] === undefined) {
            e[t] = n;
        } else {
            e[t] += n;
        }
    }
    next(t) {
        const n = this.P;
        let e;
        if (n[t] !== undefined) {
            e = this.R;
            if (e[t] === undefined) {
                e[t] = [ n[t] ];
            } else {
                e[t].push(n[t]);
            }
            n[t] = undefined;
        }
    }
}

class AttrParsingState {
    get T() {
        return this._ ? this.L[0] : null;
    }
    constructor(t, ...n) {
        this.charSpec = t;
        this.H = [];
        this.M = null;
        this._ = false;
        this.L = n;
    }
    findChild(t) {
        const n = this.H;
        const e = n.length;
        let i = null;
        let s = 0;
        for (;s < e; ++s) {
            i = n[s];
            if (t.equals(i.charSpec)) {
                return i;
            }
        }
        return null;
    }
    append(t, n) {
        const e = this.L;
        if (!e.includes(n)) {
            e.push(n);
        }
        let i = this.findChild(t);
        if (i == null) {
            i = new AttrParsingState(t, n);
            this.H.push(i);
            if (t.repeat) {
                i.H.push(i);
            }
        }
        return i;
    }
    findMatches(t, n) {
        const e = [];
        const i = this.H;
        const s = i.length;
        let r = 0;
        let l = null;
        let o = 0;
        let c = 0;
        for (;o < s; ++o) {
            l = i[o];
            if (l.charSpec.has(t)) {
                e.push(l);
                r = l.L.length;
                c = 0;
                if (l.charSpec.isSymbol) {
                    for (;c < r; ++c) {
                        n.next(l.L[c]);
                    }
                } else {
                    for (;c < r; ++c) {
                        n.append(l.L[c], t);
                    }
                }
            }
        }
        return e;
    }
}

class StaticSegment {
    constructor(t) {
        this.text = t;
        const n = this.F = t.length;
        const e = this.$ = [];
        let i = 0;
        for (;n > i; ++i) {
            e.push(new CharSpec(t[i], false, false, false));
        }
    }
    eachChar(t) {
        const n = this.F;
        const e = this.$;
        let i = 0;
        for (;n > i; ++i) {
            t(e[i]);
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

const D = /*@__PURE__*/ S("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.V = new AttrParsingState(null);
        this.W = [ this.V ];
    }
    add(t) {
        t = t.slice(0).sort(((t, n) => t.pattern > n.pattern ? 1 : -1));
        const n = t.length;
        let e;
        let i;
        let s;
        let r;
        let l;
        let o;
        let c;
        let u = 0;
        let a;
        while (n > u) {
            e = this.V;
            i = t[u];
            s = i.pattern;
            r = new SegmentTypes;
            l = this.N(i, r);
            o = l.length;
            c = t => e = e.append(t, s);
            for (a = 0; o > a; ++a) {
                l[a].eachChar(c);
            }
            e.M = r;
            e._ = true;
            ++u;
        }
    }
    interpret(t) {
        const n = new Interpretation;
        const e = t.length;
        let i = this.W;
        let s = 0;
        let r;
        for (;s < e; ++s) {
            i = this.U(i, t.charAt(s), n);
            if (i.length === 0) {
                break;
            }
        }
        i = i.filter(isEndpoint);
        if (i.length > 0) {
            i.sort(sortEndpoint);
            r = i[0];
            if (!r.charSpec.isSymbol) {
                n.next(r.T);
            }
            n.pattern = r.T;
        }
        return n;
    }
    U(t, n, e) {
        const i = [];
        let s = null;
        const r = t.length;
        let l = 0;
        for (;l < r; ++l) {
            s = t[l];
            i.push(...s.findMatches(n, e));
        }
        return i;
    }
    N(t, n) {
        const e = [];
        const i = t.pattern;
        const s = i.length;
        const r = t.symbols;
        let l = 0;
        let o = 0;
        let c = "";
        while (l < s) {
            c = i.charAt(l);
            if (r.length === 0 || !r.includes(c)) {
                if (l === o) {
                    if (c === "P" && i.slice(l, l + 4) === "PART") {
                        o = l = l + 4;
                        e.push(new DynamicSegment(r));
                        ++n.dynamics;
                    } else {
                        ++l;
                    }
                } else {
                    ++l;
                }
            } else if (l !== o) {
                e.push(new StaticSegment(i.slice(o, l)));
                ++n.statics;
                o = l;
            } else {
                e.push(new SymbolSegment(i.slice(o, l + 1)));
                ++n.symbols;
                o = ++l;
            }
        }
        if (o !== l) {
            e.push(new StaticSegment(i.slice(o, l)));
            ++n.statics;
        }
        return e;
    }
}

function isEndpoint(t) {
    return t._;
}

function sortEndpoint(t, n) {
    const e = t.M;
    const i = n.M;
    if (e.statics !== i.statics) {
        return i.statics - e.statics;
    }
    if (e.dynamics !== i.dynamics) {
        return i.dynamics - e.dynamics;
    }
    if (e.symbols !== i.symbols) {
        return i.symbols - e.symbols;
    }
    return 0;
}

class AttrSyntax {
    constructor(t, n, e, i, s = null) {
        this.rawName = t;
        this.rawValue = n;
        this.target = e;
        this.command = i;
        this.parts = s;
    }
}

const H = /*@__PURE__*/ S("IAttributePattern");

const M = /*@__PURE__*/ S("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.j = {};
        const t = this.q = r(D);
        const n = $.findAll(r(l));
        const e = this.L = {};
        const i = n.reduce(((t, n) => {
            const i = getAllPatternDefinitions(n.constructor);
            i.forEach((t => e[t.pattern] = n));
            return t.concat(i);
        }), s);
        t.add(i);
    }
    parse(t, n) {
        let e = this.j[t];
        if (e == null) {
            e = this.j[t] = this.q.interpret(t);
        }
        const i = e.pattern;
        if (i == null) {
            return new AttrSyntax(t, n, t, null, null);
        } else {
            return this.L[i][i](t, n, e.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(n) {
        return $.define(t, n);
    };
}

const getAllPatternDefinitions = t => F.get(t) ?? s;

const F = new WeakMap;

const $ = /*@__PURE__*/ C({
    name: e("attribute-pattern"),
    define(t, n) {
        F.set(n, t);
        return i.define(n, (t => {
            P(H, n).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(H)
});

const O = /*@__PURE__*/ $.define([ {
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
} ], class DotSeparatedAttributePattern {
    "PART.PART"(t, n, e) {
        return new AttrSyntax(t, n, e[0], e[1]);
    }
    "PART.PART.PART"(t, n, e) {
        return new AttrSyntax(t, n, `${e[0]}.${e[1]}`, e[2]);
    }
});

const V = /*@__PURE__*/ $.define([ {
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
} ], class RefAttributePattern {
    ref(t, n, e) {
        return new AttrSyntax(t, n, "element", "ref");
    }
    "PART.ref"(t, n, e) {
        let i = e[0];
        if (i === "view-model") {
            i = "component";
        }
        return new AttrSyntax(t, n, i, "ref");
    }
});

const W = /*@__PURE__*/ $.define([ {
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
} ], class EventAttributePattern {
    "PART.trigger:PART"(t, n, e) {
        return new AttrSyntax(t, n, e[0], "trigger", e);
    }
    "PART.capture:PART"(t, n, e) {
        return new AttrSyntax(t, n, e[0], "capture", e);
    }
});

const N = /*@__PURE__*/ $.define([ {
    pattern: ":PART",
    symbols: ":"
} ], class ColonPrefixedBindAttributePattern {
    ":PART"(t, n, e) {
        return new AttrSyntax(t, n, e[0], "bind");
    }
});

const U = /*@__PURE__*/ $.define([ {
    pattern: "@PART",
    symbols: "@"
}, {
    pattern: "@PART:PART",
    symbols: "@:"
} ], class AtPrefixedTriggerAttributePattern {
    "@PART"(t, n, e) {
        return new AttrSyntax(t, n, e[0], "trigger");
    }
    "@PART:PART"(t, n, e) {
        return new AttrSyntax(t, n, e[0], "trigger", [ e[0], "trigger", ...e.slice(1) ]);
    }
});

const j = /*@__PURE__*/ $.define([ {
    pattern: "...$attrs",
    symbols: ""
} ], class SpreadAttributePattern {
    "...$attrs"(t, n, e) {
        return new AttrSyntax(t, n, "", "...$attrs");
    }
});

const q = A.get;

A.has;

const z = A.define;

const G = "ra";

const J = "rb";

const K = "rc";

const Q = "rd";

const X = "re";

const Y = "rf";

const Z = "rg";

const tt = "ri";

const nt = "rj";

const et = "rk";

const it = "rl";

const st = "ha";

const rt = "hb";

const lt = "hc";

const ot = "hd";

const ct = "he";

const ut = "hf";

const at = "hg";

const ht = "hs";

const ft = "hp";

const dt = /*@__PURE__*/ C({
    hydrateElement: G,
    hydrateAttribute: J,
    hydrateTemplateController: K,
    hydrateLetElement: Q,
    setProperty: X,
    interpolation: Y,
    propertyBinding: Z,
    letBinding: tt,
    refBinding: nt,
    iteratorBinding: et,
    multiAttr: it,
    textBinding: st,
    listenerBinding: rt,
    attributeBinding: lt,
    stylePropertyBinding: ot,
    setAttribute: ct,
    setClassAttribute: ut,
    setStyleAttribute: at,
    spreadBinding: ht,
    spreadElementProp: ft
});

const mt = /*@__PURE__*/ S("Instruction");

class InterpolationInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = Y;
    }
}

class PropertyBindingInstruction {
    constructor(t, n, e) {
        this.from = t;
        this.to = n;
        this.mode = e;
        this.type = Z;
    }
}

class IteratorBindingInstruction {
    constructor(t, n, e) {
        this.forOf = t;
        this.to = n;
        this.props = e;
        this.type = et;
    }
}

class RefBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = nt;
    }
}

class SetPropertyInstruction {
    constructor(t, n) {
        this.value = t;
        this.to = n;
        this.type = X;
    }
}

class MultiAttrInstruction {
    constructor(t, n, e) {
        this.value = t;
        this.to = n;
        this.command = e;
        this.type = it;
    }
}

class HydrateElementInstruction {
    constructor(t, n, e, i, s, r) {
        this.res = t;
        this.props = n;
        this.projections = e;
        this.containerless = i;
        this.captures = s;
        this.data = r;
        this.type = G;
    }
}

class HydrateAttributeInstruction {
    constructor(t, n, e) {
        this.res = t;
        this.alias = n;
        this.props = e;
        this.type = J;
    }
}

class HydrateTemplateController {
    constructor(t, n, e, i) {
        this.def = t;
        this.res = n;
        this.alias = e;
        this.props = i;
        this.type = K;
    }
}

class HydrateLetElementInstruction {
    constructor(t, n) {
        this.instructions = t;
        this.toBindingContext = n;
        this.type = Q;
    }
}

class LetBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = tt;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = st;
    }
}

class ListenerBindingInstruction {
    constructor(t, n, e, i) {
        this.from = t;
        this.to = n;
        this.capture = e;
        this.modifier = i;
        this.type = rt;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = ot;
    }
}

class SetAttributeInstruction {
    constructor(t, n) {
        this.value = t;
        this.to = n;
        this.type = ct;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ut;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = at;
    }
}

class AttributeBindingInstruction {
    constructor(t, n, e) {
        this.attr = t;
        this.from = n;
        this.to = e;
        this.type = lt;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = ht;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = ft;
    }
}

const createMappedError = (t, ...n) => new Error(`AUR${String(t).padStart(4, "0")}:${n.map(String)}`);

function bindingCommand(t) {
    return function(n, e) {
        e.addInitializer((function() {
            wt.define(t, n);
        }));
        return n;
    };
}

class BindingCommandDefinition {
    constructor(t, n, e, i) {
        this.Type = t;
        this.name = n;
        this.aliases = e;
        this.key = i;
    }
    static create(t, n) {
        let e;
        let i;
        if (isString(t)) {
            e = t;
            i = {
                name: e
            };
        } else {
            e = t.name;
            i = t;
        }
        return new BindingCommandDefinition(n, o(getCommandAnnotation(n, "name"), e), c(getCommandAnnotation(n, "aliases"), i.aliases, n.aliases), getCommandKeyFrom(e));
    }
    register(t, n) {
        const e = this.Type;
        const i = typeof n === "string" ? getCommandKeyFrom(n) : this.key;
        const s = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(e, false) ? null : P(e, e), T(e, i), ...s.map((t => T(e, getCommandKeyFrom(t)))));
        }
    }
}

const pt = "binding-command";

const gt = /*@__PURE__*/ e(pt);

const getCommandKeyFrom = t => `${gt}:${t}`;

const getCommandAnnotation = (t, n) => q(u.annotation.keyFor(n), t);

const wt = /*@__PURE__*/ (() => {
    const t = "__au_static_resource__";
    const getDefinitionFromStaticAu = (n, e, i) => {
        let s = q(t, n);
        if (s == null) {
            if (n.$au?.type === e) {
                s = i(n.$au, n);
                z(s, n, t);
            }
        }
        return s;
    };
    return C({
        name: gt,
        keyFrom: getCommandKeyFrom,
        define(t, n) {
            const e = BindingCommandDefinition.create(t, n);
            const i = e.Type;
            z(e, i, gt, a);
            return i;
        },
        getAnnotation: getCommandAnnotation,
        find(t, n) {
            const e = t.find(pt, n);
            return e == null ? null : q(gt, e) ?? getDefinitionFromStaticAu(e, pt, BindingCommandDefinition.create) ?? null;
        },
        get(t, n) {
            return t.get(h(getCommandKeyFrom(n)));
        }
    });
})();

class OneTimeBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, n, e) {
        const i = t.attr;
        let s = i.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            s = e.map(t.node, s) ?? f(s);
        } else {
            if (r === "" && t.def.type === v) {
                r = f(s);
            }
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(r, x), s, 1);
    }
}

OneTimeBindingCommand.$au = {
    type: pt,
    name: "one-time"
};

class ToViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, n, e) {
        const i = t.attr;
        let s = i.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            s = e.map(t.node, s) ?? f(s);
        } else {
            if (r === "" && t.def.type === v) {
                r = f(s);
            }
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(r, x), s, 2);
    }
}

ToViewBindingCommand.$au = {
    type: pt,
    name: "to-view"
};

class FromViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, n, e) {
        const i = t.attr;
        let s = i.target;
        let r = i.rawValue;
        if (t.bindable == null) {
            s = e.map(t.node, s) ?? f(s);
        } else {
            if (r === "" && t.def.type === v) {
                r = f(s);
            }
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(r, x), s, 4);
    }
}

FromViewBindingCommand.$au = {
    type: pt,
    name: "from-view"
};

class TwoWayBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, n, e) {
        const i = t.attr;
        let s = i.target;
        let r = i.rawValue;
        if (t.bindable == null) {
            s = e.map(t.node, s) ?? f(s);
        } else {
            if (r === "" && t.def.type === v) {
                r = f(s);
            }
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(r, x), s, 6);
    }
}

TwoWayBindingCommand.$au = {
    type: pt,
    name: "two-way"
};

class DefaultBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, n, e) {
        const i = t.attr;
        const s = t.bindable;
        let r;
        let l;
        let o = i.target;
        let c = i.rawValue;
        if (s == null) {
            l = e.isTwoWay(t.node, o) ? 6 : 2;
            o = e.map(t.node, o) ?? f(o);
        } else {
            if (c === "" && t.def.type === v) {
                c = f(o);
            }
            r = t.def.defaultBindingMode ?? 0;
            l = s.mode === 0 || s.mode == null ? r == null || r === 0 ? 2 : r : s.mode;
            o = s.name;
        }
        return new PropertyBindingInstruction(n.parse(c, x), o, isString(l) ? _[l] ?? 0 : l);
    }
}

DefaultBindingCommand.$au = {
    type: pt,
    name: "bind"
};

class ForBindingCommand {
    constructor() {
        this.G = r(M);
    }
    get ignoreAttr() {
        return false;
    }
    build(t, n) {
        const e = t.bindable === null ? f(t.attr.target) : t.bindable.name;
        const i = n.parse(t.attr.rawValue, "IsIterator");
        let r = s;
        if (i.semiIdx > -1) {
            const n = t.attr.rawValue.slice(i.semiIdx + 1);
            const e = n.indexOf(":");
            if (e > -1) {
                const t = n.slice(0, e).trim();
                const i = n.slice(e + 1).trim();
                const s = this.G.parse(t, i);
                r = [ new MultiAttrInstruction(i, s.target, s.command) ];
            }
        }
        return new IteratorBindingInstruction(i, e, r);
    }
}

ForBindingCommand.$au = {
    type: pt,
    name: "for"
};

class TriggerBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, n) {
        return new ListenerBindingInstruction(n.parse(t.attr.rawValue, E), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
}

TriggerBindingCommand.$au = {
    type: pt,
    name: "trigger"
};

class CaptureBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, n) {
        return new ListenerBindingInstruction(n.parse(t.attr.rawValue, E), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
}

CaptureBindingCommand.$au = {
    type: pt,
    name: "capture"
};

class AttrBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, n) {
        return new AttributeBindingInstruction(t.attr.target, n.parse(t.attr.rawValue, x), t.attr.target);
    }
}

AttrBindingCommand.$au = {
    type: pt,
    name: "attr"
};

class StyleBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, n) {
        return new AttributeBindingInstruction("style", n.parse(t.attr.rawValue, x), t.attr.target);
    }
}

StyleBindingCommand.$au = {
    type: pt,
    name: "style"
};

class ClassBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, n) {
        return new AttributeBindingInstruction("class", n.parse(t.attr.rawValue, x), t.attr.target);
    }
}

ClassBindingCommand.$au = {
    type: pt,
    name: "class"
};

class RefBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, n) {
        return new RefBindingInstruction(n.parse(t.attr.rawValue, x), t.attr.target);
    }
}

RefBindingCommand.$au = {
    type: pt,
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
    type: pt,
    name: "...$attrs"
};

const It = /*@__PURE__*/ S("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const yt = {};

class TemplateElementFactory {
    constructor() {
        this.p = r(d);
        this.J = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let n = yt[t];
            if (n === void 0) {
                const e = this.J;
                e.innerHTML = t;
                const i = e.content.firstElementChild;
                if (needsWrapping(i)) {
                    this.J = this.t();
                    n = e;
                } else {
                    e.content.removeChild(i);
                    n = i;
                }
                yt[t] = n;
            }
            return n.cloneNode(true);
        }
        if (t.nodeName !== "TEMPLATE") {
            const n = this.t();
            n.content.appendChild(t);
            return n;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
        function needsWrapping(t) {
            if (t == null) return true;
            if (t.nodeName !== "TEMPLATE") return true;
            const n = t.nextElementSibling;
            if (n != null) return true;
            const e = t.previousSibling;
            if (e != null) {
                switch (e.nodeType) {
                  case 3:
                    return e.textContent.trim().length > 0;
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

const createElement = (t, n) => t.document.createElement(n);

const createComment = (t, n) => t.document.createComment(n);

const createText = (t, n) => t.document.createTextNode(n);

const insertBefore = (t, n, e) => t.insertBefore(n, e);

const insertManyBefore = (t, n, e) => {
    if (t === null) {
        return;
    }
    const i = e.length;
    let s = 0;
    while (i > s) {
        t.insertBefore(e[s], n);
        ++s;
    }
};

const appendToTemplate = (t, n) => t.content.appendChild(n);

const appendManyToTemplate = (t, n) => {
    const e = n.length;
    let i = 0;
    while (e > i) {
        t.content.appendChild(n[i]);
        ++i;
    }
};

const isElement = t => t.nodeType === 1;

const isTextNode = t => t.nodeType === 3;

const At = "au-slot";

const bt = "default";

const Bt = (t => () => `anonymous-${++t}`)(0);

class TemplateCompiler {
    constructor() {
        this.K = r(vt);
        this.debug = false;
        this.resolveResources = true;
    }
    compile(t, n) {
        if (t.template == null || t.needsCompile === false) {
            return t;
        }
        const e = new CompilationContext(t, n, null, null, void 0);
        const i = isString(t.template) || !t.enhance ? e.X.createTemplate(t.template) : t.template;
        const r = i.nodeName === St && i.content != null;
        const l = r ? i.content : i;
        const o = Ht.findAll(n);
        const c = o.length;
        let u = 0;
        if (c > 0) {
            while (c > u) {
                o[u].compiling?.(i);
                ++u;
            }
        }
        if (i.hasAttribute(Lt)) {
            throw createMappedError(701, t);
        }
        this.Y(l, e);
        this.Z(l, e);
        const a = {
            ...t,
            name: t.name || Bt(),
            dependencies: (t.dependencies ?? s).concat(e.deps ?? s),
            instructions: e.rows,
            surrogates: r ? this.tt(i, e) : s,
            template: i,
            hasSlots: e.hasSlot,
            needsCompile: false
        };
        return a;
    }
    compileSpread(t, n, e, i, s) {
        const r = new CompilationContext(t, e, null, null, void 0);
        const l = [];
        const o = s ?? r.nt(i.nodeName.toLowerCase());
        const c = o !== null;
        const u = r.ep;
        const a = n.length;
        let h = 0;
        let d;
        let m = null;
        let p;
        let g;
        let w;
        let I;
        let y;
        let A = null;
        let b;
        let B;
        let S;
        let C;
        for (;a > h; ++h) {
            d = n[h];
            S = d.target;
            C = d.rawValue;
            A = r.et(d);
            if (A !== null && A.ignoreAttr) {
                Rt.node = i;
                Rt.attr = d;
                Rt.bindable = null;
                Rt.def = null;
                l.push(A.build(Rt, r.ep, r.m));
                continue;
            }
            m = r.it(S);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, S);
                }
                w = this.K.get(m);
                B = m.noMultiBindings === false && A === null && hasInlineBindings(C);
                if (B) {
                    g = this.st(i, C, m, r);
                } else {
                    y = w.primary;
                    if (A === null) {
                        b = u.parse(C, R);
                        g = [ b === null ? new SetPropertyInstruction(C, y.name) : new InterpolationInstruction(b, y.name) ];
                    } else {
                        Rt.node = i;
                        Rt.attr = d;
                        Rt.bindable = y;
                        Rt.def = m;
                        g = [ A.build(Rt, r.ep, r.m) ];
                    }
                }
                (p ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(S) ? S : void 0, g));
                continue;
            }
            if (A === null) {
                b = u.parse(C, R);
                if (c) {
                    w = this.K.get(o);
                    I = w.attrs[S];
                    if (I !== void 0) {
                        b = u.parse(C, R);
                        l.push(new SpreadElementPropBindingInstruction(b == null ? new SetPropertyInstruction(C, I.name) : new InterpolationInstruction(b, I.name)));
                        continue;
                    }
                }
                if (b != null) {
                    l.push(new InterpolationInstruction(b, r.m.map(i, S) ?? f(S)));
                } else {
                    switch (S) {
                      case "class":
                        l.push(new SetClassAttributeInstruction(C));
                        break;

                      case "style":
                        l.push(new SetStyleAttributeInstruction(C));
                        break;

                      default:
                        l.push(new SetAttributeInstruction(C, S));
                    }
                }
            } else {
                if (c) {
                    w = this.K.get(o);
                    I = w.attrs[S];
                    if (I !== void 0) {
                        Rt.node = i;
                        Rt.attr = d;
                        Rt.bindable = I;
                        Rt.def = o;
                        l.push(new SpreadElementPropBindingInstruction(A.build(Rt, r.ep, r.m)));
                        continue;
                    }
                }
                Rt.node = i;
                Rt.attr = d;
                Rt.bindable = null;
                Rt.def = null;
                l.push(A.build(Rt, r.ep, r.m));
            }
        }
        resetCommandBuildInfo();
        if (p != null) {
            return p.concat(l);
        }
        return l;
    }
    tt(t, n) {
        const e = [];
        const i = t.attributes;
        const s = n.ep;
        let r = i.length;
        let l = 0;
        let o;
        let c;
        let u;
        let a;
        let h = null;
        let d;
        let m;
        let p;
        let g;
        let w = null;
        let I;
        let y;
        let A;
        let b;
        for (;r > l; ++l) {
            o = i[l];
            c = o.name;
            u = o.value;
            a = n.G.parse(c, u);
            A = a.target;
            b = a.rawValue;
            if (Et[A]) {
                throw createMappedError(702, c);
            }
            w = n.et(a);
            if (w !== null && w.ignoreAttr) {
                Rt.node = t;
                Rt.attr = a;
                Rt.bindable = null;
                Rt.def = null;
                e.push(w.build(Rt, n.ep, n.m));
                continue;
            }
            h = n.it(A);
            if (h !== null) {
                if (h.isTemplateController) {
                    throw createMappedError(703, A);
                }
                p = this.K.get(h);
                y = h.noMultiBindings === false && w === null && hasInlineBindings(b);
                if (y) {
                    m = this.st(t, b, h, n);
                } else {
                    g = p.primary;
                    if (w === null) {
                        I = s.parse(b, R);
                        m = I === null ? b === "" ? [] : [ new SetPropertyInstruction(b, g.name) ] : [ new InterpolationInstruction(I, g.name) ];
                    } else {
                        Rt.node = t;
                        Rt.attr = a;
                        Rt.bindable = g;
                        Rt.def = h;
                        m = [ w.build(Rt, n.ep, n.m) ];
                    }
                }
                t.removeAttribute(c);
                --l;
                --r;
                (d ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? h : h.name, h.aliases != null && h.aliases.includes(A) ? A : void 0, m));
                continue;
            }
            if (w === null) {
                I = s.parse(b, R);
                if (I != null) {
                    t.removeAttribute(c);
                    --l;
                    --r;
                    e.push(new InterpolationInstruction(I, n.m.map(t, A) ?? f(A)));
                } else {
                    switch (c) {
                      case "class":
                        e.push(new SetClassAttributeInstruction(b));
                        break;

                      case "style":
                        e.push(new SetStyleAttributeInstruction(b));
                        break;

                      default:
                        e.push(new SetAttributeInstruction(b, c));
                    }
                }
            } else {
                Rt.node = t;
                Rt.attr = a;
                Rt.bindable = null;
                Rt.def = null;
                e.push(w.build(Rt, n.ep, n.m));
            }
        }
        resetCommandBuildInfo();
        if (d != null) {
            return d.concat(e);
        }
        return e;
    }
    Z(t, n) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.rt(t, n);

              default:
                return this.lt(t, n);
            }

          case 3:
            return this.ot(t, n);

          case 11:
            {
                let e = t.firstChild;
                while (e !== null) {
                    e = this.Z(e, n);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    rt(t, n) {
        const e = t.attributes;
        const i = e.length;
        const s = [];
        const r = n.ep;
        let l = false;
        let o = 0;
        let c;
        let u;
        let a;
        let h;
        let d;
        let m;
        let p;
        let g;
        for (;i > o; ++o) {
            c = e[o];
            a = c.name;
            h = c.value;
            if (a === "to-binding-context") {
                l = true;
                continue;
            }
            u = n.G.parse(a, h);
            m = u.target;
            p = u.rawValue;
            d = n.et(u);
            if (d !== null) {
                if (u.command === "bind") {
                    s.push(new LetBindingInstruction(r.parse(p, x), f(m)));
                } else {
                    throw createMappedError(704, u);
                }
                continue;
            }
            g = r.parse(p, R);
            s.push(new LetBindingInstruction(g === null ? new b(p) : g, f(m)));
        }
        n.rows.push([ new HydrateLetElementInstruction(s, l) ]);
        return this.ct(t, n).nextSibling;
    }
    lt(t, n) {
        const e = t.nextSibling;
        const i = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const r = n.nt(i);
        const l = r !== null;
        const o = l && r.shadowOptions != null;
        const c = r?.capture;
        const u = c != null && typeof c !== "boolean";
        const a = c ? [] : s;
        const h = n.ep;
        const d = this.debug ? p : () => {
            t.removeAttribute(A);
            --I;
            --w;
        };
        let m = t.attributes;
        let g;
        let w = m.length;
        let I = 0;
        let y;
        let A;
        let b;
        let B;
        let S;
        let C;
        let T = null;
        let P = false;
        let E;
        let x;
        let _;
        let k;
        let L;
        let D;
        let H;
        let M = null;
        let F;
        let $;
        let O;
        let V;
        let W = true;
        let N = false;
        let U = false;
        let j = false;
        let q;
        if (i === "slot") {
            if (n.root.def.shadowOptions == null) {
                throw createMappedError(717, n.root.def.name);
            }
            n.root.hasSlot = true;
        }
        if (l) {
            q = {};
            W = r.processContent?.call(r.Type, t, n.p, q);
            m = t.attributes;
            w = m.length;
        }
        for (;w > I; ++I) {
            y = m[I];
            A = y.name;
            b = y.value;
            switch (A) {
              case "as-element":
              case "containerless":
                d();
                if (!N) {
                    N = A === "containerless";
                }
                continue;
            }
            B = n.G.parse(A, b);
            M = n.et(B);
            O = B.target;
            V = B.rawValue;
            if (c && (!u || u && c(O))) {
                if (M != null && M.ignoreAttr) {
                    d();
                    a.push(B);
                    continue;
                }
                U = O !== At && O !== "slot";
                if (U) {
                    F = this.K.get(r);
                    if (F.attrs[O] == null && !n.it(O)?.isTemplateController) {
                        d();
                        a.push(B);
                        continue;
                    }
                }
            }
            if (M?.ignoreAttr) {
                Rt.node = t;
                Rt.attr = B;
                Rt.bindable = null;
                Rt.def = null;
                (S ??= []).push(M.build(Rt, n.ep, n.m));
                d();
                continue;
            }
            if (l) {
                F = this.K.get(r);
                E = F.attrs[O];
                if (E !== void 0) {
                    if (M === null) {
                        D = h.parse(V, R);
                        (C ??= []).push(D == null ? new SetPropertyInstruction(V, E.name) : new InterpolationInstruction(D, E.name));
                    } else {
                        Rt.node = t;
                        Rt.attr = B;
                        Rt.bindable = E;
                        Rt.def = r;
                        (C ??= []).push(M.build(Rt, n.ep, n.m));
                    }
                    d();
                    continue;
                }
            }
            T = n.it(O);
            if (T !== null) {
                F = this.K.get(T);
                P = T.noMultiBindings === false && M === null && hasInlineBindings(V);
                if (P) {
                    _ = this.st(t, V, T, n);
                } else {
                    $ = F.primary;
                    if (M === null) {
                        D = h.parse(V, R);
                        _ = D === null ? V === "" ? [] : [ new SetPropertyInstruction(V, $.name) ] : [ new InterpolationInstruction(D, $.name) ];
                    } else {
                        Rt.node = t;
                        Rt.attr = B;
                        Rt.bindable = $;
                        Rt.def = T;
                        _ = [ M.build(Rt, n.ep, n.m) ];
                    }
                }
                d();
                if (T.isTemplateController) {
                    (k ??= []).push(new HydrateTemplateController(Pt, this.resolveResources ? T : T.name, void 0, _));
                } else {
                    (x ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? T : T.name, T.aliases != null && T.aliases.includes(O) ? O : void 0, _));
                }
                continue;
            }
            if (M === null) {
                D = h.parse(V, R);
                if (D != null) {
                    d();
                    (S ??= []).push(new InterpolationInstruction(D, n.m.map(t, O) ?? f(O)));
                }
                continue;
            }
            Rt.node = t;
            Rt.attr = B;
            Rt.bindable = null;
            Rt.def = null;
            (S ??= []).push(M.build(Rt, n.ep, n.m));
            d();
        }
        resetCommandBuildInfo();
        if (this.ut(t, S) && S != null && S.length > 1) {
            this.ht(t, S);
        }
        if (l) {
            H = new HydrateElementInstruction(this.resolveResources ? r : r.name, C ?? s, null, N, a, q);
        }
        if (S != null || H != null || x != null) {
            g = s.concat(H ?? s, x ?? s, S ?? s);
            j = true;
        }
        let z;
        if (k != null) {
            w = k.length - 1;
            I = w;
            L = k[I];
            let e;
            if (isMarker(t)) {
                e = n.t();
                appendManyToTemplate(e, [ n.ft(), n.dt(Ct), n.dt(Tt) ]);
            } else {
                this.gt(t, n);
                if (t.nodeName === "TEMPLATE") {
                    e = t;
                } else {
                    e = n.t();
                    appendToTemplate(e, t);
                }
            }
            const s = e;
            const c = n.wt(g == null ? [] : [ g ]);
            let u;
            let a;
            let h = false;
            let f;
            let d;
            let m;
            let p;
            let y;
            let A;
            let b = 0, B = 0;
            let S = t.firstChild;
            let C = false;
            if (W !== false) {
                while (S !== null) {
                    a = isElement(S) ? S.getAttribute(At) : null;
                    h = a !== null || l && !o;
                    u = S.nextSibling;
                    if (h) {
                        if (!l) {
                            throw createMappedError(706, a, i);
                        }
                        S.removeAttribute?.(At);
                        C = isTextNode(S) && S.textContent.trim() === "";
                        if (!C) {
                            ((d ??= {})[a || bt] ??= []).push(S);
                        }
                        t.removeChild(S);
                    }
                    S = u;
                }
            }
            if (d != null) {
                f = {};
                for (a in d) {
                    e = n.t();
                    m = d[a];
                    for (b = 0, B = m.length; B > b; ++b) {
                        p = m[b];
                        if (p.nodeName === "TEMPLATE") {
                            if (p.attributes.length > 0) {
                                appendToTemplate(e, p);
                            } else {
                                appendToTemplate(e, p.content);
                            }
                        } else {
                            appendToTemplate(e, p);
                        }
                    }
                    A = n.wt();
                    this.Z(e.content, A);
                    f[a] = {
                        name: Bt(),
                        type: v,
                        template: e,
                        instructions: A.rows,
                        needsCompile: false
                    };
                }
                H.projections = f;
            }
            if (j) {
                if (l && (N || r.containerless)) {
                    this.gt(t, n);
                } else {
                    this.ct(t, n);
                }
            }
            z = !l || !r.containerless && !N && W !== false;
            if (z) {
                if (t.nodeName === St) {
                    this.Z(t.content, c);
                } else {
                    S = t.firstChild;
                    while (S !== null) {
                        S = this.Z(S, c);
                    }
                }
            }
            L.def = {
                name: Bt(),
                type: v,
                template: s,
                instructions: c.rows,
                needsCompile: false
            };
            while (I-- > 0) {
                L = k[I];
                e = n.t();
                y = n.ft();
                appendManyToTemplate(e, [ y, n.dt(Ct), n.dt(Tt) ]);
                L.def = {
                    name: Bt(),
                    type: v,
                    template: e,
                    needsCompile: false,
                    instructions: [ [ k[I + 1] ] ]
                };
            }
            n.rows.push([ L ]);
        } else {
            if (g != null) {
                n.rows.push(g);
            }
            let e = t.firstChild;
            let s;
            let c;
            let u = false;
            let a = null;
            let h;
            let f;
            let d;
            let m;
            let p;
            let w = false;
            let I = 0, y = 0;
            if (W !== false) {
                while (e !== null) {
                    c = isElement(e) ? e.getAttribute(At) : null;
                    u = c !== null || l && !o;
                    s = e.nextSibling;
                    if (u) {
                        if (!l) {
                            throw createMappedError(706, c, i);
                        }
                        e.removeAttribute?.(At);
                        w = isTextNode(e) && e.textContent.trim() === "";
                        if (!w) {
                            ((h ??= {})[c || bt] ??= []).push(e);
                        }
                        t.removeChild(e);
                    }
                    e = s;
                }
            }
            if (h != null) {
                a = {};
                for (c in h) {
                    m = n.t();
                    f = h[c];
                    for (I = 0, y = f.length; y > I; ++I) {
                        d = f[I];
                        if (d.nodeName === St) {
                            if (d.attributes.length > 0) {
                                appendToTemplate(m, d);
                            } else {
                                appendToTemplate(m, d.content);
                            }
                        } else {
                            appendToTemplate(m, d);
                        }
                    }
                    p = n.wt();
                    this.Z(m.content, p);
                    a[c] = {
                        name: Bt(),
                        type: v,
                        template: m,
                        instructions: p.rows,
                        needsCompile: false
                    };
                }
                H.projections = a;
            }
            if (j) {
                if (l && (N || r.containerless)) {
                    this.gt(t, n);
                } else {
                    this.ct(t, n);
                }
            }
            z = !l || !r.containerless && !N && W !== false;
            if (z && t.childNodes.length > 0) {
                e = t.firstChild;
                while (e !== null) {
                    e = this.Z(e, n);
                }
            }
        }
        return e;
    }
    ot(t, n) {
        const e = t.parentNode;
        const i = n.ep.parse(t.textContent, R);
        const s = t.nextSibling;
        let r;
        let l;
        let o;
        let c;
        let u;
        if (i !== null) {
            ({parts: r, expressions: l} = i);
            if (u = r[0]) {
                insertBefore(e, n.It(u), t);
            }
            for (o = 0, c = l.length; c > o; ++o) {
                insertManyBefore(e, t, [ n.ft(), n.It(" ") ]);
                if (u = r[o + 1]) {
                    insertBefore(e, n.It(u), t);
                }
                n.rows.push([ new TextBindingInstruction(l[o]) ]);
            }
            e.removeChild(t);
        }
        return s;
    }
    st(t, n, e, i) {
        const s = this.K.get(e);
        const r = n.length;
        const l = [];
        let o = void 0;
        let c = void 0;
        let u = 0;
        let a = 0;
        let h;
        let f;
        let d;
        let m;
        for (let p = 0; p < r; ++p) {
            a = n.charCodeAt(p);
            if (a === 92) {
                ++p;
            } else if (a === 58) {
                o = n.slice(u, p);
                while (n.charCodeAt(++p) <= 32) ;
                u = p;
                for (;p < r; ++p) {
                    a = n.charCodeAt(p);
                    if (a === 92) {
                        ++p;
                    } else if (a === 59) {
                        c = n.slice(u, p);
                        break;
                    }
                }
                if (c === void 0) {
                    c = n.slice(u);
                }
                f = i.G.parse(o, c);
                d = i.et(f);
                m = s.attrs[f.target];
                if (m == null) {
                    throw createMappedError(707, f.target, e.name);
                }
                if (d === null) {
                    h = i.ep.parse(c, R);
                    l.push(h === null ? new SetPropertyInstruction(c, m.name) : new InterpolationInstruction(h, m.name));
                } else {
                    Rt.node = t;
                    Rt.attr = f;
                    Rt.bindable = m;
                    Rt.def = e;
                    l.push(d.build(Rt, i.ep, i.m));
                }
                while (p < r && n.charCodeAt(++p) <= 32) ;
                u = p;
                o = void 0;
                c = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    Y(t, n) {
        const e = n.root.def.name;
        const i = t;
        const r = g(i.querySelectorAll("template[as-custom-element]"));
        const l = r.length;
        if (l === 0) {
            return;
        }
        if (l === i.childElementCount) {
            throw createMappedError(708, e);
        }
        const o = new Set;
        const c = [];
        for (const t of r) {
            if (t.parentNode !== i) {
                throw createMappedError(709, e);
            }
            const n = processTemplateName(e, t, o);
            const s = t.content;
            const r = g(s.querySelectorAll("bindable"));
            const l = new Set;
            const u = new Set;
            const a = r.reduce(((t, e) => {
                if (e.parentNode !== s) {
                    throw createMappedError(710, n);
                }
                const i = e.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, e, n);
                }
                const r = e.getAttribute("attribute");
                if (r !== null && u.has(r) || l.has(i)) {
                    throw createMappedError(712, l, r);
                } else {
                    if (r !== null) {
                        u.add(r);
                    }
                    l.add(i);
                }
                const o = g(e.attributes).filter((t => !kt.includes(t.name)));
                if (o.length > 0) ;
                e.remove();
                t[i] = {
                    name: i,
                    attribute: r ?? void 0,
                    mode: e.getAttribute("mode") ?? "default"
                };
                return t;
            }), {});
            class LocalDepType {}
            LocalDepType.$au = {
                type: v,
                name: n,
                template: t,
                bindables: a
            };
            Reflect.defineProperty(LocalDepType, "name", {
                value: w(n)
            });
            c.push(LocalDepType);
            i.removeChild(t);
        }
        const u = (n.root.def.dependencies ?? []).concat(n.root.def.Type == null ? s : [ n.root.def.Type ]);
        for (const t of c) {
            t.dependencies = u.concat(c.filter((n => n !== t)));
            n.yt(t);
        }
    }
    ut(t, n) {
        const e = t.nodeName;
        return e === "INPUT" && xt[t.type] === 1 || e === "SELECT" && (t.hasAttribute("multiple") || n?.some((t => t.type === Z && t.to === "multiple")));
    }
    ht(t, n) {
        switch (t.nodeName) {
          case "INPUT":
            {
                const t = n;
                let e = void 0;
                let i = void 0;
                let s = 0;
                let r;
                for (let n = 0; n < t.length && s < 3; n++) {
                    r = t[n];
                    switch (r.to) {
                      case "model":
                      case "value":
                      case "matcher":
                        e = n;
                        s++;
                        break;

                      case "checked":
                        i = n;
                        s++;
                        break;
                    }
                }
                if (i !== void 0 && e !== void 0 && i < e) {
                    [t[e], t[i]] = [ t[i], t[e] ];
                }
                break;
            }

          case "SELECT":
            {
                const t = n;
                let e = 0;
                let i = 0;
                let s = 0;
                let r;
                for (let n = 0; n < t.length && s < 2; ++n) {
                    r = t[n];
                    switch (r.to) {
                      case "multiple":
                        i = n;
                        s++;
                        break;

                      case "value":
                        e = n;
                        s++;
                        break;
                    }
                    if (s === 2 && e < i) {
                        [t[i], t[e]] = [ t[e], t[i] ];
                    }
                }
            }
        }
    }
    ct(t, n) {
        insertBefore(t.parentNode, n.dt("au*"), t);
        return t;
    }
    gt(t, n) {
        if (isMarker(t)) {
            return t;
        }
        const e = t.parentNode;
        const i = n.ft();
        insertManyBefore(e, t, [ i, n.dt(Ct), n.dt(Tt) ]);
        e.removeChild(t);
        return i;
    }
}

TemplateCompiler.register = m(k);

const St = "TEMPLATE";

const Ct = "au-start";

const Tt = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(t, n, e, i, s) {
        this.hasSlot = false;
        this.deps = null;
        const r = e !== null;
        this.c = n;
        this.root = i === null ? this : i;
        this.def = t;
        this.parent = e;
        this.At = r ? e.At : n.get(_t);
        this.X = r ? e.X : n.get(It);
        this.G = r ? e.G : n.get(M);
        this.ep = r ? e.ep : n.get(B);
        this.m = r ? e.m : n.get(L);
        this.bt = r ? e.bt : n.get(I);
        if (typeof (this.p = r ? e.p : n.get(d)).document?.nodeType !== "number") {
            throw new Error("Invalid platform");
        }
        this.localEls = r ? e.localEls : new Set;
        this.rows = s ?? [];
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
        const n = createElement(this.p, t);
        if (t === "template") {
            this.p.document.adoptNode(n.content);
        }
        return n;
    }
    t() {
        return this.h("template");
    }
    nt(t) {
        return this.At.el(this.c, t);
    }
    it(t) {
        return this.At.attr(this.c, t);
    }
    wt(t) {
        return new CompilationContext(this.def, this.c, this, this.root, t);
    }
    et(t) {
        const n = t.command;
        if (n === null) {
            return null;
        }
        return this.At.command(this.c, n);
    }
}

const hasInlineBindings = t => {
    const n = t.length;
    let e = 0;
    let i = 0;
    while (n > i) {
        e = t.charCodeAt(i);
        if (e === 92) {
            ++i;
        } else if (e === 58) {
            return true;
        } else if (e === 36 && t.charCodeAt(i + 1) === 123) {
            return false;
        }
        ++i;
    }
    return false;
};

const resetCommandBuildInfo = () => {
    Rt.node = Rt.attr = Rt.bindable = Rt.def = null;
};

const Pt = {
    name: "unnamed",
    type: v
};

const Rt = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Et = {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
};

const xt = {
    checkbox: 1,
    radio: 1
};

const vt = /*@__PURE__*/ S("IBindablesInfoResolver");

const _t = /*@__PURE__*/ S("IResourceResolver");

const kt = C([ "name", "attribute", "mode" ]);

const Lt = "as-custom-element";

const processTemplateName = (t, n, e) => {
    const i = n.getAttribute(Lt);
    if (i === null || i === "") {
        throw createMappedError(715, t);
    }
    if (e.has(i)) {
        throw createMappedError(716, i, t);
    } else {
        e.add(i);
        n.removeAttribute(Lt);
    }
    return i;
};

const Dt = /*@__PURE__*/ S("ITemplateCompilerHooks");

const Ht = C({
    name: /*@__PURE__*/ e("compiler-hooks"),
    define(t) {
        return i.define(t, (function(t) {
            P(Dt, this).register(t);
        }));
    },
    findAll(t) {
        return t.get(y(Dt));
    }
});

const templateCompilerHooks = (t, n) => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return Ht.define(t);
    }
};

export { U as AtPrefixedTriggerAttributePattern, AttrBindingCommand, AttrSyntax, AttributeBindingInstruction, AttributeParser, $ as AttributePattern, wt as BindingCommand, BindingCommandDefinition, _ as BindingMode, CaptureBindingCommand, ClassBindingCommand, N as ColonPrefixedBindAttributePattern, DefaultBindingCommand, O as DotSeparatedAttributePattern, W as EventAttributePattern, ForBindingCommand, FromViewBindingCommand, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, L as IAttrMapper, M as IAttributeParser, H as IAttributePattern, vt as IBindablesInfoResolver, mt as IInstruction, _t as IResourceResolver, D as ISyntaxInterpreter, k as ITemplateCompiler, Dt as ITemplateCompilerHooks, It as ITemplateElementFactory, dt as InstructionType, InterpolationInstruction, Interpretation, IteratorBindingInstruction, LetBindingInstruction, ListenerBindingInstruction, MultiAttrInstruction, OneTimeBindingCommand, PropertyBindingInstruction, V as RefAttributePattern, RefBindingCommand, RefBindingInstruction, SetAttributeInstruction, SetClassAttributeInstruction, SetPropertyInstruction, SetStyleAttributeInstruction, j as SpreadAttributePattern, SpreadBindingCommand, SpreadBindingInstruction, SpreadElementPropBindingInstruction, StyleBindingCommand, StylePropertyBindingInstruction, SyntaxInterpreter, TemplateCompiler, Ht as TemplateCompilerHooks, TextBindingInstruction, ToViewBindingCommand, TriggerBindingCommand, TwoWayBindingCommand, attributePattern, bindingCommand, templateCompilerHooks };
//# sourceMappingURL=index.mjs.map
