import { DI as t, IEventAggregator as n, toArray as i, camelCase as s, Registration as e } from "../kernel/dist/native-modules/index.mjs";

import { bindingBehavior as r, valueConverter as a, mixinAstEvaluator as o, mixingBindingLimited as l, CustomElement as c, attributePattern as h, bindingCommand as u, renderer as f, AttrSyntax as d, AttributePattern as g, BindingCommand as m, AppTask as p } from "../runtime-html/dist/native-modules/index.mjs";

import { ValueConverterExpression as b, ISignaler as T, connectable as B, CustomExpression as v, Interpolation as w, astEvaluate as y, astUnbind as C, astBind as I } from "../runtime/dist/native-modules/index.mjs";

import P from "i18next";

function x(t, n, i, s) {
    var e = arguments.length, r = e < 3 ? n : null === s ? s = Object.getOwnPropertyDescriptor(n, i) : s, a;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, n, i, s); else for (var o = t.length - 1; o >= 0; o--) if (a = t[o]) r = (e < 3 ? a(r) : e > 3 ? a(n, i, r) : a(n, i)) || r;
    return e > 3 && r && Object.defineProperty(n, i, r), r;
}

function M(t, n) {
    return function(i, s) {
        n(i, s, t);
    };
}

var A;

(function(t) {
    t["I18N_EA_CHANNEL"] = "i18n:locale:changed";
    t["I18N_SIGNAL"] = "aurelia-translation-signal";
    t["RT_SIGNAL"] = "aurelia-relativetime-signal";
})(A || (A = {}));

var L;

(function(t) {
    t["translationValueConverterName"] = "t";
    t["dateFormatValueConverterName"] = "df";
    t["numberFormatValueConverterName"] = "nf";
    t["relativeTimeValueConverterName"] = "rt";
})(L || (L = {}));

function R(t, n) {
    const i = n.ast.expression;
    if (!(i instanceof b)) {
        const s = new b(i, t, n.ast.args);
        n.ast.expression = s;
    }
}

let k = class DateFormatBindingBehavior {
    bind(t, n) {
        R("df", n);
    }
};

k = x([ r("df") ], k);

const E = t.createInterface("I18nInitOptions");

const N = t.createInterface("I18nextWrapper");

class I18nextWrapper {
    constructor() {
        this.i18next = P;
    }
}

var O;

(function(t) {
    t[t["Second"] = 1e3] = "Second";
    t[t["Minute"] = 6e4] = "Minute";
    t[t["Hour"] = 36e5] = "Hour";
    t[t["Day"] = 864e5] = "Day";
    t[t["Week"] = 6048e5] = "Week";
    t[t["Month"] = 2592e6] = "Month";
    t[t["Year"] = 31536e6] = "Year";
})(O || (O = {}));

class I18nKeyEvaluationResult {
    constructor(t) {
        this.value = void 0;
        const n = /\[([a-z\-, ]*)\]/gi;
        this.attributes = [];
        const i = n.exec(t);
        if (i) {
            t = t.replace(i[0], "");
            this.attributes = i[1].split(",");
        }
        this.key = t;
    }
}

const V = t.createInterface("I18N");

