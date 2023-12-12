"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var e = require("@aurelia/runtime-html");

var n = require("@aurelia/runtime");

var s = require("i18next");

function _interopDefaultLegacy(t) {
    return t && typeof t === "object" && "default" in t ? t["default"] : t;
}

var r = _interopDefaultLegacy(s);

function __decorate(t, e, n, s) {
    var r = arguments.length, i = r < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, n) : s, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") i = Reflect.decorate(t, e, n, s); else for (var a = t.length - 1; a >= 0; a--) if (o = t[a]) i = (r < 3 ? o(i) : r > 3 ? o(e, n, i) : o(e, n)) || i;
    return r > 3 && i && Object.defineProperty(e, n, i), i;
}

function __param(t, e) {
    return function(n, s) {
        e(n, s, t);
    };
}

const i = {
    I18N_EA_CHANNEL: "i18n:locale:changed",
    I18N_SIGNAL: "aurelia-translation-signal",
    RT_SIGNAL: "aurelia-relativetime-signal"
};

var o;

(function(t) {
    t["translationValueConverterName"] = "t";
    t["dateFormatValueConverterName"] = "df";
    t["numberFormatValueConverterName"] = "nf";
    t["relativeTimeValueConverterName"] = "rt";
})(o || (o = {}));

function createIntlFormatValueConverterExpression(t, e) {
    const s = e.ast.expression;
    if (!(s instanceof n.ValueConverterExpression)) {
        const r = new n.ValueConverterExpression(s, t, e.ast.args);
        e.ast.expression = r;
    }
}

exports.DateFormatBindingBehavior = class DateFormatBindingBehavior {
    bind(t, e) {
        createIntlFormatValueConverterExpression("df", e);
    }
};

exports.DateFormatBindingBehavior = __decorate([ e.bindingBehavior("df") ], exports.DateFormatBindingBehavior);

const a = /*@__PURE__*/ t.DI.createInterface("I18nInitOptions");

const c = /*@__PURE__*/ t.DI.createInterface("I18nextWrapper");

class I18nextWrapper {
    constructor() {
        this.i18next = r;
    }
}

var h;

(function(t) {
    t[t["Second"] = 1e3] = "Second";
    t[t["Minute"] = 6e4] = "Minute";
    t[t["Hour"] = 36e5] = "Hour";
    t[t["Day"] = 864e5] = "Day";
    t[t["Week"] = 6048e5] = "Week";
    t[t["Month"] = 2592e6] = "Month";
    t[t["Year"] = 31536e6] = "Year";
})(h || (h = {}));

class I18nKeyEvaluationResult {
    constructor(t) {
        this.value = void 0;
        const e = /\[([a-z\-, ]*)\]/gi;
        this.attributes = [];
        const n = e.exec(t);
        if (n) {
            t = t.replace(n[0], "");
            this.attributes = n[1].split(",");
        }
        this.key = t;
    }
}

const l = /*@__PURE__*/ t.DI.createInterface("I18N");

