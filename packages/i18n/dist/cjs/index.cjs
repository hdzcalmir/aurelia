"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var n = require("@aurelia/runtime-html");

var s = require("@aurelia/runtime");

var e = require("i18next");

function i(t) {
    return t && "object" === typeof t && "default" in t ? t["default"] : t;
}

var r = i(e);

function o(t, n, s, e) {
    var i = arguments.length, r = i < 3 ? n : null === e ? e = Object.getOwnPropertyDescriptor(n, s) : e, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, n, s, e); else for (var a = t.length - 1; a >= 0; a--) if (o = t[a]) r = (i < 3 ? o(r) : i > 3 ? o(n, s, r) : o(n, s)) || r;
    return i > 3 && r && Object.defineProperty(n, s, r), r;
}

function a(t, n) {
    return function(s, e) {
        n(s, e, t);
    };
}

exports.Signals = void 0;

(function(t) {
    t["I18N_EA_CHANNEL"] = "i18n:locale:changed";
    t["I18N_SIGNAL"] = "aurelia-translation-signal";
    t["RT_SIGNAL"] = "aurelia-relativetime-signal";
})(exports.Signals || (exports.Signals = {}));

var c;

(function(t) {
    t["translationValueConverterName"] = "t";
    t["dateFormatValueConverterName"] = "df";
    t["numberFormatValueConverterName"] = "nf";
    t["relativeTimeValueConverterName"] = "rt";
})(c || (c = {}));

function l(t, n) {
    const e = n.ast.expression;
    if (!(e instanceof s.ValueConverterExpression)) {
        const i = new s.ValueConverterExpression(e, t, n.ast.args);
        n.ast.expression = i;
    }
}

exports.DateFormatBindingBehavior = class DateFormatBindingBehavior {
    bind(t, n) {
        l("df", n);
    }
};

exports.DateFormatBindingBehavior = o([ n.bindingBehavior("df") ], exports.DateFormatBindingBehavior);

const h = t.DI.createInterface("I18nInitOptions");

const u = t.DI.createInterface("I18nextWrapper");

class I18nextWrapper {
    constructor() {
        this.i18next = r;
    }
}

var p;

(function(t) {
    t[t["Second"] = 1e3] = "Second";
    t[t["Minute"] = 6e4] = "Minute";
    t[t["Hour"] = 36e5] = "Hour";
    t[t["Day"] = 864e5] = "Day";
    t[t["Week"] = 6048e5] = "Week";
    t[t["Month"] = 2592e6] = "Month";
    t[t["Year"] = 31536e6] = "Year";
})(p || (p = {}));

class I18nKeyEvaluationResult {
    constructor(t) {
        this.value = void 0;
        const n = /\[([a-z\-, ]*)\]/gi;
        this.attributes = [];
        const s = n.exec(t);
        if (s) {
            t = t.replace(s[0], "");
            this.attributes = s[1].split(",");
        }
        this.key = t;
    }
}

const f = t.DI.createInterface("I18N");

