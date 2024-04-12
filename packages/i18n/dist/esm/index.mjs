import { DI as t, IEventAggregator as n, camelCase as i, toArray as e, Registration as s } from "@aurelia/kernel";

import { BindingMode as r, State as a, bindingBehavior as o, mixinAstEvaluator as c, mixingBindingLimited as l, CustomElement as h, attributePattern as u, renderer as d, AttrSyntax as f, valueConverter as m, AttributePattern as g, BindingCommand as p, AppTask as B } from "@aurelia/runtime-html";

import { ValueConverterExpression as b, nowrap as T, ISignaler as _, connectable as v, CustomExpression as C, astEvaluate as I, astUnbind as w, AccessorType as y, astBind as x } from "@aurelia/runtime";

import P from "i18next";

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
    const i = n.ast.expression;
    if (!(i instanceof b)) {
        const e = new b(i, t, n.ast.args);
        n.ast.expression = e;
    }
}

const M = "Interpolation";

const R = "IsProperty";

const N = r.toView;

const F = a.activating;

const E = "binding-behavior";

const V = "value-converter";

class DateFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("df", n);
    }
}

DateFormatBindingBehavior.$au = {
    type: E,
    name: "df"
};

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

const k = /*@__PURE__*/ t.createInterface("I18nInitOptions");

const D = /*@__PURE__*/ t.createInterface("I18nextWrapper");

class I18nextWrapper {
    constructor() {
        this.i18next = P;
    }
}

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

const O = /*@__PURE__*/ t.createInterface("I18N");

let j = class I18nService {
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
        this.ea.publish(A.I18N_EA_CHANNEL, i);
        this.i.forEach((t => t.handleLocaleChange(i)));
        this.u.dispatchSignal(A.I18N_SIGNAL);
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
    unsubscribeLocaleChange(t) {
        this.i.delete(t);
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

__decorate([ T ], j.prototype, "i18next", void 0);

j = __decorate([ __param(0, D), __param(1, k), __param(2, n), __param(3, _) ], j);

let K = class DateFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ A.I18N_SIGNAL ];
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

K.$au = {
    type: V,
    name: "df"
};

K = __decorate([ __param(0, O) ], K);

class NumberFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("nf", n);
    }
}

NumberFormatBindingBehavior.$au = {
    type: E,
    name: "nf"
};

let S = class NumberFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ A.I18N_SIGNAL ];
    }
    toView(t, n, i) {
        if (typeof t !== "number") {
            return t;
        }
        return this.i18n.nf(t, n, i);
    }
};

S.$au = {
    type: V,
    name: "nf"
};

S = __decorate([ __param(0, O) ], S);

class RelativeTimeBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("rt", n);
    }
}

RelativeTimeBindingBehavior.$au = {
    type: E,
    name: "rt"
};

let $ = class RelativeTimeValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ A.I18N_SIGNAL, A.RT_SIGNAL ];
    }
    toView(t, n, i) {
        if (!(t instanceof Date)) {
            return t;
        }
        return this.i18n.rt(t, n, i);
    }
};

$.$au = {
    type: V,
    name: "rt"
};

$ = __decorate([ __param(0, O) ], $);

let z = class TranslationBindingBehavior {
    bind(t, n) {
        const i = n.ast.expression;
        if (!(i instanceof b)) {
            const t = new b(i, "t", n.ast.args);
            n.ast.expression = t;
        }
    }
};

z = __decorate([ o("t") ], z);

const G = [ "textContent", "innerHTML", "prepend", "append" ];

const H = new Map([ [ "text", "textContent" ], [ "html", "innerHTML" ] ]);

const W = {
    optional: true
};

const U = {
    reusable: false,
    preempt: true
};

