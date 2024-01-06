import { DI as t, IEventAggregator as n, camelCase as e, toArray as i, Registration as s } from "../../../kernel/dist/native-modules/index.mjs";

import { bindingBehavior as r, valueConverter as o, mixinAstEvaluator as a, mixingBindingLimited as c, CustomElement as l, attributePattern as h, bindingCommand as u, renderer as f, AttrSyntax as d, AttributePattern as m, BindingCommand as p, AppTask as g } from "../../../runtime-html/dist/native-modules/index.mjs";

import { ValueConverterExpression as _, nowrap as b, ISignaler as T, connectable as B, CustomExpression as v, astEvaluate as w, astUnbind as I, astBind as C } from "../../../runtime/dist/native-modules/index.mjs";

import x from "i18next";

function __decorate(t, n, e, i) {
    var s = arguments.length, r = s < 3 ? n : i === null ? i = Object.getOwnPropertyDescriptor(n, e) : i, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, n, e, i); else for (var a = t.length - 1; a >= 0; a--) if (o = t[a]) r = (s < 3 ? o(r) : s > 3 ? o(n, e, r) : o(n, e)) || r;
    return s > 3 && r && Object.defineProperty(n, e, r), r;
}

function __param(t, n) {
    return function(e, i) {
        n(e, i, t);
    };
}

const y = {
    I18N_EA_CHANNEL: "i18n:locale:changed",
    I18N_SIGNAL: "aurelia-translation-signal",
    RT_SIGNAL: "aurelia-relativetime-signal"
};

var P;

(function(t) {
    t["translationValueConverterName"] = "t";
    t["dateFormatValueConverterName"] = "df";
    t["numberFormatValueConverterName"] = "nf";
    t["relativeTimeValueConverterName"] = "rt";
})(P || (P = {}));

function createIntlFormatValueConverterExpression(t, n) {
    const e = n.ast.expression;
    if (!(e instanceof _)) {
        const i = new _(e, t, n.ast.args);
        n.ast.expression = i;
    }
}

let M = class DateFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("df", n);
    }
};

M = __decorate([ r("df") ], M);

const A = /*@__PURE__*/ t.createInterface("I18nInitOptions");

const L = /*@__PURE__*/ t.createInterface("I18nextWrapper");

class I18nextWrapper {
    constructor() {
        this.i18next = x;
    }
}

var E;

(function(t) {
    t[t["Second"] = 1e3] = "Second";
    t[t["Minute"] = 6e4] = "Minute";
    t[t["Hour"] = 36e5] = "Hour";
    t[t["Day"] = 864e5] = "Day";
    t[t["Week"] = 6048e5] = "Week";
    t[t["Month"] = 2592e6] = "Month";
    t[t["Year"] = 31536e6] = "Year";
})(E || (E = {}));

class I18nKeyEvaluationResult {
    constructor(t) {
        this.value = void 0;
        const n = /\[([a-z\-, ]*)\]/gi;
        this.attributes = [];
        const e = n.exec(t);
        if (e) {
            t = t.replace(e[0], "");
            this.attributes = e[1].split(",");
        }
        this.key = t;
    }
}

const R = /*@__PURE__*/ t.createInterface("I18N");

