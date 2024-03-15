"use strict";

var t = require("@aurelia/kernel");

var n = require("@aurelia/runtime-html");

var e = require("@aurelia/runtime");

var s = require("i18next");

function __decorate(t, n, e, s) {
    var r = arguments.length, i = r < 3 ? n : s === null ? s = Object.getOwnPropertyDescriptor(n, e) : s, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") i = Reflect.decorate(t, n, e, s); else for (var a = t.length - 1; a >= 0; a--) if (o = t[a]) i = (r < 3 ? o(i) : r > 3 ? o(n, e, i) : o(n, e)) || i;
    return r > 3 && i && Object.defineProperty(n, e, i), i;
}

function __param(t, n) {
    return function(e, s) {
        n(e, s, t);
    };
}

const r = {
    I18N_EA_CHANNEL: "i18n:locale:changed",
    I18N_SIGNAL: "aurelia-translation-signal",
    RT_SIGNAL: "aurelia-relativetime-signal"
};

var i;

(function(t) {
    t["translationValueConverterName"] = "t";
    t["dateFormatValueConverterName"] = "df";
    t["numberFormatValueConverterName"] = "nf";
    t["relativeTimeValueConverterName"] = "rt";
})(i || (i = {}));

function createIntlFormatValueConverterExpression(t, n) {
    const s = n.ast.expression;
    if (!(s instanceof e.ValueConverterExpression)) {
        const r = new e.ValueConverterExpression(s, t, n.ast.args);
        n.ast.expression = r;
    }
}

const o = "Interpolation";

const a = "IsProperty";

const c = "None";

const h = n.BindingMode.toView;

const l = n.State.activating;

exports.DateFormatBindingBehavior = class DateFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("df", n);
    }
};

exports.DateFormatBindingBehavior = __decorate([ n.bindingBehavior("df") ], exports.DateFormatBindingBehavior);

const u = /*@__PURE__*/ t.DI.createInterface("I18nInitOptions");

const p = /*@__PURE__*/ t.DI.createInterface("I18nextWrapper");

class I18nextWrapper {
    constructor() {
        this.i18next = s;
    }
}

var d;

(function(t) {
    t[t["Second"] = 1e3] = "Second";
    t[t["Minute"] = 6e4] = "Minute";
    t[t["Hour"] = 36e5] = "Hour";
    t[t["Day"] = 864e5] = "Day";
    t[t["Week"] = 6048e5] = "Week";
    t[t["Month"] = 2592e6] = "Month";
    t[t["Year"] = 31536e6] = "Year";
})(d || (d = {}));

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

const f = /*@__PURE__*/ t.DI.createInterface("I18N");