class TranslationBinding {
    static create({parser: t, observerLocator: n, context: i, controller: e, target: s, instruction: r, platform: a, isParameterContext: o}) {
        const c = this.B({
            observerLocator: n,
            context: i,
            controller: e,
            target: s,
            platform: a
        });
        const l = typeof r.from === "string" ? t.parse(r.from, R) : r.from;
        if (o) {
            c.useParameter(l);
        } else {
            const n = l instanceof C ? t.parse(l.value, M) : undefined;
            c.ast = n || l;
        }
    }
    static B({observerLocator: t, context: n, controller: i, target: e, platform: s}) {
        let r = i.bindings && i.bindings.find((t => t instanceof TranslationBinding && t.target === e));
        if (!r) {
            r = new TranslationBinding(i, n, t, s, e);
            i.addBinding(r);
        }
        return r;
    }
    constructor(t, n, i, e, s) {
        this.isBound = false;
        this.T = G;
        this._ = null;
        this.parameter = null;
        this.boundFn = false;
        this.l = n;
        this.C = t;
        this.target = s;
        this.i18n = n.get(O);
        this.p = e;
        this.I = new Set;
        this.oL = i;
        this.P = e.domWriteQueue;
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        const n = this.ast;
        if (n == null) {
            throw new Error("key expression is missing");
        }
        this.s = t;
        this.i18n.subscribeLocaleChange(this);
        this.A = I(n, t, this, this);
        this.L();
        this.parameter?.bind(t);
        this.updateTranslations();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.i18n.unsubscribeLocaleChange(this);
        w(this.ast, this.s, this);
        this.parameter?.unbind();
        this.I.clear();
        if (this._ !== null) {
            this._.cancel();
            this._ = null;
        }
        this.s = void 0;
        this.obs.clearAll();
    }
    handleChange(t, n) {
        this.obs.version++;
        this.A = I(this.ast, this.s, this, this);
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
        const e = [];
        const s = this._;
        this.I.clear();
        for (const s of t) {
            const t = s.value;
            const r = this.M(s.attributes);
            for (const s of r) {
                if (this.R(s)) {
                    n[s] = t;
                } else {
                    const n = h.for(this.target, W);
                    const r = n?.viewModel ? this.oL.getAccessor(n.viewModel, i(s)) : this.oL.getAccessor(this.target, s);
                    const a = this.C.state !== F && (r.type & y.Layout) > 0;
                    if (a) {
                        e.push(new AccessorUpdateTask(r, t, this.target, s));
                    } else {
                        r.setValue(t, this.target, s);
                    }
                    this.I.add(r);
                }
            }
        }
        let r = false;
        if (Object.keys(n).length > 0) {
            r = this.C.state !== F;
            if (!r) {
                this.N(n);
            }
        }
        if (e.length > 0 || r) {
            this._ = this.P.queueTask((() => {
                this._ = null;
                for (const t of e) {
                    t.run();
                }
                if (r) {
                    this.N(n);
                }
            }), U);
        }
        s?.cancel();
    }
    M(t) {
        if (t.length === 0) {
            t = this.target.tagName === "IMG" ? [ "src" ] : [ "textContent" ];
        }
        for (const [n, i] of H) {
            const e = t.findIndex((t => t === n));
            if (e > -1) {
                t.splice(e, 1, i);
            }
        }
        return t;
    }
    R(t) {
        return this.T.includes(t);
    }
    N(t) {
        const n = e(this.target.childNodes);
        const i = [];
        const s = "au-i18n";
        for (const t of n) {
            if (!Reflect.get(t, s)) {
                i.push(t);
            }
        }
        const r = this.F(t, s, i);
        this.target.innerHTML = "";
        for (const t of e(r.content.childNodes)) {
            this.target.appendChild(t);
        }
    }
    F(t, n, i) {
        const e = this.p.document.createElement("template");
        this.V(e, t.prepend, n);
        if (!this.V(e, t.innerHTML ?? t.textContent, n)) {
            for (const t of i) {
                e.content.append(t);
            }
        }
        this.V(e, t.append, n);
        return e;
    }
    V(t, n, i) {
        if (n !== void 0 && n !== null) {
            const s = this.p.document.createElement("div");
            s.innerHTML = n;
            for (const n of e(s.childNodes)) {
                Reflect.set(n, i, true);
                t.content.append(n);
            }
            return true;
        }
        return false;
    }
    L() {
        const t = this.A ??= "";
        const n = typeof t;
        if (n !== "string") {
            throw new Error(`Expected the i18n key to be a string, but got ${t} of type ${n}`);
        }
    }
}

v(TranslationBinding);

c(true)(TranslationBinding);

l(TranslationBinding, (() => "updateTranslations"));

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
        this.value = I(this.ast, this.s, this, this);
        this.obs.clear();
        this.updater();
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.s = t;
        x(this.ast, t, this);
        this.value = I(this.ast, t, this, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        w(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

v(ParameterBinding);

c(true)(ParameterBinding);

const q = "tpt";

const J = "t-params.bind";

let Q = class TranslationParametersAttributePattern {
    [J](t, n) {
        return new f(t, n, "", J);
    }
};

Q = __decorate([ u({
    pattern: J,
    symbols: ""
}) ], Q);

class TranslationParametersBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = q;
        this.mode = N;
    }
}

