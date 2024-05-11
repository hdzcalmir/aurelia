import { DI as t, Registration as n, getResourceKeyFor as e, Registrable as i, emptyArray as s, resolve as r, IContainer as l, firstDefined as o, mergeArrays as u, Protocol as c, resourceBaseName as a, resource as h, camelCase as d, IPlatform as f, createImplementationRegister as m, noop as p, toArray as g, pascalCase as w, ILogger as I, allResources as y } from "../../../kernel/dist/native-modules/index.mjs";

import { Metadata as A } from "../../../metadata/dist/native-modules/index.mjs";

import { PrimitiveLiteralExpression as b, IExpressionParser as B } from "../../../expression-parser/dist/native-modules/index.mjs";

const isString = t => typeof t === "string";

const S = t.createInterface;

const C = Object.freeze;

const {aliasTo: T, singleton: P} = n;

const R = "Interpolation";

const E = "IsFunction";

const v = "IsProperty";

const x = "custom-element";

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
        this.M = [];
        this.V = null;
        this._ = false;
        this.L = n;
    }
    findChild(t) {
        const n = this.M;
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
            this.M.push(i);
            if (t.repeat) {
                i.M.push(i);
            }
        }
        return i;
    }
    findMatches(t, n) {
        const e = [];
        const i = this.M;
        const s = i.length;
        let r = 0;
        let l = null;
        let o = 0;
        let u = 0;
        for (;o < s; ++o) {
            l = i[o];
            if (l.charSpec.has(t)) {
                e.push(l);
                r = l.L.length;
                u = 0;
                if (l.charSpec.isSymbol) {
                    for (;u < r; ++u) {
                        n.next(l.L[u]);
                    }
                } else {
                    for (;u < r; ++u) {
                        n.append(l.L[u], t);
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
        const n = this.H = t.length;
        const e = this.$ = [];
        let i = 0;
        for (;n > i; ++i) {
            e.push(new CharSpec(t[i], false, false, false));
        }
    }
    eachChar(t) {
        const n = this.H;
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

const D = /*@__PURE__*/ S("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.O = new AttrParsingState(null);
        this.W = [ this.O ];
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
        let u;
        let c = 0;
        let a;
        while (n > c) {
            e = this.O;
            i = t[c];
            s = i.pattern;
            r = new SegmentTypes;
            l = this.N(i, r);
            o = l.length;
            u = t => e = e.append(t, s);
            for (a = 0; o > a; ++a) {
                l[a].eachChar(u);
            }
            e.V = r;
            e._ = true;
            ++c;
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
        let u = "";
        while (l < s) {
            u = i.charAt(l);
            if (r.length === 0 || !r.includes(u)) {
                if (l === o) {
                    if (u === "P" && i.slice(l, l + 4) === "PART") {
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
    const e = t.V;
    const i = n.V;
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

const M = /*@__PURE__*/ S("IAttributePattern");

const V = /*@__PURE__*/ S("IAttributeParser", (t => t.singleton(AttributeParser)));

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

const getAllPatternDefinitions = t => H.get(t) ?? s;

const H = new WeakMap;

const $ = /*@__PURE__*/ C({
    name: e("attribute-pattern"),
    define(t, n) {
        H.set(n, t);
        return i.define(n, (t => {
            P(M, n).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(M)
});

const F = /*@__PURE__*/ $.define([ {
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

const O = /*@__PURE__*/ $.define([ {
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

const j = A.get;

A.has;

const q = A.define;

const z = "ra";

const G = "rb";

const J = "rc";

const K = "rd";

const Q = "re";

const X = "rf";

const Y = "rg";

const Z = "ri";

const tt = "rj";

const nt = "rk";

const et = "rl";

const it = "ha";

const st = "hb";

const rt = "hc";

const lt = "hd";

const ot = "he";

const ut = "hf";

const ct = "hg";

const at = "hs";

const ht = "hp";

const dt = "svb";

const ft = /*@__PURE__*/ C({
    hydrateElement: z,
    hydrateAttribute: G,
    hydrateTemplateController: J,
    hydrateLetElement: K,
    setProperty: Q,
    interpolation: X,
    propertyBinding: Y,
    letBinding: Z,
    refBinding: tt,
    iteratorBinding: nt,
    multiAttr: et,
    textBinding: it,
    listenerBinding: st,
    attributeBinding: rt,
    stylePropertyBinding: lt,
    setAttribute: ot,
    setClassAttribute: ut,
    setStyleAttribute: ct,
    spreadTransferedBinding: at,
    spreadElementProp: ht,
    spreadValueBinding: dt
});

const mt = /*@__PURE__*/ S("Instruction");

class InterpolationInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = X;
    }
}

class PropertyBindingInstruction {
    constructor(t, n, e) {
        this.from = t;
        this.to = n;
        this.mode = e;
        this.type = Y;
    }
}

class IteratorBindingInstruction {
    constructor(t, n, e) {
        this.forOf = t;
        this.to = n;
        this.props = e;
        this.type = nt;
    }
}

class RefBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = tt;
    }
}

class SetPropertyInstruction {
    constructor(t, n) {
        this.value = t;
        this.to = n;
        this.type = Q;
    }
}

class MultiAttrInstruction {
    constructor(t, n, e) {
        this.value = t;
        this.to = n;
        this.command = e;
        this.type = et;
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
        this.type = z;
    }
}

class HydrateAttributeInstruction {
    constructor(t, n, e) {
        this.res = t;
        this.alias = n;
        this.props = e;
        this.type = G;
    }
}

class HydrateTemplateController {
    constructor(t, n, e, i) {
        this.def = t;
        this.res = n;
        this.alias = e;
        this.props = i;
        this.type = J;
    }
}

class HydrateLetElementInstruction {
    constructor(t, n) {
        this.instructions = t;
        this.toBindingContext = n;
        this.type = K;
    }
}

class LetBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = Z;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = it;
    }
}

class ListenerBindingInstruction {
    constructor(t, n, e, i) {
        this.from = t;
        this.to = n;
        this.capture = e;
        this.modifier = i;
        this.type = st;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = lt;
    }
}

class SetAttributeInstruction {
    constructor(t, n) {
        this.value = t;
        this.to = n;
        this.type = ot;
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
        this.type = ct;
    }
}

class AttributeBindingInstruction {
    constructor(t, n, e) {
        this.attr = t;
        this.from = n;
        this.to = e;
        this.type = rt;
    }
}

class SpreadTransferedBindingInstruction {
    constructor() {
        this.type = at;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instruction = t;
        this.type = ht;
    }
}

class SpreadValueBindingInstruction {
    constructor(t, n) {
        this.target = t;
        this.from = n;
        this.type = dt;
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
        return new BindingCommandDefinition(n, o(getCommandAnnotation(n, "name"), e), u(getCommandAnnotation(n, "aliases"), i.aliases, n.aliases), getCommandKeyFrom(e));
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

const getCommandAnnotation = (t, n) => j(c.annotation.keyFor(n), t);

const wt = /*@__PURE__*/ (() => {
    const t = "__au_static_resource__";
    const getDefinitionFromStaticAu = (n, e, i) => {
        let s = j(t, n);
        if (s == null) {
            if (n.$au?.type === e) {
                s = i(n.$au, n);
                q(s, n, t);
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
            q(e, i, gt, a);
            return i;
        },
        getAnnotation: getCommandAnnotation,
        find(t, n) {
            const e = t.find(pt, n);
            return e == null ? null : j(gt, e) ?? getDefinitionFromStaticAu(e, pt, BindingCommandDefinition.create) ?? null;
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
        r = r === "" ? d(s) : r;
        if (t.bindable == null) {
            s = e.map(t.node, s) ?? d(s);
        } else {
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(r, v), s, 1);
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
        r = r === "" ? d(s) : r;
        if (t.bindable == null) {
            s = e.map(t.node, s) ?? d(s);
        } else {
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(r, v), s, 2);
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
        r = r === "" ? d(s) : r;
        if (t.bindable == null) {
            s = e.map(t.node, s) ?? d(s);
        } else {
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(r, v), s, 4);
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
        r = r === "" ? d(s) : r;
        if (t.bindable == null) {
            s = e.map(t.node, s) ?? d(s);
        } else {
            s = t.bindable.name;
        }
        return new PropertyBindingInstruction(n.parse(r, v), s, 6);
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
        let r = i.rawValue;
        let l = i.target;
        let o;
        let u;
        r = r === "" ? d(l) : r;
        if (s == null) {
            u = e.isTwoWay(t.node, l) ? 6 : 2;
            l = e.map(t.node, l) ?? d(l);
        } else {
            o = t.def.defaultBindingMode ?? 0;
            u = s.mode === 0 || s.mode == null ? o == null || o === 0 ? 2 : o : s.mode;
            l = s.name;
        }
        return new PropertyBindingInstruction(n.parse(r, v), l, isString(u) ? _[u] ?? 0 : u);
    }
}

DefaultBindingCommand.$au = {
    type: pt,
    name: "bind"
};

class ForBindingCommand {
    constructor() {
        this.G = r(V);
    }
    get ignoreAttr() {
        return false;
    }
    build(t, n) {
        const e = t.bindable === null ? d(t.attr.target) : t.bindable.name;
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
        const e = t.attr;
        const i = e.target;
        let s = e.rawValue;
        s = s === "" ? d(i) : s;
        return new AttributeBindingInstruction(i, n.parse(s, v), i);
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
        return new AttributeBindingInstruction("style", n.parse(t.attr.rawValue, v), t.attr.target);
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
        return new AttributeBindingInstruction("class", n.parse(t.attr.rawValue, v), t.attr.target);
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
        return new RefBindingInstruction(n.parse(t.attr.rawValue, v), t.attr.target);
    }
}

RefBindingCommand.$au = {
    type: pt,
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
    type: pt,
    name: "spread"
};

const It = /*@__PURE__*/ S("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const yt = {};

class TemplateElementFactory {
    constructor() {
        this.p = r(f);
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

const At = "au-start";

const bt = "au-end";

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

const Bt = "au-slot";

const St = "default";

const Ct = (t => () => `anonymous-${++t}`)(0);

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    compile(t, n) {
        if (t.template == null || t.needsCompile === false) {
            return t;
        }
        const e = new CompilationContext(t, n, null, null, void 0);
        const i = isString(t.template) || !t.enhance ? e.K.createTemplate(t.template) : t.template;
        const r = i.nodeName === Tt && i.content != null;
        const l = r ? i.content : i;
        const o = Mt.findAll(n);
        const u = o.length;
        let c = 0;
        if (u > 0) {
            while (u > c) {
                o[c].compiling?.(i);
                ++c;
            }
        }
        if (i.hasAttribute(Lt)) {
            throw createMappedError(701, t);
        }
        this.X(l, e);
        this.Y(l, e);
        const a = {
            ...t,
            name: t.name || Ct(),
            dependencies: (t.dependencies ?? s).concat(e.deps ?? s),
            instructions: e.rows,
            surrogates: r ? this.Z(i, e) : s,
            template: i,
            hasSlots: e.hasSlot,
            needsCompile: false
        };
        return a;
    }
    compileSpread(t, n, e, i, s) {
        const r = new CompilationContext(t, e, null, null, void 0);
        const l = [];
        const o = s ?? r.tt(i.nodeName.toLowerCase());
        const u = o !== null;
        const c = r.ep;
        const a = n.length;
        let h = 0;
        let f;
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
            f = n[h];
            S = f.target;
            C = f.rawValue;
            if (S === "...$attrs") {
                l.push(new SpreadTransferedBindingInstruction);
                continue;
            }
            A = r.nt(f);
            if (A !== null && A.ignoreAttr) {
                Rt.node = i;
                Rt.attr = f;
                Rt.bindable = null;
                Rt.def = null;
                l.push(A.build(Rt, r.ep, r.m));
                continue;
            }
            if (u) {
                w = r.et(o);
                I = w.attrs[S];
                if (I !== void 0) {
                    if (A == null) {
                        b = c.parse(C, R);
                        l.push(new SpreadElementPropBindingInstruction(b == null ? new SetPropertyInstruction(C, I.name) : new InterpolationInstruction(b, I.name)));
                    } else {
                        Rt.node = i;
                        Rt.attr = f;
                        Rt.bindable = I;
                        Rt.def = o;
                        l.push(new SpreadElementPropBindingInstruction(A.build(Rt, r.ep, r.m)));
                    }
                    continue;
                }
            }
            m = r.it(S);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, S);
                }
                w = r.et(m);
                B = m.noMultiBindings === false && A === null && hasInlineBindings(C);
                if (B) {
                    g = this.st(i, C, m, r);
                } else {
                    y = w.primary;
                    if (A === null) {
                        b = c.parse(C, R);
                        g = [ b === null ? new SetPropertyInstruction(C, y.name) : new InterpolationInstruction(b, y.name) ];
                    } else {
                        Rt.node = i;
                        Rt.attr = f;
                        Rt.bindable = y;
                        Rt.def = m;
                        g = [ A.build(Rt, r.ep, r.m) ];
                    }
                }
                (p ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(S) ? S : void 0, g));
                continue;
            }
            if (A == null) {
                b = c.parse(C, R);
                if (b != null) {
                    l.push(new InterpolationInstruction(b, r.m.map(i, S) ?? d(S)));
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
                Rt.node = i;
                Rt.attr = f;
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
    Z(t, n) {
        const e = [];
        const i = t.attributes;
        const s = n.ep;
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
        let I;
        let y;
        let A;
        let b;
        for (;r > l; ++l) {
            o = i[l];
            u = o.name;
            c = o.value;
            a = n.G.parse(u, c);
            A = a.target;
            b = a.rawValue;
            if (Et[A]) {
                throw createMappedError(702, u);
            }
            w = n.nt(a);
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
                p = n.et(h);
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
                t.removeAttribute(u);
                --l;
                --r;
                (f ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? h : h.name, h.aliases != null && h.aliases.includes(A) ? A : void 0, m));
                continue;
            }
            if (w === null) {
                I = s.parse(b, R);
                if (I != null) {
                    t.removeAttribute(u);
                    --l;
                    --r;
                    e.push(new InterpolationInstruction(I, n.m.map(t, A) ?? d(A)));
                } else {
                    switch (u) {
                      case "class":
                        e.push(new SetClassAttributeInstruction(b));
                        break;

                      case "style":
                        e.push(new SetStyleAttributeInstruction(b));
                        break;

                      default:
                        e.push(new SetAttributeInstruction(b, u));
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
        if (f != null) {
            return f.concat(e);
        }
        return e;
    }
    Y(t, n) {
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
                    e = this.Y(e, n);
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
        let u;
        let c;
        let a;
        let h;
        let f;
        let m;
        let p;
        let g;
        for (;i > o; ++o) {
            u = e[o];
            a = u.name;
            h = u.value;
            if (a === "to-binding-context") {
                l = true;
                continue;
            }
            c = n.G.parse(a, h);
            m = c.target;
            p = c.rawValue;
            f = n.nt(c);
            if (f !== null) {
                if (c.command === "bind") {
                    s.push(new LetBindingInstruction(r.parse(p, v), d(m)));
                } else {
                    throw createMappedError(704, c);
                }
                continue;
            }
            g = r.parse(p, R);
            s.push(new LetBindingInstruction(g === null ? new b(p) : g, d(m)));
        }
        n.rows.push([ new HydrateLetElementInstruction(s, l) ]);
        return this.ut(t, n).nextSibling;
    }
    lt(t, n) {
        const e = t.nextSibling;
        const i = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const r = n.tt(i);
        const l = r !== null;
        const o = l && r.shadowOptions != null;
        const u = r?.capture;
        const c = u != null && typeof u !== "boolean";
        const a = u ? [] : s;
        const h = n.ep;
        const f = this.debug ? p : () => {
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
        let v;
        let _;
        let k;
        let L;
        let D;
        let M;
        let V = null;
        let H;
        let $;
        let F;
        let O;
        let W = true;
        let N = false;
        let U = false;
        let j = false;
        let q;
        let z = 0;
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
                f();
                N = N || A === "containerless";
                continue;
            }
            B = n.G.parse(A, b);
            V = n.nt(B);
            F = B.target;
            O = B.rawValue;
            if (u && (!c || c && u(F))) {
                if (V != null && V.ignoreAttr) {
                    f();
                    a.push(B);
                    continue;
                }
                U = F !== Bt && F !== "slot" && ((z = F.indexOf("...")) === -1 || z === 0 && F === "...$attrs");
                if (U) {
                    H = n.et(r);
                    if (H.attrs[F] == null && !n.it(F)?.isTemplateController) {
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
            if (V?.ignoreAttr) {
                Rt.node = t;
                Rt.attr = B;
                Rt.bindable = null;
                Rt.def = null;
                (S ??= []).push(V.build(Rt, n.ep, n.m));
                f();
                continue;
            }
            if (F.indexOf("...") === 0) {
                if (l && (F = F.slice(3)) !== "$element") {
                    (C ??= []).push(new SpreadValueBindingInstruction("$bindables", F === "$bindables" ? O : F));
                    f();
                    continue;
                }
                throw createMappedError(720, F);
            }
            if (l) {
                H = n.et(r);
                E = H.attrs[F];
                if (E !== void 0) {
                    if (V === null) {
                        D = h.parse(O, R);
                        (C ??= []).push(D == null ? new SetPropertyInstruction(O, E.name) : new InterpolationInstruction(D, E.name));
                    } else {
                        Rt.node = t;
                        Rt.attr = B;
                        Rt.bindable = E;
                        Rt.def = r;
                        (C ??= []).push(V.build(Rt, n.ep, n.m));
                    }
                    f();
                    continue;
                }
                if (F === "$bindables") {
                    if (V != null) {
                        Rt.node = t;
                        Rt.attr = B;
                        Rt.bindable = null;
                        Rt.def = r;
                        {
                            (C ??= []).push(V.build(Rt, n.ep, n.m));
                        }
                    }
                    f();
                    continue;
                }
            }
            if (F === "$bindables") {
                throw createMappedError(721, t.nodeName, F, O);
            }
            T = n.it(F);
            if (T !== null) {
                H = n.et(T);
                P = T.noMultiBindings === false && V === null && hasInlineBindings(O);
                if (P) {
                    _ = this.st(t, O, T, n);
                } else {
                    $ = H.primary;
                    if (V === null) {
                        D = h.parse(O, R);
                        _ = D === null ? O === "" ? [] : [ new SetPropertyInstruction(O, $.name) ] : [ new InterpolationInstruction(D, $.name) ];
                    } else {
                        Rt.node = t;
                        Rt.attr = B;
                        Rt.bindable = $;
                        Rt.def = T;
                        _ = [ V.build(Rt, n.ep, n.m) ];
                    }
                }
                f();
                if (T.isTemplateController) {
                    (k ??= []).push(new HydrateTemplateController(Pt, this.resolveResources ? T : T.name, void 0, _));
                } else {
                    (v ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? T : T.name, T.aliases != null && T.aliases.includes(F) ? F : void 0, _));
                }
                continue;
            }
            if (V === null) {
                D = h.parse(O, R);
                if (D != null) {
                    f();
                    (S ??= []).push(new InterpolationInstruction(D, n.m.map(t, F) ?? d(F)));
                }
                continue;
            }
            Rt.node = t;
            Rt.attr = B;
            Rt.bindable = null;
            Rt.def = null;
            (S ??= []).push(V.build(Rt, n.ep, n.m));
            f();
        }
        resetCommandBuildInfo();
        if (this.ct(t, S) && S != null && S.length > 1) {
            this.ht(t, S);
        }
        if (l) {
            M = new HydrateElementInstruction(this.resolveResources ? r : r.name, C ?? s, null, N, a, q);
        }
        if (S != null || M != null || v != null) {
            g = s.concat(M ?? s, v ?? s, S ?? s);
            j = true;
        }
        let G;
        if (k != null) {
            w = k.length - 1;
            I = w;
            L = k[I];
            let e;
            if (isMarker(t)) {
                e = n.t();
                appendManyToTemplate(e, [ n.dt(), n.ft(At), n.ft(bt) ]);
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
            const u = n.wt(g == null ? [] : [ g ]);
            let c;
            let a;
            let h = false;
            let d;
            let f;
            let m;
            let p;
            let y;
            let A;
            let b = 0, B = 0;
            let S = t.firstChild;
            let C = false;
            if (W !== false) {
                while (S !== null) {
                    a = isElement(S) ? S.getAttribute(Bt) : null;
                    h = a !== null || l && !o;
                    c = S.nextSibling;
                    if (h) {
                        if (!l) {
                            throw createMappedError(706, a, i);
                        }
                        S.removeAttribute?.(Bt);
                        C = isTextNode(S) && S.textContent.trim() === "";
                        if (!C) {
                            ((f ??= {})[a || St] ??= []).push(S);
                        }
                        t.removeChild(S);
                    }
                    S = c;
                }
            }
            if (f != null) {
                d = {};
                for (a in f) {
                    e = n.t();
                    m = f[a];
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
                    this.Y(e.content, A);
                    d[a] = {
                        name: Ct(),
                        type: x,
                        template: e,
                        instructions: A.rows,
                        needsCompile: false
                    };
                }
                M.projections = d;
            }
            if (j) {
                if (l && (N || r.containerless)) {
                    this.gt(t, n);
                } else {
                    this.ut(t, n);
                }
            }
            G = !l || !r.containerless && !N && W !== false;
            if (G) {
                if (t.nodeName === Tt) {
                    this.Y(t.content, u);
                } else {
                    S = t.firstChild;
                    while (S !== null) {
                        S = this.Y(S, u);
                    }
                }
            }
            L.def = {
                name: Ct(),
                type: x,
                template: s,
                instructions: u.rows,
                needsCompile: false
            };
            while (I-- > 0) {
                L = k[I];
                e = n.t();
                y = n.dt();
                appendManyToTemplate(e, [ y, n.ft(At), n.ft(bt) ]);
                L.def = {
                    name: Ct(),
                    type: x,
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
            let u;
            let c = false;
            let a = null;
            let h;
            let d;
            let f;
            let m;
            let p;
            let w = false;
            let I = 0, y = 0;
            if (W !== false) {
                while (e !== null) {
                    u = isElement(e) ? e.getAttribute(Bt) : null;
                    c = u !== null || l && !o;
                    s = e.nextSibling;
                    if (c) {
                        if (!l) {
                            throw createMappedError(706, u, i);
                        }
                        e.removeAttribute?.(Bt);
                        w = isTextNode(e) && e.textContent.trim() === "";
                        if (!w) {
                            ((h ??= {})[u || St] ??= []).push(e);
                        }
                        t.removeChild(e);
                    }
                    e = s;
                }
            }
            if (h != null) {
                a = {};
                for (u in h) {
                    m = n.t();
                    d = h[u];
                    for (I = 0, y = d.length; y > I; ++I) {
                        f = d[I];
                        if (f.nodeName === Tt) {
                            if (f.attributes.length > 0) {
                                appendToTemplate(m, f);
                            } else {
                                appendToTemplate(m, f.content);
                            }
                        } else {
                            appendToTemplate(m, f);
                        }
                    }
                    p = n.wt();
                    this.Y(m.content, p);
                    a[u] = {
                        name: Ct(),
                        type: x,
                        template: m,
                        instructions: p.rows,
                        needsCompile: false
                    };
                }
                M.projections = a;
            }
            if (j) {
                if (l && (N || r.containerless)) {
                    this.gt(t, n);
                } else {
                    this.ut(t, n);
                }
            }
            G = !l || !r.containerless && !N && W !== false;
            if (G && t.childNodes.length > 0) {
                e = t.firstChild;
                while (e !== null) {
                    e = this.Y(e, n);
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
        let u;
        let c;
        if (i !== null) {
            ({parts: r, expressions: l} = i);
            if (c = r[0]) {
                insertBefore(e, n.It(c), t);
            }
            for (o = 0, u = l.length; u > o; ++o) {
                insertManyBefore(e, t, [ n.dt(), n.It(" ") ]);
                if (c = r[o + 1]) {
                    insertBefore(e, n.It(c), t);
                }
                n.rows.push([ new TextBindingInstruction(l[o]) ]);
            }
            e.removeChild(t);
        }
        return s;
    }
    st(t, n, e, i) {
        const s = i.et(e);
        const r = n.length;
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
            a = n.charCodeAt(p);
            if (a === 92) {
                ++p;
            } else if (a === 58) {
                o = n.slice(c, p);
                while (n.charCodeAt(++p) <= 32) ;
                c = p;
                for (;p < r; ++p) {
                    a = n.charCodeAt(p);
                    if (a === 92) {
                        ++p;
                    } else if (a === 59) {
                        u = n.slice(c, p);
                        break;
                    }
                }
                if (u === void 0) {
                    u = n.slice(c);
                }
                d = i.G.parse(o, u);
                f = i.nt(d);
                m = s.attrs[d.target];
                if (m == null) {
                    throw createMappedError(707, d.target, e.name);
                }
                if (f === null) {
                    h = i.ep.parse(u, R);
                    l.push(h === null ? new SetPropertyInstruction(u, m.name) : new InterpolationInstruction(h, m.name));
                } else {
                    Rt.node = t;
                    Rt.attr = d;
                    Rt.bindable = m;
                    Rt.def = e;
                    l.push(f.build(Rt, i.ep, i.m));
                }
                while (p < r && n.charCodeAt(++p) <= 32) ;
                c = p;
                o = void 0;
                u = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    X(t, n) {
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
        const u = [];
        for (const t of r) {
            if (t.parentNode !== i) {
                throw createMappedError(709, e);
            }
            const n = processTemplateName(e, t, o);
            const s = t.content;
            const r = g(s.querySelectorAll("bindable"));
            const l = new Set;
            const c = new Set;
            const a = r.reduce(((t, e) => {
                if (e.parentNode !== s) {
                    throw createMappedError(710, n);
                }
                const i = e.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, e, n);
                }
                const r = e.getAttribute("attribute");
                if (r !== null && c.has(r) || l.has(i)) {
                    throw createMappedError(712, l, r);
                } else {
                    if (r !== null) {
                        c.add(r);
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
                type: x,
                name: n,
                template: t,
                bindables: a
            };
            Reflect.defineProperty(LocalDepType, "name", {
                value: w(n)
            });
            u.push(LocalDepType);
            i.removeChild(t);
        }
        const c = (n.root.def.dependencies ?? []).concat(n.root.def.Type == null ? s : [ n.root.def.Type ]);
        for (const t of u) {
            t.dependencies = c.concat(u.filter((n => n !== t)));
            n.yt(t);
        }
    }
    ct(t, n) {
        const e = t.nodeName;
        return e === "INPUT" && vt[t.type] === 1 || e === "SELECT" && (t.hasAttribute("multiple") || n?.some((t => t.type === Y && t.to === "multiple")));
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
    ut(t, n) {
        insertBefore(t.parentNode, n.ft("au*"), t);
        return t;
    }
    gt(t, n) {
        if (isMarker(t)) {
            return t;
        }
        const e = t.parentNode;
        const i = n.dt();
        insertManyBefore(e, t, [ i, n.ft(At), n.ft(bt) ]);
        e.removeChild(t);
        return i;
    }
}

TemplateCompiler.register = m(k);

const Tt = "TEMPLATE";

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
        this.At = r ? e.At : n.get(xt);
        this.bt = r ? e.bt : n.get(_t);
        this.K = r ? e.K : n.get(It);
        this.G = r ? e.G : n.get(V);
        this.ep = r ? e.ep : n.get(B);
        this.m = r ? e.m : n.get(L);
        this.Bt = r ? e.Bt : n.get(I);
        if (typeof (this.p = r ? e.p : n.get(f)).document?.nodeType !== "number") {
            throw createMappedError(722);
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
        return this.p.document.createTextNode(t);
    }
    ft(t) {
        return this.p.document.createComment(t);
    }
    dt() {
        return this.ft("au*");
    }
    h(t) {
        const n = this.p.document.createElement(t);
        if (t === "template") {
            this.p.document.adoptNode(n.content);
        }
        return n;
    }
    t() {
        return this.h("template");
    }
    tt(t) {
        return this.At.el(this.c, t);
    }
    it(t) {
        return this.At.attr(this.c, t);
    }
    et(t) {
        return this.At.bindables(t);
    }
    wt(t) {
        return new CompilationContext(this.def, this.c, this, this.root, t);
    }
    nt(t) {
        const n = t.command;
        if (n === null) {
            return null;
        }
        return this.bt.get(this.c, n);
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
    type: x
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

const vt = {
    checkbox: 1,
    radio: 1
};

const xt = /*@__PURE__*/ S("IResourceResolver");

const _t = /*@__PURE__*/ S("IBindingCommandResolver", (t => {
    class DefaultBindingCommandResolver {
        constructor() {
            this.j = new WeakMap;
        }
        get(t, n) {
            let e = this.j.get(t);
            if (!e) {
                this.j.set(t, e = {});
            }
            return n in e ? e[n] : e[n] = wt.get(t, n);
        }
    }
    return t.singleton(DefaultBindingCommandResolver);
}));

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

const Mt = C({
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
        return Mt.define(t);
    }
};

export { U as AtPrefixedTriggerAttributePattern, AttrBindingCommand, AttrSyntax, AttributeBindingInstruction, AttributeParser, $ as AttributePattern, wt as BindingCommand, BindingCommandDefinition, _ as BindingMode, CaptureBindingCommand, ClassBindingCommand, N as ColonPrefixedBindAttributePattern, DefaultBindingCommand, F as DotSeparatedAttributePattern, W as EventAttributePattern, ForBindingCommand, FromViewBindingCommand, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, L as IAttrMapper, V as IAttributeParser, M as IAttributePattern, _t as IBindingCommandResolver, mt as IInstruction, xt as IResourceResolver, D as ISyntaxInterpreter, k as ITemplateCompiler, Dt as ITemplateCompilerHooks, It as ITemplateElementFactory, ft as InstructionType, InterpolationInstruction, Interpretation, IteratorBindingInstruction, LetBindingInstruction, ListenerBindingInstruction, MultiAttrInstruction, OneTimeBindingCommand, PropertyBindingInstruction, O as RefAttributePattern, RefBindingCommand, RefBindingInstruction, SetAttributeInstruction, SetClassAttributeInstruction, SetPropertyInstruction, SetStyleAttributeInstruction, SpreadElementPropBindingInstruction, SpreadTransferedBindingInstruction, SpreadValueBindingCommand, SpreadValueBindingInstruction, StyleBindingCommand, StylePropertyBindingInstruction, SyntaxInterpreter, TemplateCompiler, Mt as TemplateCompilerHooks, TextBindingInstruction, ToViewBindingCommand, TriggerBindingCommand, TwoWayBindingCommand, attributePattern, bindingCommand, Ct as generateElementName, templateCompilerHooks };