exports.I18nService = class I18nService {
    constructor(t, n, e, s) {
        this.ea = e;
        this.i = new Set;
        this.i18next = t.i18next;
        this.initPromise = this.h(n);
        this.u = s;
    }
    evaluate(t, n) {
        const e = t.split(";");
        const s = [];
        for (const t of e) {
            const e = new I18nKeyEvaluationResult(t);
            const r = e.key;
            const i = this.tr(r, n);
            if (this.options.skipTranslationOnMissingKey && i === r) {
                console.warn(`Couldn't find translation for key: ${r}`);
            } else {
                e.value = i;
                s.push(e);
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
        const e = {
            oldLocale: n,
            newLocale: t
        };
        await this.i18next.changeLanguage(t);
        this.ea.publish(r.I18N_EA_CHANNEL, e);
        this.i.forEach((t => t.handleLocaleChange(e)));
        this.u.dispatchSignal(r.I18N_SIGNAL);
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
        let s = e[1];
        const r = e[5];
        if (s === ".") {
            s = "\\.";
        }
        const i = t.replace(new RegExp(s, "g"), "").replace(/[^\d.,-]/g, "").replace(r, ".");
        return Number(i);
    }
    createRelativeTimeFormat(t, n) {
        return new Intl.RelativeTimeFormat(n || this.getLocale(), t);
    }
    rt(t, n, e) {
        let s = t.getTime() - this.now();
        const r = this.options.rtEpsilon * (s > 0 ? 1 : 0);
        const i = this.createRelativeTimeFormat(n, e);
        let o = s / 31536e6;
        if (Math.abs(o + r) >= 1) {
            return i.format(Math.round(o), "year");
        }
        o = s / 2592e6;
        if (Math.abs(o + r) >= 1) {
            return i.format(Math.round(o), "month");
        }
        o = s / 6048e5;
        if (Math.abs(o + r) >= 1) {
            return i.format(Math.round(o), "week");
        }
        o = s / 864e5;
        if (Math.abs(o + r) >= 1) {
            return i.format(Math.round(o), "day");
        }
        o = s / 36e5;
        if (Math.abs(o + r) >= 1) {
            return i.format(Math.round(o), "hour");
        }
        o = s / 6e4;
        if (Math.abs(o + r) >= 1) {
            return i.format(Math.round(o), "minute");
        }
        s = Math.abs(s) < 1e3 ? 1e3 : s;
        o = s / 1e3;
        return i.format(Math.round(o), "second");
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

__decorate([ e.nowrap ], exports.I18nService.prototype, "i18next", void 0);

exports.I18nService = __decorate([ __param(0, p), __param(1, u), __param(2, t.IEventAggregator), __param(3, e.ISignaler) ], exports.I18nService);

exports.DateFormatValueConverter = class DateFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ r.I18N_SIGNAL ];
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

exports.DateFormatValueConverter = __decorate([ n.valueConverter("df"), __param(0, f) ], exports.DateFormatValueConverter);

exports.NumberFormatBindingBehavior = class NumberFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("nf", n);
    }
};

exports.NumberFormatBindingBehavior = __decorate([ n.bindingBehavior("nf") ], exports.NumberFormatBindingBehavior);

exports.NumberFormatValueConverter = class NumberFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ r.I18N_SIGNAL ];
    }
    toView(t, n, e) {
        if (typeof t !== "number") {
            return t;
        }
        return this.i18n.nf(t, n, e);
    }
};

exports.NumberFormatValueConverter = __decorate([ n.valueConverter("nf"), __param(0, f) ], exports.NumberFormatValueConverter);

exports.RelativeTimeBindingBehavior = class RelativeTimeBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("rt", n);
    }
};

exports.RelativeTimeBindingBehavior = __decorate([ n.bindingBehavior("rt") ], exports.RelativeTimeBindingBehavior);

exports.RelativeTimeValueConverter = class RelativeTimeValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ r.I18N_SIGNAL, r.RT_SIGNAL ];
    }
    toView(t, n, e) {
        if (!(t instanceof Date)) {
            return t;
        }
        return this.i18n.rt(t, n, e);
    }
};

exports.RelativeTimeValueConverter = __decorate([ n.valueConverter("rt"), __param(0, f) ], exports.RelativeTimeValueConverter);

exports.TranslationBindingBehavior = class TranslationBindingBehavior {
    bind(t, n) {
        const s = n.ast.expression;
        if (!(s instanceof e.ValueConverterExpression)) {
            const t = new e.ValueConverterExpression(s, "t", n.ast.args);
            n.ast.expression = t;
        }
    }
};

exports.TranslationBindingBehavior = __decorate([ n.bindingBehavior("t") ], exports.TranslationBindingBehavior);

const x = [ "textContent", "innerHTML", "prepend", "append" ];

const m = new Map([ [ "text", "textContent" ], [ "html", "innerHTML" ] ]);

const g = {
    optional: true
};

const _ = {
    reusable: false,
    preempt: true
};