exports.I18nService = class I18nService {
    constructor(t, n, s, e) {
        this.ea = s;
        this.i = new Set;
        this.i18next = t.i18next;
        this.initPromise = this.h(n);
        this.u = e;
    }
    evaluate(t, n) {
        const s = t.split(";");
        const e = [];
        for (const t of s) {
            const s = new I18nKeyEvaluationResult(t);
            const i = s.key;
            const r = this.tr(i, n);
            if (this.options.skipTranslationOnMissingKey && r === i) console.warn(`Couldn't find translation for key: ${i}`); else {
                s.value = r;
                e.push(s);
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
        const s = {
            oldLocale: n,
            newLocale: t
        };
        await this.i18next.changeLanguage(t);
        this.ea.publish("i18n:locale:changed", s);
        this.i.forEach((t => t.handleLocaleChange(s)));
        this.u.dispatchSignal("aurelia-translation-signal");
    }
    createNumberFormat(t, n) {
        return Intl.NumberFormat(n || this.getLocale(), t);
    }
    nf(t, n, s) {
        return this.createNumberFormat(n, s).format(t);
    }
    createDateTimeFormat(t, n) {
        return Intl.DateTimeFormat(n || this.getLocale(), t);
    }
    df(t, n, s) {
        return this.createDateTimeFormat(n, s).format(t);
    }
    uf(t, n) {
        const s = this.nf(1e4 / 3, void 0, n);
        let e = s[1];
        const i = s[5];
        if ("." === e) e = "\\.";
        const r = t.replace(new RegExp(e, "g"), "").replace(/[^\d.,-]/g, "").replace(i, ".");
        return Number(r);
    }
    createRelativeTimeFormat(t, n) {
        return new Intl.RelativeTimeFormat(n || this.getLocale(), t);
    }
    rt(t, n, s) {
        let e = t.getTime() - this.now();
        const i = this.options.rtEpsilon * (e > 0 ? 1 : 0);
        const r = this.createRelativeTimeFormat(n, s);
        let o = e / 31536e6;
        if (Math.abs(o + i) >= 1) return r.format(Math.round(o), "year");
        o = e / 2592e6;
        if (Math.abs(o + i) >= 1) return r.format(Math.round(o), "month");
        o = e / 6048e5;
        if (Math.abs(o + i) >= 1) return r.format(Math.round(o), "week");
        o = e / 864e5;
        if (Math.abs(o + i) >= 1) return r.format(Math.round(o), "day");
        o = e / 36e5;
        if (Math.abs(o + i) >= 1) return r.format(Math.round(o), "hour");
        o = e / 6e4;
        if (Math.abs(o + i) >= 1) return r.format(Math.round(o), "minute");
        e = Math.abs(e) < 1e3 ? 1e3 : e;
        o = e / 1e3;
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
        for (const t of this.options.plugins) this.i18next.use(t);
        await this.i18next.init(this.options);
    }
};

exports.I18nService = o([ a(0, u), a(1, h), a(2, t.IEventAggregator), a(3, s.ISignaler) ], exports.I18nService);

exports.DateFormatValueConverter = class DateFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n, s) {
        if (!t && 0 !== t || "string" === typeof t && "" === t.trim()) return t;
        if ("string" === typeof t) {
            const n = Number(t);
            const s = new Date(Number.isInteger(n) ? n : t);
            if (isNaN(s.getTime())) return t;
            t = s;
        }
        return this.i18n.df(t, n, s);
    }
};

exports.DateFormatValueConverter = o([ n.valueConverter("df"), a(0, f) ], exports.DateFormatValueConverter);

exports.NumberFormatBindingBehavior = class NumberFormatBindingBehavior {
    bind(t, n) {
        l("nf", n);
    }
};

exports.NumberFormatBindingBehavior = o([ n.bindingBehavior("nf") ], exports.NumberFormatBindingBehavior);

exports.NumberFormatValueConverter = class NumberFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n, s) {
        if ("number" !== typeof t) return t;
        return this.i18n.nf(t, n, s);
    }
};

exports.NumberFormatValueConverter = o([ n.valueConverter("nf"), a(0, f) ], exports.NumberFormatValueConverter);

exports.RelativeTimeBindingBehavior = class RelativeTimeBindingBehavior {
    bind(t, n) {
        l("rt", n);
    }
};

exports.RelativeTimeBindingBehavior = o([ n.bindingBehavior("rt") ], exports.RelativeTimeBindingBehavior);

exports.RelativeTimeValueConverter = class RelativeTimeValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal", "aurelia-relativetime-signal" ];
    }
    toView(t, n, s) {
        if (!(t instanceof Date)) return t;
        return this.i18n.rt(t, n, s);
    }
};

exports.RelativeTimeValueConverter = o([ n.valueConverter("rt"), a(0, f) ], exports.RelativeTimeValueConverter);