exports.I18nService = class I18nService {
    constructor(t, e, n, s) {
        this.ea = n;
        this.i = new Set;
        this.i18next = t.i18next;
        this.initPromise = this.h(e);
        this.u = s;
    }
    evaluate(t, e) {
        const n = t.split(";");
        const s = [];
        for (const t of n) {
            const n = new I18nKeyEvaluationResult(t);
            const r = n.key;
            const i = this.tr(r, e);
            if (this.options.skipTranslationOnMissingKey && i === r) {
                console.warn(`Couldn't find translation for key: ${r}`);
            } else {
                n.value = i;
                s.push(n);
            }
        }
        return s;
    }
    tr(t, e) {
        return this.i18next.t(t, e);
    }
    getLocale() {
        return this.i18next.language;
    }
    async setLocale(t) {
        const e = this.getLocale();
        const n = {
            oldLocale: e,
            newLocale: t
        };
        await this.i18next.changeLanguage(t);
        this.ea.publish(i.I18N_EA_CHANNEL, n);
        this.i.forEach((t => t.handleLocaleChange(n)));
        this.u.dispatchSignal(i.I18N_SIGNAL);
    }
    createNumberFormat(t, e) {
        return Intl.NumberFormat(e || this.getLocale(), t);
    }
    nf(t, e, n) {
        return this.createNumberFormat(e, n).format(t);
    }
    createDateTimeFormat(t, e) {
        return Intl.DateTimeFormat(e || this.getLocale(), t);
    }
    df(t, e, n) {
        return this.createDateTimeFormat(e, n).format(t);
    }
    uf(t, e) {
        const n = this.nf(1e4 / 3, undefined, e);
        let s = n[1];
        const r = n[5];
        if (s === ".") {
            s = "\\.";
        }
        const i = t.replace(new RegExp(s, "g"), "").replace(/[^\d.,-]/g, "").replace(r, ".");
        return Number(i);
    }
    createRelativeTimeFormat(t, e) {
        return new Intl.RelativeTimeFormat(e || this.getLocale(), t);
    }
    rt(t, e, n) {
        let s = t.getTime() - this.now();
        const r = this.options.rtEpsilon * (s > 0 ? 1 : 0);
        const i = this.createRelativeTimeFormat(e, n);
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
    now() {
        return (new Date).getTime();
    }
    async h(t) {
        const e = {
            lng: "en",
            fallbackLng: [ "en" ],
            debug: false,
            plugins: [],
            rtEpsilon: .01,
            skipTranslationOnMissingKey: false
        };
        this.options = {
            ...e,
            ...t
        };
        for (const t of this.options.plugins) {
            this.i18next.use(t);
        }
        await this.i18next.init(this.options);
    }
};

__decorate([ n.nowrap ], exports.I18nService.prototype, "i18next", void 0);

exports.I18nService = __decorate([ __param(0, c), __param(1, a), __param(2, t.IEventAggregator), __param(3, n.ISignaler) ], exports.I18nService);

exports.DateFormatValueConverter = class DateFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ i.I18N_SIGNAL ];
    }
    toView(t, e, n) {
        if (!t && t !== 0 || typeof t === "string" && t.trim() === "") {
            return t;
        }
        if (typeof t === "string") {
            const e = Number(t);
            const n = new Date(Number.isInteger(e) ? e : t);
            if (isNaN(n.getTime())) {
                return t;
            }
            t = n;
        }
        return this.i18n.df(t, e, n);
    }
};

exports.DateFormatValueConverter = __decorate([ e.valueConverter("df"), __param(0, l) ], exports.DateFormatValueConverter);

exports.NumberFormatBindingBehavior = class NumberFormatBindingBehavior {
    bind(t, e) {
        createIntlFormatValueConverterExpression("nf", e);
    }
};

exports.NumberFormatBindingBehavior = __decorate([ e.bindingBehavior("nf") ], exports.NumberFormatBindingBehavior);

exports.NumberFormatValueConverter = class NumberFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ i.I18N_SIGNAL ];
    }
    toView(t, e, n) {
        if (typeof t !== "number") {
            return t;
        }
        return this.i18n.nf(t, e, n);
    }
};

exports.NumberFormatValueConverter = __decorate([ e.valueConverter("nf"), __param(0, l) ], exports.NumberFormatValueConverter);

exports.RelativeTimeBindingBehavior = class RelativeTimeBindingBehavior {
    bind(t, e) {
        createIntlFormatValueConverterExpression("rt", e);
    }
};

exports.RelativeTimeBindingBehavior = __decorate([ e.bindingBehavior("rt") ], exports.RelativeTimeBindingBehavior);

exports.RelativeTimeValueConverter = class RelativeTimeValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ i.I18N_SIGNAL, i.RT_SIGNAL ];
    }
    toView(t, e, n) {
        if (!(t instanceof Date)) {
            return t;
        }
        return this.i18n.rt(t, e, n);
    }
};

exports.RelativeTimeValueConverter = __decorate([ e.valueConverter("rt"), __param(0, l) ], exports.RelativeTimeValueConverter);

exports.TranslationBindingBehavior = class TranslationBindingBehavior {
    bind(t, e) {
        const s = e.ast.expression;
        if (!(s instanceof n.ValueConverterExpression)) {
            const t = new n.ValueConverterExpression(s, "t", e.ast.args);
            e.ast.expression = t;
        }
    }
};

exports.TranslationBindingBehavior = __decorate([ e.bindingBehavior("t") ], exports.TranslationBindingBehavior);

const u = [ "textContent", "innerHTML", "prepend", "append" ];

const p = new Map([ [ "text", "textContent" ], [ "html", "innerHTML" ] ]);

const f = {
    optional: true
};