let _ = class I18nService {
    constructor(t, n, i, s) {
        this.ea = i;
        this.i = new Set;
        this.i18next = t.i18next;
        this.initPromise = this.h(n);
        this.u = s;
    }
    evaluate(t, n) {
        const i = t.split(";");
        const s = [];
        for (const t of i) {
            const i = new I18nKeyEvaluationResult(t);
            const e = i.key;
            const r = this.tr(e, n);
            if (this.options.skipTranslationOnMissingKey && r === e) console.warn(`Couldn't find translation for key: ${e}`); else {
                i.value = r;
                s.push(i);
            }
        }
        return s;
    }
    tr(t, n) {
        return this.i18next.t(t, n);
    }
    getLocale() {
        return this.i18next.language;
    }
    async setLocale(t) {
        const n = this.getLocale();
        const i = {
            oldLocale: n,
            newLocale: t
        };
        await this.i18next.changeLanguage(t);
        this.ea.publish("i18n:locale:changed", i);
        this.i.forEach((t => t.handleLocaleChange(i)));
        this.u.dispatchSignal("aurelia-translation-signal");
    }
    createNumberFormat(t, n) {
        return Intl.NumberFormat(n || this.getLocale(), t);
    }
    nf(t, n, i) {
        return this.createNumberFormat(n, i).format(t);
    }
    createDateTimeFormat(t, n) {
        return Intl.DateTimeFormat(n || this.getLocale(), t);
    }
    df(t, n, i) {
        return this.createDateTimeFormat(n, i).format(t);
    }
    uf(t, n) {
        const i = this.nf(1e4 / 3, void 0, n);
        let s = i[1];
        const e = i[5];
        if ("." === s) s = "\\.";
        const r = t.replace(new RegExp(s, "g"), "").replace(/[^\d.,-]/g, "").replace(e, ".");
        return Number(r);
    }
    createRelativeTimeFormat(t, n) {
        return new Intl.RelativeTimeFormat(n || this.getLocale(), t);
    }
    rt(t, n, i) {
        let s = t.getTime() - this.now();
        const e = this.options.rtEpsilon * (s > 0 ? 1 : 0);
        const r = this.createRelativeTimeFormat(n, i);
        let a = s / 31536e6;
        if (Math.abs(a + e) >= 1) return r.format(Math.round(a), "year");
        a = s / 2592e6;
        if (Math.abs(a + e) >= 1) return r.format(Math.round(a), "month");
        a = s / 6048e5;
        if (Math.abs(a + e) >= 1) return r.format(Math.round(a), "week");
        a = s / 864e5;
        if (Math.abs(a + e) >= 1) return r.format(Math.round(a), "day");
        a = s / 36e5;
        if (Math.abs(a + e) >= 1) return r.format(Math.round(a), "hour");
        a = s / 6e4;
        if (Math.abs(a + e) >= 1) return r.format(Math.round(a), "minute");
        s = Math.abs(s) < 1e3 ? 1e3 : s;
        a = s / 1e3;
        return r.format(Math.round(a), "second");
    }
    subscribeLocaleChange(t) {
        this.i.add(t);
    }
    now() {
        return (new Date).getTime();
    }
    async h(t) {
        const n = {
            lng: "en",
            fallbackLng: [ "en" ],
            debug: false,
            plugins: [],
            rtEpsilon: .01,
            skipTranslationOnMissingKey: false
        };
        this.options = {
            ...n,
            ...t
        };
        for (const t of this.options.plugins) this.i18next.use(t);
        await this.i18next.init(this.options);
    }
};

_ = x([ M(0, N), M(1, E), M(2, n), M(3, T) ], _);

let D = class DateFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n, i) {
        if (!t && 0 !== t || "string" === typeof t && "" === t.trim()) return t;
        if ("string" === typeof t) {
            const n = Number(t);
            const i = new Date(Number.isInteger(n) ? n : t);
            if (isNaN(i.getTime())) return t;
            t = i;
        }
        return this.i18n.df(t, n, i);
    }
};

D = x([ a("df"), M(0, V) ], D);

let F = class NumberFormatBindingBehavior {
    bind(t, n) {
        R("nf", n);
    }
};

F = x([ r("nf") ], F);

let j = class NumberFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n, i) {
        if ("number" !== typeof t) return t;
        return this.i18n.nf(t, n, i);
    }
};

j = x([ a("nf"), M(0, V) ], j);

let K = class RelativeTimeBindingBehavior {
    bind(t, n) {
        R("rt", n);
    }
};

K = x([ r("rt") ], K);

let $ = class RelativeTimeValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal", "aurelia-relativetime-signal" ];
    }
    toView(t, n, i) {
        if (!(t instanceof Date)) return t;
        return this.i18n.rt(t, n, i);
    }
};

$ = x([ a("rt"), M(0, V) ], $);