let N = class I18nService {
    constructor(t, n, e, i) {
        this.ea = e;
        this.i = new Set;
        this.i18next = t.i18next;
        this.initPromise = this.h(n);
        this.u = i;
    }
    evaluate(t, n) {
        const e = t.split(";");
        const i = [];
        for (const t of e) {
            const e = new I18nKeyEvaluationResult(t);
            const s = e.key;
            const r = this.tr(s, n);
            if (this.options.skipTranslationOnMissingKey && r === s) {
                console.warn(`Couldn't find translation for key: ${s}`);
            } else {
                e.value = r;
                i.push(e);
            }
        }
        return i;
    }
    tr(t, n) {
        return this.i18next.t(t, n);
    }
    getLocale() {
        return this.i18next.language;
    }
    async setLocale(t) {
        const n = this.getLocale();
        const e = {
            oldLocale: n,
            newLocale: t
        };
        await this.i18next.changeLanguage(t);
        this.ea.publish(y.I18N_EA_CHANNEL, e);
        this.i.forEach((t => t.handleLocaleChange(e)));
        this.u.dispatchSignal(y.I18N_SIGNAL);
    }
    createNumberFormat(t, n) {
        return Intl.NumberFormat(n || this.getLocale(), t);
    }
    nf(t, n, e) {
        return this.createNumberFormat(n, e).format(t);
    }
    createDateTimeFormat(t, n) {
        return Intl.DateTimeFormat(n || this.getLocale(), t);
    }
    df(t, n, e) {
        return this.createDateTimeFormat(n, e).format(t);
    }
    uf(t, n) {
        const e = this.nf(1e4 / 3, undefined, n);
        let i = e[1];
        const s = e[5];
        if (i === ".") {
            i = "\\.";
        }
        const r = t.replace(new RegExp(i, "g"), "").replace(/[^\d.,-]/g, "").replace(s, ".");
        return Number(r);
    }
    createRelativeTimeFormat(t, n) {
        return new Intl.RelativeTimeFormat(n || this.getLocale(), t);
    }
    rt(t, n, e) {
        let i = t.getTime() - this.now();
        const s = this.options.rtEpsilon * (i > 0 ? 1 : 0);
        const r = this.createRelativeTimeFormat(n, e);
        let o = i / 31536e6;
        if (Math.abs(o + s) >= 1) {
            return r.format(Math.round(o), "year");
        }
        o = i / 2592e6;
        if (Math.abs(o + s) >= 1) {
            return r.format(Math.round(o), "month");
        }
        o = i / 6048e5;
        if (Math.abs(o + s) >= 1) {
            return r.format(Math.round(o), "week");
        }
        o = i / 864e5;
        if (Math.abs(o + s) >= 1) {
            return r.format(Math.round(o), "day");
        }
        o = i / 36e5;
        if (Math.abs(o + s) >= 1) {
            return r.format(Math.round(o), "hour");
        }
        o = i / 6e4;
        if (Math.abs(o + s) >= 1) {
            return r.format(Math.round(o), "minute");
        }
        i = Math.abs(i) < 1e3 ? 1e3 : i;
        o = i / 1e3;
        return r.format(Math.round(o), "second");
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
        for (const t of this.options.plugins) {
            this.i18next.use(t);
        }
        await this.i18next.init(this.options);
    }
};

__decorate([ b ], N.prototype, "i18next", void 0);

N = __decorate([ __param(0, L), __param(1, A), __param(2, n), __param(3, T) ], N);

let V = class DateFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ y.I18N_SIGNAL ];
    }
    toView(t, n, e) {
        if (!t && t !== 0 || typeof t === "string" && t.trim() === "") {
            return t;
        }
        if (typeof t === "string") {
            const n = Number(t);
            const e = new Date(Number.isInteger(n) ? n : t);
            if (isNaN(e.getTime())) {
                return t;
            }
            t = e;
        }
        return this.i18n.df(t, n, e);
    }
};

V = __decorate([ o("df"), __param(0, R) ], V);

let F = class NumberFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("nf", n);
    }
};

F = __decorate([ r("nf") ], F);

let k = class NumberFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ y.I18N_SIGNAL ];
    }
    toView(t, n, e) {
        if (typeof t !== "number") {
            return t;
        }
        return this.i18n.nf(t, n, e);
    }
};

k = __decorate([ o("nf"), __param(0, R) ], k);

let O = class RelativeTimeBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("rt", n);
    }
};

O = __decorate([ r("rt") ], O);

let D = class RelativeTimeValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ y.I18N_SIGNAL, y.RT_SIGNAL ];
    }
    toView(t, n, e) {
        if (!(t instanceof Date)) {
            return t;
        }
        return this.i18n.rt(t, n, e);
    }
};

D = __decorate([ o("rt"), __param(0, R) ], D);