const d = {
    reusable: false,
    preempt: true
};

class TranslationBinding {
    constructor(t, e, n, s, r) {
        this.isBound = false;
        this._ = u;
        this.T = null;
        this.parameter = null;
        this.boundFn = false;
        this.l = e;
        this.B = t;
        this.target = r;
        this.i18n = e.get(l);
        this.p = s;
        this.I = new Set;
        this.oL = n;
        this.i18n.subscribeLocaleChange(this);
        this.C = s.domWriteQueue;
    }
    static create({parser: t, observerLocator: e, context: s, controller: r, target: i, instruction: o, platform: a, isParameterContext: c}) {
        const h = this.P({
            observerLocator: e,
            context: s,
            controller: r,
            target: i,
            platform: a
        });
        const l = typeof o.from === "string" ? t.parse(o.from, 16) : o.from;
        if (c) {
            h.useParameter(l);
        } else {
            const e = l instanceof n.CustomExpression ? t.parse(l.value, 1) : undefined;
            h.ast = e || l;
        }
    }
    static P({observerLocator: t, context: e, controller: n, target: s, platform: r}) {
        let i = n.bindings && n.bindings.find((t => t instanceof TranslationBinding && t.target === s));
        if (!i) {
            i = new TranslationBinding(n, e, t, r, s);
            n.addBinding(i);
        }
        return i;
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        if (!this.ast) {
            throw new Error("key expression is missing");
        }
        this.s = t;
        this.M = this.ast instanceof n.Interpolation;
        this.A = n.astEvaluate(this.ast, t, this, this);
        this.L();
        this.parameter?.bind(t);
        this.updateTranslations();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        n.astUnbind(this.ast, this.s, this);
        this.parameter?.unbind();
        this.I.clear();
        if (this.T !== null) {
            this.T.cancel();
            this.T = null;
        }
        this.s = void 0;
        this.obs.clearAll();
    }
    handleChange(t, e) {
        this.obs.version++;
        this.A = this.M ? n.astEvaluate(this.ast, this.s, this, this) : t;
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
        const n = this.i18n.evaluate(this.A, this.parameter?.value);
        const s = Object.create(null);
        const r = [];
        const i = this.T;
        this.I.clear();
        for (const i of n) {
            const n = i.value;
            const o = this.R(i.attributes);
            for (const i of o) {
                if (this.N(i)) {
                    s[i] = n;
                } else {
                    const s = e.CustomElement.for(this.target, f);
                    const o = s?.viewModel ? this.oL.getAccessor(s.viewModel, t.camelCase(i)) : this.oL.getAccessor(this.target, i);
                    const a = this.B.state !== 1 && (o.type & 4) > 0;
                    if (a) {
                        r.push(new AccessorUpdateTask(o, n, this.target, i));
                    } else {
                        o.setValue(n, this.target, i);
                    }
                    this.I.add(o);
                }
            }
        }
        let o = false;
        if (Object.keys(s).length > 0) {
            o = this.B.state !== 1;
            if (!o) {
                this.V(s);
            }
        }
        if (r.length > 0 || o) {
            this.T = this.C.queueTask((() => {
                this.T = null;
                for (const t of r) {
                    t.run();
                }
                if (o) {
                    this.V(s);
                }
            }), d);
        }
        i?.cancel();
    }
    R(t) {
        if (t.length === 0) {
            t = this.target.tagName === "IMG" ? [ "src" ] : [ "textContent" ];
        }
        for (const [e, n] of p) {
            const s = t.findIndex((t => t === e));
            if (s > -1) {
                t.splice(s, 1, n);
            }
        }
        return t;
    }
    N(t) {
        return this._.includes(t);
    }
    V(e) {
        const n = t.toArray(this.target.childNodes);
        const s = [];
        const r = "au-i18n";
        for (const t of n) {
            if (!Reflect.get(t, r)) {
                s.push(t);
            }
        }
        const i = this.F(e, r, s);
        this.target.innerHTML = "";
        for (const e of t.toArray(i.content.childNodes)) {
            this.target.appendChild(e);
        }
    }
    F(t, e, n) {
        const s = this.p.document.createElement("template");
        this.O(s, t.prepend, e);
        if (!this.O(s, t.innerHTML ?? t.textContent, e)) {
            for (const t of n) {
                s.content.append(t);
            }
        }
        this.O(s, t.append, e);
        return s;
    }
    O(e, n, s) {
        if (n !== void 0 && n !== null) {
            const r = this.p.document.createElement("div");
            r.innerHTML = n;
            for (const n of t.toArray(r.childNodes)) {
                Reflect.set(n, s, true);
                e.content.append(n);
            }
            return true;
        }
        return false;
    }
    L() {
        const t = this.A ?? (this.A = "");
        const e = typeof t;
        if (e !== "string") {
            throw new Error(`Expected the i18n key to be a string, but got ${t} of type ${e}`);
        }
    }
}

