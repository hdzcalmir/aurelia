import { DI as t, IEventAggregator as n, camelCase as e, toArray as i, Registration as s } from "@aurelia/kernel";

import { BindingMode as r, State as o, bindingBehavior as a, valueConverter as c, mixinAstEvaluator as l, mixingBindingLimited as h, CustomElement as u, attributePattern as f, bindingCommand as d, renderer as m, AttrSyntax as p, AttributePattern as g, BindingCommand as _, AppTask as b } from "@aurelia/runtime-html";

import { ValueConverterExpression as T, nowrap as B, ISignaler as v, connectable as I, CustomExpression as w, astEvaluate as C, astUnbind as x, AccessorType as y, astBind as P } from "@aurelia/runtime";

import M from "i18next";

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

const A = {
    I18N_EA_CHANNEL: "i18n:locale:changed",
    I18N_SIGNAL: "aurelia-translation-signal",
    RT_SIGNAL: "aurelia-relativetime-signal"
};

var L;

(function(t) {
    t["translationValueConverterName"] = "t";
    t["dateFormatValueConverterName"] = "df";
    t["numberFormatValueConverterName"] = "nf";
    t["relativeTimeValueConverterName"] = "rt";
})(L || (L = {}));

function createIntlFormatValueConverterExpression(t, n) {
    const e = n.ast.expression;
    if (!(e instanceof T)) {
        const i = new T(e, t, n.ast.args);
        n.ast.expression = i;
    }
}

const E = "Interpolation";

const N = "IsProperty";

const R = "None";

const V = r.toView;

const F = o.activating;

let k = class DateFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("df", n);
    }
};

k = __decorate([ a("df") ], k);

const O = /*@__PURE__*/ t.createInterface("I18nInitOptions");

const D = /*@__PURE__*/ t.createInterface("I18nextWrapper");

class I18nextWrapper {
    constructor() {
        this.i18next = M;
    }
}

var j;

(function(t) {
    t[t["Second"] = 1e3] = "Second";
    t[t["Minute"] = 6e4] = "Minute";
    t[t["Hour"] = 36e5] = "Hour";
    t[t["Day"] = 864e5] = "Day";
    t[t["Week"] = 6048e5] = "Week";
    t[t["Month"] = 2592e6] = "Month";
    t[t["Year"] = 31536e6] = "Year";
})(j || (j = {}));

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

const S = /*@__PURE__*/ t.createInterface("I18N");

let K = class I18nService {
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
        this.ea.publish(A.I18N_EA_CHANNEL, e);
        this.i.forEach((t => t.handleLocaleChange(e)));
        this.u.dispatchSignal(A.I18N_SIGNAL);
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

__decorate([ B ], K.prototype, "i18next", void 0);

K = __decorate([ __param(0, D), __param(1, O), __param(2, n), __param(3, v) ], K);

let $ = class DateFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ A.I18N_SIGNAL ];
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

$ = __decorate([ c("df"), __param(0, S) ], $);

let H = class NumberFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("nf", n);
    }
};

H = __decorate([ a("nf") ], H);

let W = class NumberFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ A.I18N_SIGNAL ];
    }
    toView(t, n, e) {
        if (typeof t !== "number") {
            return t;
        }
        return this.i18n.nf(t, n, e);
    }
};

W = __decorate([ c("nf"), __param(0, S) ], W);

let z = class RelativeTimeBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("rt", n);
    }
};

z = __decorate([ a("rt") ], z);

let G = class RelativeTimeValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ A.I18N_SIGNAL, A.RT_SIGNAL ];
    }
    toView(t, n, e) {
        if (!(t instanceof Date)) {
            return t;
        }
        return this.i18n.rt(t, n, e);
    }
};

G = __decorate([ c("rt"), __param(0, S) ], G);

let U = class TranslationBindingBehavior {
    bind(t, n) {
        const e = n.ast.expression;
        if (!(e instanceof T)) {
            const t = new T(e, "t", n.ast.args);
            n.ast.expression = t;
        }
    }
};

U = __decorate([ a("t") ], U);

const Y = [ "textContent", "innerHTML", "prepend", "append" ];

const q = new Map([ [ "text", "textContent" ], [ "html", "innerHTML" ] ]);

const J = {
    optional: true
};

const Q = {
    reusable: false,
    preempt: true
};