let S = class TranslationBindingBehavior {
    bind(t, n) {
        const i = n.ast.expression;
        if (!(i instanceof b)) {
            const t = new b(i, "t", n.ast.args);
            n.ast.expression = t;
        }
    }
};

S = x([ r("t") ], S);

const W = [ "textContent", "innerHTML", "prepend", "append" ];

const z = new Map([ [ "text", "textContent" ], [ "html", "innerHTML" ] ]);

const H = {
    optional: true
};

const U = {
    reusable: false,
    preempt: true
};

class TranslationBinding {
    constructor(t, n, i, s, e) {
        this.isBound = false;
        this.T = W;
        this.B = null;
        this.parameter = null;
        this.boundFn = false;
        this.l = n;
        this.C = t;
        this.target = e;
        this.i18n = n.get(V);
        this.p = s;
        this.I = new Set;
        this.oL = i;
        this.i18n.subscribeLocaleChange(this);
        this.P = s.domWriteQueue;
    }
    static create({parser: t, observerLocator: n, context: i, controller: s, target: e, instruction: r, platform: a, isParameterContext: o}) {
        const l = this.M({
            observerLocator: n,
            context: i,
            controller: s,
            target: e,
            platform: a
        });
        const c = "string" === typeof r.from ? t.parse(r.from, 16) : r.from;
        if (o) l.useParameter(c); else {
            const n = c instanceof v ? t.parse(c.value, 1) : void 0;
            l.ast = n || c;
        }
    }
    static M({observerLocator: t, context: n, controller: i, target: s, platform: e}) {
        let r = i.bindings && i.bindings.find((t => t instanceof TranslationBinding && t.target === s));
        if (!r) {
            r = new TranslationBinding(i, n, t, e, s);
            i.addBinding(r);
        }
        return r;
    }
    bind(t) {
        if (this.isBound) return;
        if (!this.ast) throw new Error("key expression is missing");
        this.s = t;
        this.A = this.ast instanceof w;
        this.L = y(this.ast, t, this, this);
        this.R();
        this.parameter?.bind(t);
        this.updateTranslations();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        C(this.ast, this.s, this);
        this.parameter?.unbind();
        this.I.clear();
        if (null !== this.B) {
            this.B.cancel();
            this.B = null;
        }
        this.s = void 0;
        this.obs.clearAll();
    }
    handleChange(t, n) {
        this.obs.version++;
        this.L = this.A ? y(this.ast, this.s, this, this) : t;
        this.obs.clear();
        this.R();
        this.updateTranslations();
    }
    handleLocaleChange() {
        this.updateTranslations();
    }
    useParameter(t) {
        if (null != this.parameter) throw new Error("This translation parameter has already been specified.");
        this.parameter = new ParameterBinding(this, t, (() => this.updateTranslations()));
    }
    updateTranslations() {
        const t = this.i18n.evaluate(this.L, this.parameter?.value);
        const n = Object.create(null);
        const i = [];
        const s = this.B;
        this.I.clear();
        for (const s of t) {
            const t = s.value;
            const e = this.N(s.attributes);
            for (const s of e) if (this.O(s)) n[s] = t; else {
                const n = c.for(this.target, H);
                const e = n?.viewModel ? this.oL.getAccessor(n.viewModel, s) : this.oL.getAccessor(this.target, s);
                const r = 1 !== this.C.state && (4 & e.type) > 0;
                if (r) i.push(new AccessorUpdateTask(e, t, this.target, s)); else e.setValue(t, this.target, s);
                this.I.add(e);
            }
        }
        let e = false;
        if (Object.keys(n).length > 0) {
            e = 1 !== this.C.state;
            if (!e) this.V(n);
        }
        if (i.length > 0 || e) this.B = this.P.queueTask((() => {
            this.B = null;
            for (const t of i) t.run();
            if (e) this.V(n);
        }), U);
        s?.cancel();
    }
    N(t) {
        if (0 === t.length) t = "IMG" === this.target.tagName ? [ "src" ] : [ "textContent" ];
        for (const [n, i] of z) {
            const s = t.findIndex((t => t === n));
            if (s > -1) t.splice(s, 1, i);
        }
        return t;
    }
    O(t) {
        return this.T.includes(t);
    }
    V(t) {
        const n = i(this.target.childNodes);
        const s = [];
        const e = "au-i18n";
        for (const t of n) if (!Reflect.get(t, e)) s.push(t);
        const r = this._(t, e, s);
        this.target.innerHTML = "";
        for (const t of i(r.content.childNodes)) this.target.appendChild(t);
    }
    _(t, n, i) {
        const s = this.p.document.createElement("template");
        this.F(s, t.prepend, n);
        if (!this.F(s, t.innerHTML ?? t.textContent, n)) for (const t of i) s.content.append(t);
        this.F(s, t.append, n);
        return s;
    }
    F(t, n, s) {
        if (void 0 !== n && null !== n) {
            const e = this.p.document.createElement("div");
            e.innerHTML = n;
            for (const n of i(e.childNodes)) {
                Reflect.set(n, s, true);
                t.content.append(n);
            }
            return true;
        }
        return false;
    }
    R() {
        const t = this.L ?? (this.L = "");
        const n = typeof t;
        if ("string" !== n) throw new Error(`Expected the i18n key to be a string, but got ${t} of type ${n}`);
    }
}