class TranslationBinding {
    static create({parser: t, observerLocator: n, context: s, controller: r, target: i, instruction: c, platform: h, isParameterContext: l}) {
        const u = this._({
            observerLocator: n,
            context: s,
            controller: r,
            target: i,
            platform: h
        });
        const p = typeof c.from === "string" ? t.parse(c.from, a) : c.from;
        if (l) {
            u.useParameter(p);
        } else {
            const n = p instanceof e.CustomExpression ? t.parse(p.value, o) : undefined;
            u.ast = n || p;
        }
    }
    static _({observerLocator: t, context: n, controller: e, target: s, platform: r}) {
        let i = e.bindings && e.bindings.find((t => t instanceof TranslationBinding && t.target === s));
        if (!i) {
            i = new TranslationBinding(e, n, t, r, s);
            e.addBinding(i);
        }
        return i;
    }
    constructor(t, n, e, s, r) {
        this.isBound = false;
        this.T = x;
        this.B = null;
        this.parameter = null;
        this.boundFn = false;
        this.l = n;
        this.I = t;
        this.target = r;
        this.i18n = n.get(f);
        this.p = s;
        this.C = new Set;
        this.oL = e;
        this.P = s.domWriteQueue;
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
        this.M = e.astEvaluate(n, t, this, this);
        this.A();
        this.parameter?.bind(t);
        this.updateTranslations();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.i18n.unsubscribeLocaleChange(this);
        e.astUnbind(this.ast, this.s, this);
        this.parameter?.unbind();
        this.C.clear();
        if (this.B !== null) {
            this.B.cancel();
            this.B = null;
        }
        this.s = void 0;
        this.obs.clearAll();
    }
    handleChange(t, n) {
        this.obs.version++;
        this.M = e.astEvaluate(this.ast, this.s, this, this);
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
        const s = this.i18n.evaluate(this.M, this.parameter?.value);
        const r = Object.create(null);
        const i = [];
        const o = this.B;
        this.C.clear();
        for (const o of s) {
            const s = o.value;
            const a = this.L(o.attributes);
            for (const o of a) {
                if (this.N(o)) {
                    r[o] = s;
                } else {
                    const r = n.CustomElement.for(this.target, g);
                    const a = r?.viewModel ? this.oL.getAccessor(r.viewModel, t.camelCase(o)) : this.oL.getAccessor(this.target, o);
                    const c = this.I.state !== l && (a.type & e.AccessorType.Layout) > 0;
                    if (c) {
                        i.push(new AccessorUpdateTask(a, s, this.target, o));
                    } else {
                        a.setValue(s, this.target, o);
                    }
                    this.C.add(a);
                }
            }
        }
        let a = false;
        if (Object.keys(r).length > 0) {
            a = this.I.state !== l;
            if (!a) {
                this.R(r);
            }
        }
        if (i.length > 0 || a) {
            this.B = this.P.queueTask((() => {
                this.B = null;
                for (const t of i) {
                    t.run();
                }
                if (a) {
                    this.R(r);
                }
            }), _);
        }
        o?.cancel();
    }
    L(t) {
        if (t.length === 0) {
            t = this.target.tagName === "IMG" ? [ "src" ] : [ "textContent" ];
        }
        for (const [n, e] of m) {
            const s = t.findIndex((t => t === n));
            if (s > -1) {
                t.splice(s, 1, e);
            }
        }
        return t;
    }
    N(t) {
        return this.T.includes(t);
    }
    R(n) {
        const e = t.toArray(this.target.childNodes);
        const s = [];
        const r = "au-i18n";
        for (const t of e) {
            if (!Reflect.get(t, r)) {
                s.push(t);
            }
        }
        const i = this.V(n, r, s);
        this.target.innerHTML = "";
        for (const n of t.toArray(i.content.childNodes)) {
            this.target.appendChild(n);
        }
    }
    V(t, n, e) {
        const s = this.p.document.createElement("template");
        this.F(s, t.prepend, n);
        if (!this.F(s, t.innerHTML ?? t.textContent, n)) {
            for (const t of e) {
                s.content.append(t);
            }
        }
        this.F(s, t.append, n);
        return s;
    }
    F(n, e, s) {
        if (e !== void 0 && e !== null) {
            const r = this.p.document.createElement("div");
            r.innerHTML = e;
            for (const e of t.toArray(r.childNodes)) {
                Reflect.set(e, s, true);
                n.content.append(e);
            }
            return true;
        }
        return false;
    }
    A() {
        const t = this.M ??= "";
        const n = typeof t;
        if (n !== "string") {
            throw new Error(`Expected the i18n key to be a string, but got ${t} of type ${n}`);
        }
    }
}

