import { DI as t, IEventAggregator as n, toArray as i, camelCase as e, Registration as s } from "../kernel/dist/native-modules/index.mjs";

import { bindingBehavior as r, valueConverter as a, mixinAstEvaluator as o, mixingBindingLimited as c, CustomElement as l, attributePattern as h, bindingCommand as u, renderer as f, AttrSyntax as d, AttributePattern as m, BindingCommand as g, AppTask as p } from "../runtime-html/dist/native-modules/index.mjs";

import { ValueConverterExpression as b, nowrap as _, ISignaler as T, connectable as B, CustomExpression as v, Interpolation as w, astEvaluate as C, astUnbind as I, astBind as x } from "../runtime/dist/native-modules/index.mjs";

import y from "i18next";

function __decorate(t, n, i, e) {
    var s = arguments.length, r = s < 3 ? n : e === null ? e = Object.getOwnPropertyDescriptor(n, i) : e, a;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, n, i, e); else for (var o = t.length - 1; o >= 0; o--) if (a = t[o]) r = (s < 3 ? a(r) : s > 3 ? a(n, i, r) : a(n, i)) || r;
    return s > 3 && r && Object.defineProperty(n, i, r), r;
}

function __param(t, n) {
    return function(i, e) {
        n(i, e, t);
    };
}

var P;

(function(t) {
    t["I18N_EA_CHANNEL"] = "i18n:locale:changed";
    t["I18N_SIGNAL"] = "aurelia-translation-signal";
    t["RT_SIGNAL"] = "aurelia-relativetime-signal";
})(P || (P = {}));

var M;

(function(t) {
    t["translationValueConverterName"] = "t";
    t["dateFormatValueConverterName"] = "df";
    t["numberFormatValueConverterName"] = "nf";
    t["relativeTimeValueConverterName"] = "rt";
})(M || (M = {}));

function createIntlFormatValueConverterExpression(t, n) {
    const i = n.ast.expression;
    if (!(i instanceof b)) {
        const e = new b(i, t, n.ast.args);
        n.ast.expression = e;
    }
}

let A = class DateFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("df", n);
    }
};

A = __decorate([ r("df") ], A);

const L = /*@__PURE__*/ t.createInterface("I18nInitOptions");

const R = /*@__PURE__*/ t.createInterface("I18nextWrapper");

class I18nextWrapper {
    constructor() {
        this.i18next = y;
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
        const i = n.exec(t);
        if (i) {
            t = t.replace(i[0], "");
            this.attributes = i[1].split(",");
        }
        this.key = t;
    }
}

const V = /*@__PURE__*/ t.createInterface("I18N");

let F = class I18nService {
    constructor(t, n, i, e) {
        this.ea = i;
        this.i = new Set;
        this.i18next = t.i18next;
        this.initPromise = this.h(n);
        this.u = e;
    }
    evaluate(t, n) {
        const i = t.split(";");
        const e = [];
        for (const t of i) {
            const i = new I18nKeyEvaluationResult(t);
            const s = i.key;
            const r = this.tr(s, n);
            if (this.options.skipTranslationOnMissingKey && r === s) {
                console.warn(`Couldn't find translation for key: ${s}`);
            } else {
                i.value = r;
                e.push(i);
            }
        }
        return e;
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
        const i = this.nf(1e4 / 3, undefined, n);
        let e = i[1];
        const s = i[5];
        if (e === ".") {
            e = "\\.";
        }
        const r = t.replace(new RegExp(e, "g"), "").replace(/[^\d.,-]/g, "").replace(s, ".");
        return Number(r);
    }
    createRelativeTimeFormat(t, n) {
        return new Intl.RelativeTimeFormat(n || this.getLocale(), t);
    }
    rt(t, n, i) {
        let e = t.getTime() - this.now();
        const s = this.options.rtEpsilon * (e > 0 ? 1 : 0);
        const r = this.createRelativeTimeFormat(n, i);
        let a = e / 31536e6;
        if (Math.abs(a + s) >= 1) {
            return r.format(Math.round(a), "year");
        }
        a = e / 2592e6;
        if (Math.abs(a + s) >= 1) {
            return r.format(Math.round(a), "month");
        }
        a = e / 6048e5;
        if (Math.abs(a + s) >= 1) {
            return r.format(Math.round(a), "week");
        }
        a = e / 864e5;
        if (Math.abs(a + s) >= 1) {
            return r.format(Math.round(a), "day");
        }
        a = e / 36e5;
        if (Math.abs(a + s) >= 1) {
            return r.format(Math.round(a), "hour");
        }
        a = e / 6e4;
        if (Math.abs(a + s) >= 1) {
            return r.format(Math.round(a), "minute");
        }
        e = Math.abs(e) < 1e3 ? 1e3 : e;
        a = e / 1e3;
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
        for (const t of this.options.plugins) {
            this.i18next.use(t);
        }
        await this.i18next.init(this.options);
    }
};