let j = class TranslationBindingBehavior {
    bind(t, n) {
        const e = n.ast.expression;
        if (!(e instanceof _)) {
            const t = new _(e, "t", n.ast.args);
            n.ast.expression = t;
        }
    }
};

j = __decorate([ r("t") ], j);

const S = [ "textContent", "innerHTML", "prepend", "append" ];

const K = new Map([ [ "text", "textContent" ], [ "html", "innerHTML" ] ]);

const $ = {
    optional: true
};

const H = {
    reusable: false,
    preempt: true
};

class TranslationBinding {
    constructor(t, n, e, i, s) {
        this.isBound = false;
        this._ = S;
        this.T = null;
        this.parameter = null;
        this.boundFn = false;
        this.l = n;
        this.B = t;
        this.target = s;
        this.i18n = n.get(R);
        this.p = i;
        this.I = new Set;
        this.oL = e;
        this.i18n.subscribeLocaleChange(this);
        this.C = i.domWriteQueue;
    }
    static create({parser: t, observerLocator: n, context: e, controller: i, target: s, instruction: r, platform: o, isParameterContext: a}) {
        const c = this.P({
            observerLocator: n,
            context: e,
            controller: i,
            target: s,
            platform: o
        });
        const l = typeof r.from === "string" ? t.parse(r.from, 16) : r.from;
        if (a) {
            c.useParameter(l);
        } else {
            const n = l instanceof v ? t.parse(l.value, 1) : undefined;
            c.ast = n || l;
        }
    }
    static P({observerLocator: t, context: n, controller: e, target: i, platform: s}) {
        let r = e.bindings && e.bindings.find((t => t instanceof TranslationBinding && t.target === i));
        if (!r) {
            r = new TranslationBinding(e, n, t, s, i);
            e.addBinding(r);
        }
        return r;
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        const n = this.ast;
        if (!n) {
            throw new Error("key expression is missing");
        }
        this.s = t;
        this.M = w(n, t, this, this);
        this.A();
        this.parameter?.bind(t);
        this.updateTranslations();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        I(this.ast, this.s, this);
        this.parameter?.unbind();
        this.I.clear();
        if (this.T !== null) {
            this.T.cancel();
            this.T = null;
        }
        this.s = void 0;
        this.obs.clearAll();
    }
    handleChange(t, n) {
        this.obs.version++;
        this.M = w(this.ast, this.s, this, this);
        this.obs.clear();
        this.A();
        this.updateTranslations();
    }
    handleLocaleChange() {
        this.updateTranslations();
    }
    useParameter(t) {
        if (this.parameter != null) {
            throw new Error("This translation parameter has already been specified.");
        }
        this.parameter = new ParameterBinding(this, t, (() => this.updateTranslations()));
    }
    updateTranslations() {
        const t = this.i18n.evaluate(this.M, this.parameter?.value);
        const n = Object.create(null);
        const i = [];
        const s = this.T;
        this.I.clear();
        for (const s of t) {
            const t = s.value;
            const r = this.L(s.attributes);
            for (const s of r) {
                if (this.R(s)) {
                    n[s] = t;
                } else {
                    const n = l.for(this.target, $);
                    const r = n?.viewModel ? this.oL.getAccessor(n.viewModel, e(s)) : this.oL.getAccessor(this.target, s);
                    const o = this.B.state !== 1 && (r.type & 4) > 0;
                    if (o) {
                        i.push(new AccessorUpdateTask(r, t, this.target, s));
                    } else {
                        r.setValue(t, this.target, s);
                    }
                    this.I.add(r);
                }
            }
        }
        let r = false;
        if (Object.keys(n).length > 0) {
            r = this.B.state !== 1;
            if (!r) {
                this.N(n);
            }
        }
        if (i.length > 0 || r) {
            this.T = this.C.queueTask((() => {
                this.T = null;
                for (const t of i) {
                    t.run();
                }
                if (r) {
                    this.N(n);
                }
            }), H);
        }
        s?.cancel();
    }
    L(t) {
        if (t.length === 0) {
            t = this.target.tagName === "IMG" ? [ "src" ] : [ "textContent" ];
        }
        for (const [n, e] of K) {
            const i = t.findIndex((t => t === n));
            if (i > -1) {
                t.splice(i, 1, e);
            }
        }
        return t;
    }
    R(t) {
        return this._.includes(t);
    }
    N(t) {
        const n = i(this.target.childNodes);
        const e = [];
        const s = "au-i18n";
        for (const t of n) {
            if (!Reflect.get(t, s)) {
                e.push(t);
            }
        }
        const r = this.V(t, s, e);
        this.target.innerHTML = "";
        for (const t of i(r.content.childNodes)) {
            this.target.appendChild(t);
        }
    }
    V(t, n, e) {
        const i = this.p.document.createElement("template");
        this.F(i, t.prepend, n);
        if (!this.F(i, t.innerHTML ?? t.textContent, n)) {
            for (const t of e) {
                i.content.append(t);
            }
        }
        this.F(i, t.append, n);
        return i;
    }
    F(t, n, e) {
        if (n !== void 0 && n !== null) {
            const s = this.p.document.createElement("div");
            s.innerHTML = n;
            for (const n of i(s.childNodes)) {
                Reflect.set(n, e, true);
                t.content.append(n);
            }
            return true;
        }
        return false;
    }
    A() {
        const t = this.M ?? (this.M = "");
        const n = typeof t;
        if (n !== "string") {
            throw new Error(`Expected the i18n key to be a string, but got ${t} of type ${n}`);
        }
    }
}