e.connectable(TranslationBinding);

n.mixinAstEvaluator(true)(TranslationBinding);

n.mixingBindingLimited(TranslationBinding, (() => "updateTranslations"));

class AccessorUpdateTask {
    constructor(t, n, e, s) {
        this.accessor = t;
        this.v = n;
        this.el = e;
        this.attr = s;
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
        this.value = e.astEvaluate(this.ast, this.s, this, this);
        this.obs.clear();
        this.updater();
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.s = t;
        e.astBind(this.ast, t, this);
        this.value = e.astEvaluate(this.ast, t, this, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        e.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

e.connectable(ParameterBinding);

n.mixinAstEvaluator(true)(ParameterBinding);

const b = "tpt";

const T = "t-params.bind";

exports.TranslationParametersAttributePattern = class TranslationParametersAttributePattern {
    [T](t, e) {
        return new n.AttrSyntax(t, e, "", T);
    }
};

exports.TranslationParametersAttributePattern = __decorate([ n.attributePattern({
    pattern: T,
    symbols: ""
}) ], exports.TranslationParametersAttributePattern);

class TranslationParametersBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = b;
        this.mode = h;
    }
}

exports.TranslationParametersBindingCommand = class TranslationParametersBindingCommand {
    constructor() {
        this.type = c;
    }
    get name() {
        return T;
    }
    build(n, e, s) {
        const r = n.attr;
        let i = r.target;
        if (n.bindable == null) {
            i = s.map(n.node, i) ?? t.camelCase(i);
        } else {
            i = n.bindable.name;
        }
        return new TranslationParametersBindingInstruction(e.parse(r.rawValue, a), i);
    }
};

exports.TranslationParametersBindingCommand = __decorate([ n.bindingCommand(T) ], exports.TranslationParametersBindingCommand);

exports.TranslationParametersBindingRenderer = class TranslationParametersBindingRenderer {
    render(t, n, e, s, r, i) {
        TranslationBinding.create({
            parser: r,
            observerLocator: i,
            context: t.container,
            controller: t,
            target: n,
            instruction: e,
            isParameterContext: true,
            platform: s
        });
    }
};

exports.TranslationParametersBindingRenderer = __decorate([ n.renderer(b) ], exports.TranslationParametersBindingRenderer);

const B = "tt";

class TranslationAttributePattern {
    static registerAlias(t) {
        this.prototype[t] = function(e, s, r) {
            return new n.AttrSyntax(e, s, "", t);
        };
    }
}

class TranslationBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = B;
        this.mode = h;
    }
}

class TranslationBindingCommand {
    constructor() {
        this.type = c;
    }
    get name() {
        return "t";
    }
    build(n, s, r) {
        let i;
        if (n.bindable == null) {
            i = r.map(n.node, n.attr.target) ?? t.camelCase(n.attr.target);
        } else {
            i = n.bindable.name;
        }
        return new TranslationBindingInstruction(new e.CustomExpression(n.attr.rawValue), i);
    }
}

exports.TranslationBindingRenderer = class TranslationBindingRenderer {
    render(t, n, e, s, r, i) {
        TranslationBinding.create({
            parser: r,
            observerLocator: i,
            context: t.container,
            controller: t,
            target: n,
            instruction: e,
            platform: s
        });
    }
};

exports.TranslationBindingRenderer = __decorate([ n.renderer(B) ], exports.TranslationBindingRenderer);

const v = "tbt";

class TranslationBindAttributePattern {
    static registerAlias(t) {
        const e = `${t}.bind`;
        this.prototype[e] = function(t, s, r) {
            return new n.AttrSyntax(t, s, r[1], e);
        };
    }
}

class TranslationBindBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = v;
        this.mode = h;
    }
}

class TranslationBindBindingCommand {
    constructor() {
        this.type = c;
    }
    get name() {
        return "t-bind";
    }
    build(n, e, s) {
        let r;
        if (n.bindable == null) {
            r = s.map(n.node, n.attr.target) ?? t.camelCase(n.attr.target);
        } else {
            r = n.bindable.name;
        }
        return new TranslationBindBindingInstruction(e.parse(n.attr.rawValue, a), r);
    }
}