__decorate([ _ ], F.prototype, "i18next", void 0);

F = __decorate([ __param(0, R), __param(1, L), __param(2, n), __param(3, T) ], F);

let k = class DateFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n, i) {
        if (!t && t !== 0 || typeof t === "string" && t.trim() === "") {
            return t;
        }
        if (typeof t === "string") {
            const n = Number(t);
            const i = new Date(Number.isInteger(n) ? n : t);
            if (isNaN(i.getTime())) {
                return t;
            }
            t = i;
        }
        return this.i18n.df(t, n, i);
    }
};

k = __decorate([ a("df"), __param(0, V) ], k);

let N = class NumberFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("nf", n);
    }
};

N = __decorate([ r("nf") ], N);

let O = class NumberFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n, i) {
        if (typeof t !== "number") {
            return t;
        }
        return this.i18n.nf(t, n, i);
    }
};

O = __decorate([ a("nf"), __param(0, V) ], O);

let D = class RelativeTimeBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("rt", n);
    }
};

D = __decorate([ r("rt") ], D);

let j = class RelativeTimeValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal", "aurelia-relativetime-signal" ];
    }
    toView(t, n, i) {
        if (!(t instanceof Date)) {
            return t;
        }
        return this.i18n.rt(t, n, i);
    }
};

j = __decorate([ a("rt"), __param(0, V) ], j);

let K = class TranslationBindingBehavior {
    bind(t, n) {
        const i = n.ast.expression;
        if (!(i instanceof b)) {
            const t = new b(i, "t", n.ast.args);
            n.ast.expression = t;
        }
    }
};

K = __decorate([ r("t") ], K);

const $ = [ "textContent", "innerHTML", "prepend", "append" ];

const S = new Map([ [ "text", "textContent" ], [ "html", "innerHTML" ] ]);

const W = {
    optional: true
};

const z = {
    reusable: false,
    preempt: true
};