n.connectable(TranslationBinding);

e.mixinAstEvaluator(true)(TranslationBinding);

e.mixingBindingLimited(TranslationBinding, (() => "updateTranslations"));

class AccessorUpdateTask {
    constructor(t, e, n, s) {
        this.accessor = t;
        this.v = e;
        this.el = n;
        this.attr = s;
    }
    run() {
        this.accessor.setValue(this.v, this.el, this.attr);
    }
}

class ParameterBinding {
    constructor(t, e, n) {
        this.owner = t;
        this.ast = e;
        this.updater = n;
        this.isBound = false;
        this.boundFn = false;
        this.oL = t.oL;
        this.l = t.l;
    }
    handleChange(t, e) {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this.value = n.astEvaluate(this.ast, this.s, this, this);
        this.obs.clear();
        this.updater();
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.s = t;
        n.astBind(this.ast, t, this);
        this.value = n.astEvaluate(this.ast, t, this, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        n.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

n.connectable(ParameterBinding);

e.mixinAstEvaluator(true)(ParameterBinding);

const x = "tpt";

const m = "t-params.bind";

exports.TranslationParametersAttributePattern = class TranslationParametersAttributePattern {
    [m](t, n, s) {
        return new e.AttrSyntax(t, n, "", m);
    }
};

exports.TranslationParametersAttributePattern = __decorate([ e.attributePattern({
    pattern: m,
    symbols: ""
}) ], exports.TranslationParametersAttributePattern);

class TranslationParametersBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = x;
        this.mode = 2;
    }
}

exports.TranslationParametersBindingCommand = class TranslationParametersBindingCommand {
    constructor() {
        this.type = 0;
    }
    get name() {
        return m;
    }
    build(e, n, s) {
        const r = e.attr;
        let i = r.target;
        if (e.bindable == null) {
            i = s.map(e.node, i) ?? t.camelCase(i);
        } else {
            i = e.bindable.name;
        }
        return new TranslationParametersBindingInstruction(n.parse(r.rawValue, 16), i);
    }
};

exports.TranslationParametersBindingCommand = __decorate([ e.bindingCommand(m) ], exports.TranslationParametersBindingCommand);

exports.TranslationParametersBindingRenderer = class TranslationParametersBindingRenderer {
    render(t, e, n, s, r, i) {
        TranslationBinding.create({
            parser: r,
            observerLocator: i,
            context: t.container,
            controller: t,
            target: e,
            instruction: n,
            isParameterContext: true,
            platform: s
        });
    }
};

exports.TranslationParametersBindingRenderer = __decorate([ e.renderer(x) ], exports.TranslationParametersBindingRenderer);

const g = "tt";

class TranslationAttributePattern {
    static registerAlias(t) {
        this.prototype[t] = function(n, s, r) {
            return new e.AttrSyntax(n, s, "", t);
        };
    }
}

class TranslationBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = g;
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
    build(e, s, r) {
        let i;
        if (e.bindable == null) {
            i = r.map(e.node, e.attr.target) ?? t.camelCase(e.attr.target);
        } else {
            i = e.bindable.name;
        }
        return new TranslationBindingInstruction(new n.CustomExpression(e.attr.rawValue), i);
    }
}

exports.TranslationBindingRenderer = class TranslationBindingRenderer {
    render(t, e, n, s, r, i) {
        TranslationBinding.create({
            parser: r,
            observerLocator: i,
            context: t.container,
            controller: t,
            target: e,
            instruction: n,
            platform: s
        });
    }
};

exports.TranslationBindingRenderer = __decorate([ e.renderer(g) ], exports.TranslationBindingRenderer);

const _ = "tbt";

class TranslationBindAttributePattern {
    static registerAlias(t) {
        const n = `${t}.bind`;
        this.prototype[n] = function(t, s, r) {
            return new e.AttrSyntax(t, s, r[1], n);
        };
    }
}

class TranslationBindBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = _;
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
    build(e, n, s) {
        let r;
        if (e.bindable == null) {
            r = s.map(e.node, e.attr.target) ?? t.camelCase(e.attr.target);
        } else {
            r = e.bindable.name;
        }
        return new TranslationBindBindingInstruction(n.parse(e.attr.rawValue, 16), r);
    }
}

exports.TranslationBindBindingRenderer = class TranslationBindBindingRenderer {
    render(t, e, n, s, r, i) {
        TranslationBinding.create({
            parser: r,
            observerLocator: i,
            context: t.container,
            controller: t,
            target: e,
            instruction: n,
            platform: s
        });
    }
};

exports.TranslationBindBindingRenderer = __decorate([ e.renderer(_) ], exports.TranslationBindBindingRenderer);

exports.TranslationValueConverter = class TranslationValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ i.I18N_SIGNAL ];
    }
    toView(t, e) {
        return this.i18n.tr(t, e);
    }
};

exports.TranslationValueConverter = __decorate([ e.valueConverter("t"), __param(0, l) ], exports.TranslationValueConverter);

const b = [ exports.TranslationValueConverter, exports.TranslationBindingBehavior ];

function coreComponents(n) {
    const s = n.translationAttributeAliases;
    const r = Array.isArray(s) ? s : [ "t" ];
    const i = [];
    const o = [];
    const h = [];
    const u = [];
    for (const t of r) {
        const e = `${t}.bind`;
        i.push({
            pattern: t,
            symbols: ""
        });
        TranslationAttributePattern.registerAlias(t);
        o.push({
            pattern: e,
            symbols: "."
        });
        TranslationBindAttributePattern.registerAlias(t);
        if (t !== "t") {
            h.push(t);
            u.push(e);
        }
    }
    const p = [ e.AttributePattern.define(i, TranslationAttributePattern), e.BindingCommand.define({
        name: "t",
        aliases: h
    }, TranslationBindingCommand), exports.TranslationBindingRenderer, e.AttributePattern.define(o, TranslationBindAttributePattern), e.BindingCommand.define({
        name: "t.bind",
        aliases: u
    }, TranslationBindBindingCommand), exports.TranslationBindBindingRenderer, exports.TranslationParametersAttributePattern, exports.TranslationParametersBindingCommand, exports.TranslationParametersBindingRenderer ];
    return {
        register(s) {
            return s.register(t.Registration.callback(a, (() => n.initOptions)), e.AppTask.activating(l, (t => t.initPromise)), t.Registration.singleton(c, I18nextWrapper), t.Registration.singleton(l, exports.I18nService), ...p, ...b);
        }
    };
}

const T = [ exports.DateFormatValueConverter, exports.DateFormatBindingBehavior ];

const B = [ exports.NumberFormatValueConverter, exports.NumberFormatBindingBehavior ];

const v = [ exports.RelativeTimeValueConverter, exports.RelativeTimeBindingBehavior ];

function createI18nConfiguration(t) {
    return {
        optionsProvider: t,
        register(e) {
            const n = {
                initOptions: Object.create(null)
            };
            t(n);
            return e.register(coreComponents(n), ...T, ...B, ...v);
        },
        customize(e) {
            return createI18nConfiguration(e || t);
        }
    };
}

const w = createI18nConfiguration((() => {}));

exports.I18N = l;

exports.I18nConfiguration = w;

exports.I18nInitOptions = a;

exports.I18nKeyEvaluationResult = I18nKeyEvaluationResult;

exports.Signals = i;

exports.TranslationAttributePattern = TranslationAttributePattern;

exports.TranslationBindAttributePattern = TranslationBindAttributePattern;

exports.TranslationBindBindingCommand = TranslationBindBindingCommand;

exports.TranslationBindBindingInstruction = TranslationBindBindingInstruction;

exports.TranslationBindInstructionType = _;

exports.TranslationBinding = TranslationBinding;

exports.TranslationBindingCommand = TranslationBindingCommand;

exports.TranslationBindingInstruction = TranslationBindingInstruction;

exports.TranslationInstructionType = g;

exports.TranslationParametersBindingInstruction = TranslationParametersBindingInstruction;

exports.TranslationParametersInstructionType = x;
//# sourceMappingURL=index.cjs.map