exports.TranslationBindBindingRenderer = class TranslationBindBindingRenderer {
    render(t, n, e, s, r, i) {
        TranslationBinding.create({
            parser: r,
            observerLocator: i,
            context: t.container,
            controller: t,
            target: n,
            instruction: e,
            platform: s
        });
    }
};

exports.TranslationBindBindingRenderer = __decorate([ n.renderer(v) ], exports.TranslationBindBindingRenderer);

exports.TranslationValueConverter = class TranslationValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ r.I18N_SIGNAL ];
    }
    toView(t, n) {
        return this.i18n.tr(t, n);
    }
};

exports.TranslationValueConverter = __decorate([ n.valueConverter("t"), __param(0, f) ], exports.TranslationValueConverter);

const I = [ exports.TranslationValueConverter, exports.TranslationBindingBehavior ];

function coreComponents(e) {
    const s = e.translationAttributeAliases;
    const r = Array.isArray(s) ? s : [ "t" ];
    const i = [];
    const o = [];
    const a = [];
    const c = [];
    for (const t of r) {
        const n = `${t}.bind`;
        i.push({
            pattern: t,
            symbols: ""
        });
        TranslationAttributePattern.registerAlias(t);
        o.push({
            pattern: n,
            symbols: "."
        });
        TranslationBindAttributePattern.registerAlias(t);
        if (t !== "t") {
            a.push(t);
            c.push(n);
        }
    }
    const h = [ n.AttributePattern.define(i, TranslationAttributePattern), n.BindingCommand.define({
        name: "t",
        aliases: a
    }, TranslationBindingCommand), exports.TranslationBindingRenderer, n.AttributePattern.define(o, TranslationBindAttributePattern), n.BindingCommand.define({
        name: "t.bind",
        aliases: c
    }, TranslationBindBindingCommand), exports.TranslationBindBindingRenderer, exports.TranslationParametersAttributePattern, exports.TranslationParametersBindingCommand, exports.TranslationParametersBindingRenderer ];
    return {
        register(s) {
            return s.register(t.Registration.callback(u, (() => e.initOptions)), n.AppTask.activating(f, (t => t.initPromise)), t.Registration.singleton(p, I18nextWrapper), t.Registration.singleton(f, exports.I18nService), ...h, ...I);
        }
    };
}

const w = [ exports.DateFormatValueConverter, exports.DateFormatBindingBehavior ];

const C = [ exports.NumberFormatValueConverter, exports.NumberFormatBindingBehavior ];

const y = [ exports.RelativeTimeValueConverter, exports.RelativeTimeBindingBehavior ];

function createI18nConfiguration(t) {
    return {
        optionsProvider: t,
        register(n) {
            const e = {
                initOptions: Object.create(null)
            };
            t(e);
            return n.register(coreComponents(e), ...w, ...C, ...y);
        },
        customize(n) {
            return createI18nConfiguration(n || t);
        }
    };
}

const P = createI18nConfiguration((() => {}));

exports.I18N = f;

exports.I18nConfiguration = P;

exports.I18nInitOptions = u;

exports.I18nKeyEvaluationResult = I18nKeyEvaluationResult;

exports.Signals = r;

exports.TranslationAttributePattern = TranslationAttributePattern;

exports.TranslationBindAttributePattern = TranslationBindAttributePattern;

exports.TranslationBindBindingCommand = TranslationBindBindingCommand;

exports.TranslationBindBindingInstruction = TranslationBindBindingInstruction;

exports.TranslationBindInstructionType = v;

exports.TranslationBinding = TranslationBinding;

exports.TranslationBindingCommand = TranslationBindingCommand;

exports.TranslationBindingInstruction = TranslationBindingInstruction;

exports.TranslationInstructionType = B;

exports.TranslationParametersBindingInstruction = TranslationParametersBindingInstruction;

exports.TranslationParametersInstructionType = b;
//# sourceMappingURL=index.cjs.map