class TranslationBinding {
    constructor(t, n, i, e, s) {
        this.isBound = false;
        this._ = $;
        this.T = null;
        this.parameter = null;
        this.boundFn = false;
        this.l = n;
        this.B = t;
        this.target = s;
        this.i18n = n.get(V);
        this.p = e;
        this.C = new Set;
        this.oL = i;
        this.i18n.subscribeLocaleChange(this);
        this.I = e.domWriteQueue;
    }
    static create({parser: t, observerLocator: n, context: i, controller: e, target: s, instruction: r, platform: a, isParameterContext: o}) {
        const c = this.P({
            observerLocator: n,
            context: i,
            controller: e,
            target: s,
            platform: a
        });
        const l = typeof r.from === "string" ? t.parse(r.from, 16) : r.from;
        if (o) {
            c.useParameter(l);
        } else {
            const n = l instanceof v ? t.parse(l.value, 1) : undefined;
            c.ast = n || l;
        }
    }
    static P({observerLocator: t, context: n, controller: i, target: e, platform: s}) {
        let r = i.bindings && i.bindings.find((t => t instanceof TranslationBinding && t.target === e));
        if (!r) {
            r = new TranslationBinding(i, n, t, s, e);
            i.addBinding(r);
        }
        return r;
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        if (!this.ast) {
            throw new Error("key expression is missing");
        }
        this.s = t;
        this.M = this.ast instanceof w;
        this.A = C(this.ast, t, this, this);
        this.L();
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
        this.C.clear();
        if (this.T !== null) {
            this.T.cancel();
            this.T = null;
        }
        this.s = void 0;
        this.obs.clearAll();
    }
    handleChange(t, n) {
        this.obs.version++;
        this.A = this.M ? C(this.ast, this.s, this, this) : t;
        this.obs.clear();
        this.L();
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
        const t = this.i18n.evaluate(this.A, this.parameter?.value);
        const n = Object.create(null);
        const i = [];
        const e = this.T;
        this.C.clear();
        for (const e of t) {
            const t = e.value;
            const s = this.R(e.attributes);
            for (const e of s) {
                if (this.V(e)) {
                    n[e] = t;
                } else {
                    const n = l.for(this.target, W);
                    const s = n?.viewModel ? this.oL.getAccessor(n.viewModel, e) : this.oL.getAccessor(this.target, e);
                    const r = this.B.state !== 1 && (s.type & 4) > 0;
                    if (r) {
                        i.push(new AccessorUpdateTask(s, t, this.target, e));
                    } else {
                        s.setValue(t, this.target, e);
                    }
                    this.C.add(s);
                }
            }
        }
        let s = false;
        if (Object.keys(n).length > 0) {
            s = this.B.state !== 1;
            if (!s) {
                this.F(n);
            }
        }
        if (i.length > 0 || s) {
            this.T = this.I.queueTask((() => {
                this.T = null;
                for (const t of i) {
                    t.run();
                }
                if (s) {
                    this.F(n);
                }
            }), z);
        }
        e?.cancel();
    }
    R(t) {
        if (t.length === 0) {
            t = this.target.tagName === "IMG" ? [ "src" ] : [ "textContent" ];
        }
        for (const [n, i] of S) {
            const e = t.findIndex((t => t === n));
            if (e > -1) {
                t.splice(e, 1, i);
            }
        }
        return t;
    }
    V(t) {
        return this._.includes(t);
    }
    F(t) {
        const n = i(this.target.childNodes);
        const e = [];
        const s = "au-i18n";
        for (const t of n) {
            if (!Reflect.get(t, s)) {
                e.push(t);
            }
        }
        const r = this.N(t, s, e);
        this.target.innerHTML = "";
        for (const t of i(r.content.childNodes)) {
            this.target.appendChild(t);
        }
    }
    N(t, n, i) {
        const e = this.p.document.createElement("template");
        this.O(e, t.prepend, n);
        if (!this.O(e, t.innerHTML ?? t.textContent, n)) {
            for (const t of i) {
                e.content.append(t);
            }
        }
        this.O(e, t.append, n);
        return e;
    }
    O(t, n, e) {
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
    L() {
        const t = this.A ?? (this.A = "");
        const n = typeof t;
        if (n !== "string") {
            throw new Error(`Expected the i18n key to be a string, but got ${t} of type ${n}`);
        }
    }
}

B(TranslationBinding);

o(true)(TranslationBinding);

c(TranslationBinding, (() => "updateTranslations"));

class AccessorUpdateTask {
    constructor(t, n, i, e) {
        this.accessor = t;
        this.v = n;
        this.el = i;
        this.attr = e;
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
        x(this.ast, t, this);
        this.value = C(this.ast, t, this, this);
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

o(true)(ParameterBinding);

const H = "tpt";

const U = "t-params.bind";

let G = class TranslationParametersAttributePattern {
    [U](t, n, i) {
        return new d(t, n, "", U);
    }
};

G = __decorate([ h({
    pattern: U,
    symbols: ""
}) ], G);

class TranslationParametersBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = H;
        this.mode = 2;
    }
}

let Y = class TranslationParametersBindingCommand {
    constructor() {
        this.type = 0;
    }
    get name() {
        return U;
    }
    build(t, n, i) {
        const s = t.attr;
        let r = s.target;
        if (t.bindable == null) {
            r = i.map(t.node, r) ?? e(r);
        } else {
            r = t.bindable.property;
        }
        return new TranslationParametersBindingInstruction(n.parse(s.rawValue, 16), r);
    }
};

Y = __decorate([ u(U) ], Y);

let q = class TranslationParametersBindingRenderer {
    render(t, n, i, e, s, r) {
        TranslationBinding.create({
            parser: s,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: i,
            isParameterContext: true,
            platform: e
        });
    }
};

q = __decorate([ f(H) ], q);

const J = "tt";

class TranslationAttributePattern {
    static registerAlias(t) {
        this.prototype[t] = function(n, i, e) {
            return new d(n, i, "", t);
        };
    }
}

class TranslationBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = J;
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
            s = t.bindable.property;
        }
        return new TranslationBindingInstruction(new v(t.attr.rawValue), s);
    }
}