B(TranslationBinding);

o(true)(TranslationBinding);

l(TranslationBinding, (() => "updateTranslations"));

class AccessorUpdateTask {
    constructor(t, n, i, s) {
        this.accessor = t;
        this.v = n;
        this.el = i;
        this.attr = s;
    }
    run() {
        this.accessor.setValue(this.v, this.el, this.attr);
    }
}

class ParameterBinding {
    constructor(t, n, i) {
        this.owner = t;
        this.ast = n;
        this.updater = i;
        this.isBound = false;
        this.boundFn = false;
        this.oL = t.oL;
        this.l = t.l;
    }
    handleChange(t, n) {
        if (!this.isBound) return;
        this.obs.version++;
        this.value = y(this.ast, this.s, this, this);
        this.obs.clear();
        this.updater();
    }
    bind(t) {
        if (this.isBound) return;
        this.s = t;
        I(this.ast, t, this);
        this.value = y(this.ast, t, this, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        C(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

B(ParameterBinding);

o(true)(ParameterBinding);

const G = "tpt";

const Y = "t-params.bind";

let q = class TranslationParametersAttributePattern {
    [Y](t, n, i) {
        return new d(t, n, "", Y);
    }
};

q = x([ h({
    pattern: Y,
    symbols: ""
}) ], q);

class TranslationParametersBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = G;
        this.mode = 2;
    }
}

let J = class TranslationParametersBindingCommand {
    constructor() {
        this.type = 0;
    }
    get name() {
        return Y;
    }
    build(t, n, i) {
        const e = t.attr;
        let r = e.target;
        if (null == t.bindable) r = i.map(t.node, r) ?? s(r); else r = t.bindable.property;
        return new TranslationParametersBindingInstruction(n.parse(e.rawValue, 16), r);
    }
};

J = x([ u(Y) ], J);

let Q = class TranslationParametersBindingRenderer {
    render(t, n, i, s, e, r) {
        TranslationBinding.create({
            parser: e,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: i,
            isParameterContext: true,
            platform: s
        });
    }
};

Q = x([ f(G) ], Q);

const X = "tt";

class TranslationAttributePattern {
    static registerAlias(t) {
        this.prototype[t] = function(n, i, s) {
            return new d(n, i, "", t);
        };
    }
}

class TranslationBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = X;
        this.mode = 2;
    }
}

class TranslationBindingCommand {
    constructor() {
        this.type = 0;
    }
    get name() {
        return "t";
    }
    build(t, n, i) {
        let e;
        if (null == t.bindable) e = i.map(t.node, t.attr.target) ?? s(t.attr.target); else e = t.bindable.property;
        return new TranslationBindingInstruction(new v(t.attr.rawValue), e);
    }
}