class TranslationParametersBindingCommand {
    constructor() {
        this.ignoreAttr = false;
    }
    build(t, n, e) {
        const s = t.attr;
        let r = s.target;
        if (t.bindable == null) {
            r = e.map(t.node, r) ?? i(r);
        } else {
            r = t.bindable.name;
        }
        return new TranslationParametersBindingInstruction(n.parse(s.rawValue, R), r);
    }
}

TranslationParametersBindingCommand.$au = {
    type: "binding-command",
    name: J
};

let X = class TranslationParametersBindingRenderer {
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

X = __decorate([ d(q) ], X);

const Y = "tt";

class TranslationAttributePattern {
    static registerAlias(t) {
        this.prototype[t] = function(n, i, e) {
            return new f(n, i, "", t);
        };
    }
}

class TranslationBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = Y;
        this.mode = N;
    }
}

class TranslationBindingCommand {
    constructor() {
        this.ignoreAttr = false;
    }
    build(t, n, e) {
        let s;
        if (t.bindable == null) {
            s = e.map(t.node, t.attr.target) ?? i(t.attr.target);
        } else {
            s = t.bindable.name;
        }
        return new TranslationBindingInstruction(new C(t.attr.rawValue), s);
    }
}

let Z = class TranslationBindingRenderer {
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

Z = __decorate([ d(Y) ], Z);

const tt = "tbt";

class TranslationBindAttributePattern {
    static registerAlias(t) {
        const n = `${t}.bind`;
        this.prototype[n] = function(t, i, e) {
            return new f(t, i, e[1], n);
        };
    }
}

class TranslationBindBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = tt;
        this.mode = N;
    }
}

class TranslationBindBindingCommand {
    constructor() {
        this.ignoreAttr = false;
    }
    build(t, n, e) {
        let s;
        if (t.bindable == null) {
            s = e.map(t.node, t.attr.target) ?? i(t.attr.target);
        } else {
            s = t.bindable.name;
        }
        return new TranslationBindBindingInstruction(n.parse(t.attr.rawValue, R), s);
    }
}

let nt = class TranslationBindBindingRenderer {
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

nt = __decorate([ d(tt) ], nt);

let it = class TranslationValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ A.I18N_SIGNAL ];
    }
    toView(t, n) {
        return this.i18n.tr(t, n);
    }
};

it = __decorate([ m("t"), __param(0, O) ], it);

const et = [ it, z ];

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
    const c = [ g.define(e, TranslationAttributePattern), p.define({
        name: "t",
        aliases: a
    }, TranslationBindingCommand), Z, g.define(r, TranslationBindAttributePattern), p.define({
        name: "t.bind",
        aliases: o
    }, TranslationBindBindingCommand), nt, Q, TranslationParametersBindingCommand, X ];
    return {
        register(n) {
            return n.register(s.callback(k, (() => t.initOptions)), B.activating(O, (t => t.initPromise)), s.singleton(D, I18nextWrapper), s.singleton(O, j), ...c, ...et);
        }
    };
}

const st = [ K, DateFormatBindingBehavior ];

const rt = [ S, NumberFormatBindingBehavior ];

const at = [ $, RelativeTimeBindingBehavior ];

function createI18nConfiguration(t) {
    return {
        optionsProvider: t,
        register(n) {
            const i = {
                initOptions: Object.create(null)
            };
            t(i);
            return n.register(coreComponents(i), ...st, ...rt, ...at);
        },
        customize(n) {
            return createI18nConfiguration(n || t);
        }
    };
}

const ot = createI18nConfiguration((() => {}));

export { DateFormatBindingBehavior, K as DateFormatValueConverter, O as I18N, ot as I18nConfiguration, k as I18nInitOptions, I18nKeyEvaluationResult, j as I18nService, NumberFormatBindingBehavior, S as NumberFormatValueConverter, RelativeTimeBindingBehavior, $ as RelativeTimeValueConverter, A as Signals, TranslationAttributePattern, TranslationBindAttributePattern, TranslationBindBindingCommand, TranslationBindBindingInstruction, nt as TranslationBindBindingRenderer, tt as TranslationBindInstructionType, TranslationBinding, z as TranslationBindingBehavior, TranslationBindingCommand, TranslationBindingInstruction, Z as TranslationBindingRenderer, Y as TranslationInstructionType, Q as TranslationParametersAttributePattern, TranslationParametersBindingCommand, TranslationParametersBindingInstruction, X as TranslationParametersBindingRenderer, q as TranslationParametersInstructionType, it as TranslationValueConverter };
//# sourceMappingURL=index.mjs.map