let Q = class TranslationBindingRenderer {
    render(t, n, i, e, s, r) {
        TranslationBinding.create({
            parser: s,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: i,
            platform: e
        });
    }
};

Q = __decorate([ f(J) ], Q);

const X = "tbt";

class TranslationBindAttributePattern {
    static registerAlias(t) {
        const n = `${t}.bind`;
        this.prototype[n] = function(t, i, e) {
            return new d(t, i, e[1], n);
        };
    }
}

class TranslationBindBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = X;
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
            s = t.bindable.property;
        }
        return new TranslationBindBindingInstruction(n.parse(t.attr.rawValue, 16), s);
    }
}

let Z = class TranslationBindBindingRenderer {
    render(t, n, i, e, s, r) {
        TranslationBinding.create({
            parser: s,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: i,
            platform: e
        });
    }
};

Z = __decorate([ f(X) ], Z);

let tt = class TranslationValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n) {
        return this.i18n.tr(t, n);
    }
};

tt = __decorate([ a("t"), __param(0, V) ], tt);

const nt = [ tt, K ];

function coreComponents(t) {
    const n = t.translationAttributeAliases;
    const i = Array.isArray(n) ? n : [ "t" ];
    const e = [];
    const r = [];
    const a = [];
    const o = [];
    for (const t of i) {
        const n = `${t}.bind`;
        e.push({
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
            a.push(t);
            o.push(n);
        }
    }
    const c = [ m.define(e, TranslationAttributePattern), g.define({
        name: "t",
        aliases: a
    }, TranslationBindingCommand), Q, m.define(r, TranslationBindAttributePattern), g.define({
        name: "t.bind",
        aliases: o
    }, TranslationBindBindingCommand), Z, G, Y, q ];
    return {
        register(n) {
            return n.register(s.callback(L, (() => t.initOptions)), p.activating(V, (t => t.initPromise)), s.singleton(R, I18nextWrapper), s.singleton(V, F), ...c, ...nt);
        }
    };
}

const it = [ k, A ];

const et = [ O, N ];

const st = [ j, D ];

function createI18nConfiguration(t) {
    return {
        optionsProvider: t,
        register(n) {
            const i = {
                initOptions: Object.create(null)
            };
            t(i);
            return n.register(coreComponents(i), ...it, ...et, ...st);
        },
        customize(n) {
            return createI18nConfiguration(n || t);
        }
    };
}

const rt = createI18nConfiguration((() => {}));

export { A as DateFormatBindingBehavior, k as DateFormatValueConverter, V as I18N, rt as I18nConfiguration, L as I18nInitOptions, I18nKeyEvaluationResult, F as I18nService, N as NumberFormatBindingBehavior, O as NumberFormatValueConverter, D as RelativeTimeBindingBehavior, j as RelativeTimeValueConverter, P as Signals, TranslationAttributePattern, TranslationBindAttributePattern, TranslationBindBindingCommand, TranslationBindBindingInstruction, Z as TranslationBindBindingRenderer, X as TranslationBindInstructionType, TranslationBinding, K as TranslationBindingBehavior, TranslationBindingCommand, TranslationBindingInstruction, Q as TranslationBindingRenderer, J as TranslationInstructionType, G as TranslationParametersAttributePattern, Y as TranslationParametersBindingCommand, TranslationParametersBindingInstruction, q as TranslationParametersBindingRenderer, H as TranslationParametersInstructionType, tt as TranslationValueConverter };