class TranslationBinding {
    constructor(t, n, e, i, s) {
        this.isBound = false;
        this._ = Y;
        this.T = null;
        this.parameter = null;
        this.boundFn = false;
        this.l = n;
        this.B = t;
        this.target = s;
        this.i18n = n.get(S);
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
        const l = typeof r.from === "string" ? t.parse(r.from, N) : r.from;
        if (a) {
            c.useParameter(l);
        } else {
            const n = l instanceof w ? t.parse(l.value, E) : undefined;
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
        this.M = C(n, t, this, this);
        this.A();
        this.parameter?.bind(t);
        this.updateTranslations();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        x(this.ast, this.s, this);
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
        this.M = C(this.ast, this.s, this, this);
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
                if (this.N(s)) {
                    n[s] = t;
                } else {
                    const n = u.for(this.target, J);
                    const r = n?.viewModel ? this.oL.getAccessor(n.viewModel, e(s)) : this.oL.getAccessor(this.target, s);
                    const o = this.B.state !== F && (r.type & y.Layout) > 0;
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
            r = this.B.state !== F;
            if (!r) {
                this.R(n);
            }
        }
        if (i.length > 0 || r) {
            this.T = this.C.queueTask((() => {
                this.T = null;
                for (const t of i) {
                    t.run();
                }
                if (r) {
                    this.R(n);
                }
            }), Q);
        }
        s?.cancel();
    }
    L(t) {
        if (t.length === 0) {
            t = this.target.tagName === "IMG" ? [ "src" ] : [ "textContent" ];
        }
        for (const [n, e] of q) {
            const i = t.findIndex((t => t === n));
            if (i > -1) {
                t.splice(i, 1, e);
            }
        }
        return t;
    }
    N(t) {
        return this._.includes(t);
    }
    R(t) {
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

I(TranslationBinding);

l(true)(TranslationBinding);

h(TranslationBinding, (() => "updateTranslations"));

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
        this.value = C(this.ast, this.s, this, this);
        this.obs.clear();
        this.updater();
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.s = t;
        P(this.ast, t, this);
        this.value = C(this.ast, t, this, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        x(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

I(ParameterBinding);

l(true)(ParameterBinding);

const X = "tpt";

const Z = "t-params.bind";

let tt = class TranslationParametersAttributePattern {
    [Z](t, n, e) {
        return new p(t, n, "", Z);
    }
};

tt = __decorate([ f({
    pattern: Z,
    symbols: ""
}) ], tt);

class TranslationParametersBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = X;
        this.mode = V;
    }
}

let nt = class TranslationParametersBindingCommand {
    constructor() {
        this.type = R;
    }
    get name() {
        return Z;
    }
    build(t, n, i) {
        const s = t.attr;
        let r = s.target;
        if (t.bindable == null) {
            r = i.map(t.node, r) ?? e(r);
        } else {
            r = t.bindable.name;
        }
        return new TranslationParametersBindingInstruction(n.parse(s.rawValue, N), r);
    }
};

nt = __decorate([ d(Z) ], nt);

let et = class TranslationParametersBindingRenderer {
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

et = __decorate([ m(X) ], et);

const it = "tt";

class TranslationAttributePattern {
    static registerAlias(t) {
        this.prototype[t] = function(n, e, i) {
            return new p(n, e, "", t);
        };
    }
}

class TranslationBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = it;
        this.mode = V;
    }
}

class TranslationBindingCommand {
    constructor() {
        this.type = R;
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
        return new TranslationBindingInstruction(new w(t.attr.rawValue), s);
    }
}

let st = class TranslationBindingRenderer {
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

st = __decorate([ m(it) ], st);

const rt = "tbt";

class TranslationBindAttributePattern {
    static registerAlias(t) {
        const n = `${t}.bind`;
        this.prototype[n] = function(t, e, i) {
            return new p(t, e, i[1], n);
        };
    }
}

class TranslationBindBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = rt;
        this.mode = V;
    }
}

class TranslationBindBindingCommand {
    constructor() {
        this.type = R;
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
        return new TranslationBindBindingInstruction(n.parse(t.attr.rawValue, N), s);
    }
}

let ot = class TranslationBindBindingRenderer {
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

ot = __decorate([ m(rt) ], ot);

let at = class TranslationValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ A.I18N_SIGNAL ];
    }
    toView(t, n) {
        return this.i18n.tr(t, n);
    }
};

at = __decorate([ c("t"), __param(0, S) ], at);

const ct = [ at, U ];

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
    const c = [ g.define(i, TranslationAttributePattern), _.define({
        name: "t",
        aliases: o
    }, TranslationBindingCommand), st, g.define(r, TranslationBindAttributePattern), _.define({
        name: "t.bind",
        aliases: a
    }, TranslationBindBindingCommand), ot, tt, nt, et ];
    return {
        register(n) {
            return n.register(s.callback(O, (() => t.initOptions)), b.activating(S, (t => t.initPromise)), s.singleton(D, I18nextWrapper), s.singleton(S, K), ...c, ...ct);
        }
    };
}

const lt = [ $, k ];

const ht = [ W, H ];

const ut = [ G, z ];

function createI18nConfiguration(t) {
    return {
        optionsProvider: t,
        register(n) {
            const e = {
                initOptions: Object.create(null)
            };
            t(e);
            return n.register(coreComponents(e), ...lt, ...ht, ...ut);
        },
        customize(n) {
            return createI18nConfiguration(n || t);
        }
    };
}

const ft = createI18nConfiguration((() => {}));

export { k as DateFormatBindingBehavior, $ as DateFormatValueConverter, S as I18N, ft as I18nConfiguration, O as I18nInitOptions, I18nKeyEvaluationResult, K as I18nService, H as NumberFormatBindingBehavior, W as NumberFormatValueConverter, z as RelativeTimeBindingBehavior, G as RelativeTimeValueConverter, A as Signals, TranslationAttributePattern, TranslationBindAttributePattern, TranslationBindBindingCommand, TranslationBindBindingInstruction, ot as TranslationBindBindingRenderer, rt as TranslationBindInstructionType, TranslationBinding, U as TranslationBindingBehavior, TranslationBindingCommand, TranslationBindingInstruction, st as TranslationBindingRenderer, it as TranslationInstructionType, tt as TranslationParametersAttributePattern, nt as TranslationParametersBindingCommand, TranslationParametersBindingInstruction, et as TranslationParametersBindingRenderer, X as TranslationParametersInstructionType, at as TranslationValueConverter };
//# sourceMappingURL=index.mjs.map