let Z = class TranslationBindingRenderer {
    render(t, n, i, s, e, r) {
        TranslationBinding.create({
            parser: e,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: i,
            platform: s
        });
    }
};

Z = x([ f(X) ], Z);

const tt = "tbt";

class TranslationBindAttributePattern {
    static registerAlias(t) {
        const n = `${t}.bind`;
        this.prototype[n] = function(t, i, s) {
            return new d(t, i, s[1], n);
        };
    }
}

class TranslationBindBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = tt;
        this.mode = 2;
    }
}

class TranslationBindBindingCommand {
    constructor() {
        this.type = 0;
    }
    get name() {
        return "t-bind";
    }
    build(t, n, i) {
        let e;
        if (null == t.bindable) e = i.map(t.node, t.attr.target) ?? s(t.attr.target); else e = t.bindable.property;
        return new TranslationBindBindingInstruction(n.parse(t.attr.rawValue, 16), e);
    }
}

let nt = class TranslationBindBindingRenderer {
    render(t, n, i, s, e, r) {
        TranslationBinding.create({
            parser: e,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: i,
            platform: s
        });
    }
};

nt = x([ f(tt) ], nt);

let it = class TranslationValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n) {
        return this.i18n.tr(t, n);
    }
};

it = x([ a("t"), M(0, V) ], it);

const st = [ it, S ];

function et(t) {
    const n = t.translationAttributeAliases;
    const i = Array.isArray(n) ? n : [ "t" ];
    const s = [];
    const r = [];
    const a = [];
    const o = [];
    for (const t of i) {
        const n = `${t}.bind`;
        s.push({
            pattern: t,
            symbols: ""
        });
        TranslationAttributePattern.registerAlias(t);
        r.push({
            pattern: n,
            symbols: "."
        });
        TranslationBindAttributePattern.registerAlias(t);
        if ("t" !== t) {
            a.push(t);
            o.push(n);
        }
    }
    const l = [ g.define(s, TranslationAttributePattern), m.define({
        name: "t",
        aliases: a
    }, TranslationBindingCommand), Z, g.define(r, TranslationBindAttributePattern), m.define({
        name: "t.bind",
        aliases: o
    }, TranslationBindBindingCommand), nt, q, J, Q ];
    return {
        register(n) {
            return n.register(e.callback(E, (() => t.initOptions)), p.activating(V, (t => t.initPromise)), e.singleton(N, I18nextWrapper), e.singleton(V, _), ...l, ...st);
        }
    };
}

const rt = [ D, k ];

const at = [ j, F ];

const ot = [ $, K ];

function lt(t) {
    return {
        optionsProvider: t,
        register(n) {
            const i = {
                initOptions: Object.create(null)
            };
            t(i);
            return n.register(et(i), ...rt, ...at, ...ot);
        },
        customize(n) {
            return lt(n || t);
        }
    };
}

const ct = lt((() => {}));

export { k as DateFormatBindingBehavior, D as DateFormatValueConverter, V as I18N, ct as I18nConfiguration, E as I18nInitOptions, I18nKeyEvaluationResult, _ as I18nService, F as NumberFormatBindingBehavior, j as NumberFormatValueConverter, K as RelativeTimeBindingBehavior, $ as RelativeTimeValueConverter, A as Signals, TranslationAttributePattern, TranslationBindAttributePattern, TranslationBindBindingCommand, TranslationBindBindingInstruction, nt as TranslationBindBindingRenderer, tt as TranslationBindInstructionType, TranslationBinding, S as TranslationBindingBehavior, TranslationBindingCommand, TranslationBindingInstruction, Z as TranslationBindingRenderer, X as TranslationInstructionType, q as TranslationParametersAttributePattern, J as TranslationParametersBindingCommand, TranslationParametersBindingInstruction, Q as TranslationParametersBindingRenderer, G as TranslationParametersInstructionType, it as TranslationValueConverter };