B(TranslationBinding);

a(true)(TranslationBinding);

c(TranslationBinding, (() => "updateTranslations"));

class AccessorUpdateTask {
    constructor(t, n, e, i) {
        this.accessor = t;
        this.v = n;
        this.el = e;
        this.attr = i;
    }
    run() {
        this.accessor.setValue(this.v, this.el, this.attr);
    }
}

class ParameterBinding {
    constructor(t, n, e) {
        this.owner = t;
        this.ast = n;
        this.updater = e;
        this.isBound = false;
        this.boundFn = false;
        this.oL = t.oL;
        this.l = t.l;
    }
    handleChange(t, n) {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this.value = w(this.ast, this.s, this, this);
        this.obs.clear();
        this.updater();
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.s = t;
        C(this.ast, t, this);
        this.value = w(this.ast, t, this, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        I(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

B(ParameterBinding);

a(true)(ParameterBinding);

const W = "tpt";

const z = "t-params.bind";

let G = class TranslationParametersAttributePattern {
    [z](t, n, e) {
        return new d(t, n, "", z);
    }
};

G = __decorate([ h({
    pattern: z,
    symbols: ""
}) ], G);

class TranslationParametersBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = W;
        this.mode = 2;
    }
}

let U = class TranslationParametersBindingCommand {
    constructor() {
        this.type = 0;
    }
    get name() {
        return z;
    }
    build(t, n, i) {
        const s = t.attr;
        let r = s.target;
        if (t.bindable == null) {
            r = i.map(t.node, r) ?? e(r);
        } else {
            r = t.bindable.name;
        }
        return new TranslationParametersBindingInstruction(n.parse(s.rawValue, 16), r);
    }
};

U = __decorate([ u(z) ], U);

let Y = class TranslationParametersBindingRenderer {
    render(t, n, e, i, s, r) {
        TranslationBinding.create({
            parser: s,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: e,
            isParameterContext: true,
            platform: i
        });
    }
};

Y = __decorate([ f(W) ], Y);

const q = "tt";

class TranslationAttributePattern {
    static registerAlias(t) {
        this.prototype[t] = function(n, e, i) {
            return new d(n, e, "", t);
        };
    }
}

class TranslationBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = q;
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
        let s;
        if (t.bindable == null) {
            s = i.map(t.node, t.attr.target) ?? e(t.attr.target);
        } else {
            s = t.bindable.name;
        }
        return new TranslationBindingInstruction(new v(t.attr.rawValue), s);
    }
}