exports.TranslationBindingBehavior = class TranslationBindingBehavior {
    bind(t, n) {
        const e = n.ast.expression;
        if (!(e instanceof s.ValueConverterExpression)) {
            const t = new s.ValueConverterExpression(e, "t", n.ast.args);
            n.ast.expression = t;
        }
    }
};

exports.TranslationBindingBehavior = o([ n.bindingBehavior("t") ], exports.TranslationBindingBehavior);

const d = [ "textContent", "innerHTML", "prepend", "append" ];

const x = new Map([ [ "text", "textContent" ], [ "html", "innerHTML" ] ]);

const g = {
    optional: true
};

const m = {
    reusable: false,
    preempt: true
};

class TranslationBinding {
    constructor(t, n, s, e, i) {
        this.isBound = false;
        this.T = d;
        this.B = null;
        this.parameter = null;
        this.boundFn = false;
        this.l = n;
        this.C = t;
        this.target = i;
        this.i18n = n.get(f);
        this.p = e;
        this.I = new Set;
        this.oL = s;
        this.i18n.subscribeLocaleChange(this);
        this.P = e.domWriteQueue;
    }
    static create({parser: t, observerLocator: n, context: e, controller: i, target: r, instruction: o, platform: a, isParameterContext: c}) {
        const l = this.M({
            observerLocator: n,
            context: e,
            controller: i,
            target: r,
            platform: a
        });
        const h = "string" === typeof o.from ? t.parse(o.from, 16) : o.from;
        if (c) l.useParameter(h); else {
            const n = h instanceof s.CustomExpression ? t.parse(h.value, 1) : void 0;
            l.ast = n || h;
        }
    }
    static M({observerLocator: t, context: n, controller: s, target: e, platform: i}) {
        let r = s.bindings && s.bindings.find((t => t instanceof TranslationBinding && t.target === e));
        if (!r) {
            r = new TranslationBinding(s, n, t, i, e);
            s.addBinding(r);
        }
        return r;
    }
    bind(t) {
        if (this.isBound) return;
        if (!this.ast) throw new Error("key expression is missing");
        this.s = t;
        this.A = this.ast instanceof s.Interpolation;
        this.L = s.astEvaluate(this.ast, t, this, this);
        this.R();
        this.parameter?.bind(t);
        this.updateTranslations();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        s.astUnbind(this.ast, this.s, this);
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
        this.L = this.A ? s.astEvaluate(this.ast, this.s, this, this) : t;
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
        const s = Object.create(null);
        const e = [];
        const i = this.B;
        this.I.clear();
        for (const i of t) {
            const t = i.value;
            const r = this._(i.attributes);
            for (const i of r) if (this.N(i)) s[i] = t; else {
                const s = n.CustomElement.for(this.target, g);
                const r = s?.viewModel ? this.oL.getAccessor(s.viewModel, i) : this.oL.getAccessor(this.target, i);
                const o = 1 !== this.C.state && (4 & r.type) > 0;
                if (o) e.push(new AccessorUpdateTask(r, t, this.target, i)); else r.setValue(t, this.target, i);
                this.I.add(r);
            }
        }
        let r = false;
        if (Object.keys(s).length > 0) {
            r = 1 !== this.C.state;
            if (!r) this.O(s);
        }
        if (e.length > 0 || r) this.B = this.P.queueTask((() => {
            this.B = null;
            for (const t of e) t.run();
            if (r) this.O(s);
        }), m);
        i?.cancel();
    }
    _(t) {
        if (0 === t.length) t = "IMG" === this.target.tagName ? [ "src" ] : [ "textContent" ];
        for (const [n, s] of x) {
            const e = t.findIndex((t => t === n));
            if (e > -1) t.splice(e, 1, s);
        }
        return t;
    }
    N(t) {
        return this.T.includes(t);
    }
    O(n) {
        const s = t.toArray(this.target.childNodes);
        const e = [];
        const i = "au-i18n";
        for (const t of s) if (!Reflect.get(t, i)) e.push(t);
        const r = this.j(n, i, e);
        this.target.innerHTML = "";
        for (const n of t.toArray(r.content.childNodes)) this.target.appendChild(n);
    }
    j(t, n, s) {
        const e = this.p.document.createElement("template");
        this.V(e, t.prepend, n);
        if (!this.V(e, t.innerHTML ?? t.textContent, n)) for (const t of s) e.content.append(t);
        this.V(e, t.append, n);
        return e;
    }
    V(n, s, e) {
        if (void 0 !== s && null !== s) {
            const i = this.p.document.createElement("div");
            i.innerHTML = s;
            for (const s of t.toArray(i.childNodes)) {
                Reflect.set(s, e, true);
                n.content.append(s);
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

s.connectable(TranslationBinding);

n.mixinAstEvaluator(true)(TranslationBinding);

n.mixingBindingLimited(TranslationBinding, (() => "updateTranslations"));

class AccessorUpdateTask {
    constructor(t, n, s, e) {
        this.accessor = t;
        this.v = n;
        this.el = s;
        this.attr = e;
    }
    run() {
        this.accessor.setValue(this.v, this.el, this.attr);
    }
}

class ParameterBinding {
    constructor(t, n, s) {
        this.owner = t;
        this.ast = n;
        this.updater = s;
        this.isBound = false;
        this.boundFn = false;
        this.oL = t.oL;
        this.l = t.l;
    }
    handleChange(t, n) {
        if (!this.isBound) return;
        this.obs.version++;
        this.value = s.astEvaluate(this.ast, this.s, this, this);
        this.obs.clear();
        this.updater();
    }
    bind(t) {
        if (this.isBound) return;
        this.s = t;
        s.astBind(this.ast, t, this);
        this.value = s.astEvaluate(this.ast, t, this, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

s.connectable(ParameterBinding);

n.mixinAstEvaluator(true)(ParameterBinding);

const b = "tpt";

const T = "t-params.bind";

exports.TranslationParametersAttributePattern = class TranslationParametersAttributePattern {
    [T](t, s, e) {
        return new n.AttrSyntax(t, s, "", T);
    }
};

exports.TranslationParametersAttributePattern = o([ n.attributePattern({
    pattern: T,
    symbols: ""
}) ], exports.TranslationParametersAttributePattern);

class TranslationParametersBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = b;
        this.mode = 2;
    }
}

exports.TranslationParametersBindingCommand = class TranslationParametersBindingCommand {
    constructor() {
        this.type = 0;
    }
    get name() {
        return T;
    }
    build(n, s, e) {
        const i = n.attr;
        let r = i.target;
        if (null == n.bindable) r = e.map(n.node, r) ?? t.camelCase(r); else r = n.bindable.property;
        return new TranslationParametersBindingInstruction(s.parse(i.rawValue, 16), r);
    }
};

exports.TranslationParametersBindingCommand = o([ n.bindingCommand(T) ], exports.TranslationParametersBindingCommand);

exports.TranslationParametersBindingRenderer = class TranslationParametersBindingRenderer {
    render(t, n, s, e, i, r) {
        TranslationBinding.create({
            parser: i,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: s,
            isParameterContext: true,
            platform: e
        });
    }
};

exports.TranslationParametersBindingRenderer = o([ n.renderer(b) ], exports.TranslationParametersBindingRenderer);

const B = "tt";

class TranslationAttributePattern {
    static registerAlias(t) {
        this.prototype[t] = function(s, e, i) {
            return new n.AttrSyntax(s, e, "", t);
        };
    }
}

class TranslationBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = B;
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
    build(n, e, i) {
        let r;
        if (null == n.bindable) r = i.map(n.node, n.attr.target) ?? t.camelCase(n.attr.target); else r = n.bindable.property;
        return new TranslationBindingInstruction(new s.CustomExpression(n.attr.rawValue), r);
    }
}

exports.TranslationBindingRenderer = class TranslationBindingRenderer {
    render(t, n, s, e, i, r) {
        TranslationBinding.create({
            parser: i,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: s,
            platform: e
        });
    }
};

exports.TranslationBindingRenderer = o([ n.renderer(B) ], exports.TranslationBindingRenderer);

const v = "tbt";

class TranslationBindAttributePattern {
    static registerAlias(t) {
        const s = `${t}.bind`;
        this.prototype[s] = function(t, e, i) {
            return new n.AttrSyntax(t, e, i[1], s);
        };
    }
}

class TranslationBindBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = v;
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
    build(n, s, e) {
        let i;
        if (null == n.bindable) i = e.map(n.node, n.attr.target) ?? t.camelCase(n.attr.target); else i = n.bindable.property;
        return new TranslationBindBindingInstruction(s.parse(n.attr.rawValue, 16), i);
    }
}

exports.TranslationBindBindingRenderer = class TranslationBindBindingRenderer {
    render(t, n, s, e, i, r) {
        TranslationBinding.create({
            parser: i,
            observerLocator: r,
            context: t.container,
            controller: t,
            target: n,
            instruction: s,
            platform: e
        });
    }
};

exports.TranslationBindBindingRenderer = o([ n.renderer(v) ], exports.TranslationBindBindingRenderer);

exports.TranslationValueConverter = class TranslationValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n) {
        return this.i18n.tr(t, n);
    }
};

exports.TranslationValueConverter = o([ n.valueConverter("t"), a(0, f) ], exports.TranslationValueConverter);

const w = [ exports.TranslationValueConverter, exports.TranslationBindingBehavior ];

function y(s) {
    const e = s.translationAttributeAliases;
    const i = Array.isArray(e) ? e : [ "t" ];
    const r = [];
    const o = [];
    const a = [];
    const c = [];
    for (const t of i) {
        const n = `${t}.bind`;
        r.push({
            pattern: t,
            symbols: ""
        });
        TranslationAttributePattern.registerAlias(t);
        o.push({
            pattern: n,
            symbols: "."
        });
        TranslationBindAttributePattern.registerAlias(t);
        if ("t" !== t) {
            a.push(t);
            c.push(n);
        }
    }
    const l = [ n.AttributePattern.define(r, TranslationAttributePattern), n.BindingCommand.define({
        name: "t",
        aliases: a
    }, TranslationBindingCommand), exports.TranslationBindingRenderer, n.AttributePattern.define(o, TranslationBindAttributePattern), n.BindingCommand.define({
        name: "t.bind",
        aliases: c
    }, TranslationBindBindingCommand), exports.TranslationBindBindingRenderer, exports.TranslationParametersAttributePattern, exports.TranslationParametersBindingCommand, exports.TranslationParametersBindingRenderer ];
    return {
        register(e) {
            return e.register(t.Registration.callback(h, (() => s.initOptions)), n.AppTask.activating(f, (t => t.initPromise)), t.Registration.singleton(u, I18nextWrapper), t.Registration.singleton(f, exports.I18nService), ...l, ...w);
        }
    };
}

const C = [ exports.DateFormatValueConverter, exports.DateFormatBindingBehavior ];

const I = [ exports.NumberFormatValueConverter, exports.NumberFormatBindingBehavior ];

const P = [ exports.RelativeTimeValueConverter, exports.RelativeTimeBindingBehavior ];

function M(t) {
    return {
        optionsProvider: t,
        register(n) {
            const s = {
                initOptions: Object.create(null)
            };
            t(s);
            return n.register(y(s), ...C, ...I, ...P);
        },
        customize(n) {
            return M(n || t);
        }
    };
}

const A = M((() => {}));

exports.I18N = f;

exports.I18nConfiguration = A;

exports.I18nInitOptions = h;

exports.I18nKeyEvaluationResult = I18nKeyEvaluationResult;

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