let J = class TranslationBindingRenderer {
    render(t, n, e, i, s, r) {
        TranslationBinding.create({
            parser: s,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: e,
            platform: i
        });
    }
};

J = __decorate([ f(q) ], J);

const Q = "tbt";

class TranslationBindAttributePattern {
    static registerAlias(t) {
        const n = `${t}.bind`;
        this.prototype[n] = function(t, e, i) {
            return new d(t, e, i[1], n);
        };
    }
}

class TranslationBindBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = Q;
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
        let s;
        if (t.bindable == null) {
            s = i.map(t.node, t.attr.target) ?? e(t.attr.target);
        } else {
            s = t.bindable.name;
        }
        return new TranslationBindBindingInstruction(n.parse(t.attr.rawValue, 16), s);
    }
}

let X = class TranslationBindBindingRenderer {
    render(t, n, e, i, s, r) {
        TranslationBinding.create({
            parser: s,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: e,
            platform: i
        });
    }
};

X = __decorate([ f(Q) ], X);

let Z = class TranslationValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ y.I18N_SIGNAL ];
    }
    toView(t, n) {
        return this.i18n.tr(t, n);
    }
};

Z = __decorate([ o("t"), __param(0, R) ], Z);

const tt = [ Z, j ];

function coreComponents(t) {
    const n = t.translationAttributeAliases;
    const e = Array.isArray(n) ? n : [ "t" ];
    const i = [];
    const r = [];
    const o = [];
    const a = [];
    for (const t of e) {
        const n = `${t}.bind`;
        i.push({
            pattern: t,
            symbols: ""
        });
        TranslationAttributePattern.registerAlias(t);
        r.push({
            pattern: n,
            symbols: "."
        });
        TranslationBindAttributePattern.registerAlias(t);
        if (t !== "t") {
            o.push(t);
            a.push(n);
        }
    }
    const c = [ m.define(i, TranslationAttributePattern), p.define({
        name: "t",
        aliases: o
    }, TranslationBindingCommand), J, m.define(r, TranslationBindAttributePattern), p.define({
        name: "t.bind",
        aliases: a
    }, TranslationBindBindingCommand), X, G, U, Y ];
    return {
        register(n) {
            return n.register(s.callback(A, (() => t.initOptions)), g.activating(R, (t => t.initPromise)), s.singleton(L, I18nextWrapper), s.singleton(R, N), ...c, ...tt);
        }
    };
}

const nt = [ V, M ];

const et = [ k, F ];

const it = [ D, O ];

function createI18nConfiguration(t) {
    return {
        optionsProvider: t,
        register(n) {
            const e = {
                initOptions: Object.create(null)
            };
            t(e);
            return n.register(coreComponents(e), ...nt, ...et, ...it);
        },
        customize(n) {
            return createI18nConfiguration(n || t);
        }
    };
}

const st = createI18nConfiguration((() => {}));

export { M as DateFormatBindingBehavior, V as DateFormatValueConverter, R as I18N, st as I18nConfiguration, A as I18nInitOptions, I18nKeyEvaluationResult, N as I18nService, F as NumberFormatBindingBehavior, k as NumberFormatValueConverter, O as RelativeTimeBindingBehavior, D as RelativeTimeValueConverter, y as Signals, TranslationAttributePattern, TranslationBindAttributePattern, TranslationBindBindingCommand, TranslationBindBindingInstruction, X as TranslationBindBindingRenderer, Q as TranslationBindInstructionType, TranslationBinding, j as TranslationBindingBehavior, TranslationBindingCommand, TranslationBindingInstruction, J as TranslationBindingRenderer, q as TranslationInstructionType, G as TranslationParametersAttributePattern, U as TranslationParametersBindingCommand, TranslationParametersBindingInstruction, Y as TranslationParametersBindingRenderer, W as TranslationParametersInstructionType, Z as TranslationValueConverter };

