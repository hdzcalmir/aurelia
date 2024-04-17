"use strict";

var t = require("@aurelia/kernel");

var n = require("@aurelia/runtime-html");

var e = require("@aurelia/expression-parser");

var i = require("@aurelia/runtime");

var r = require("i18next");

const s = {
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

function createIntlFormatValueConverterExpression(t, n) {
    const i = n.ast.expression;
    if (!(i instanceof e.ValueConverterExpression)) {
        const r = new e.ValueConverterExpression(i, t, n.ast.args);
        n.ast.expression = r;
    }
}

const a = "Interpolation";

const l = "IsProperty";

const c = n.BindingMode.toView;

const h = n.State.activating;

const u = "binding-behavior";

const f = "value-converter";

class DateFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("df", n);
    }
}

DateFormatBindingBehavior.$au = {
    type: u,
    name: "df"
};

function __esDecorate(t, n, e, i, r, s) {
    function accept(t) {
        if (t !== void 0 && typeof t !== "function") throw new TypeError("Function expected");
        return t;
    }
    var o = i.kind, a = o === "getter" ? "get" : o === "setter" ? "set" : "value";
    var l = !n && t ? i["static"] ? t : t.prototype : null;
    var c = n || (l ? Object.getOwnPropertyDescriptor(l, i.name) : {});
    var h, u = false;
    for (var f = e.length - 1; f >= 0; f--) {
        var d = {};
        for (var m in i) d[m] = m === "access" ? {} : i[m];
        for (var m in i.access) d.access[m] = i.access[m];
        d.addInitializer = function(t) {
            if (u) throw new TypeError("Cannot add initializers after decoration has completed");
            s.push(accept(t || null));
        };
        var p = (0, e[f])(o === "accessor" ? {
            get: c.get,
            set: c.set
        } : c[a], d);
        if (o === "accessor") {
            if (p === void 0) continue;
            if (p === null || typeof p !== "object") throw new TypeError("Object expected");
            if (h = accept(p.get)) c.get = h;
            if (h = accept(p.set)) c.set = h;
            if (h = accept(p.init)) r.unshift(h);
        } else if (h = accept(p)) {
            if (o === "field") r.unshift(h); else c[a] = h;
        }
    }
    if (l) Object.defineProperty(l, i.name, c);
    u = true;
}

function __runInitializers(t, n, e) {
    var i = arguments.length > 2;
    for (var r = 0; r < n.length; r++) {
        e = i ? n[r].call(t, e) : n[r].call(t);
    }
    return i ? e : void 0;
}

const d = /*@__PURE__*/ t.DI.createInterface("I18nInitOptions");

const m = /*@__PURE__*/ t.DI.createInterface("II18nextWrapper");

class I18nextWrapper {
    constructor() {
        this.i18next = r;
    }
}

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

const p = /*@__PURE__*/ t.DI.createInterface("I18N");

let g = (() => {
    var e;
    let r;
    let o = [];
    let a = [];
    return e = class I18nService {
        constructor() {
            this.i18next = __runInitializers(this, o, void 0);
            this.initPromise = __runInitializers(this, a);
            this.i = new Set;
            this.h = t.resolve(n.ISignaler);
            this.ea = t.resolve(t.IEventAggregator);
            this.i18next = t.resolve(m).i18next;
            this.initPromise = this.u(t.resolve(d));
        }
        evaluate(t, n) {
            const e = t.split(";");
            const i = [];
            for (const t of e) {
                const e = new I18nKeyEvaluationResult(t);
                const r = e.key;
                const s = this.tr(r, n);
                if (this.options.skipTranslationOnMissingKey && s === r) {
                    console.warn(`Couldn't find translation for key: ${r}`);
                } else {
                    e.value = s;
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
            this.ea.publish(s.I18N_EA_CHANNEL, e);
            this.i.forEach((t => t.handleLocaleChange(e)));
            this.h.dispatchSignal(s.I18N_SIGNAL);
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
            const r = e[5];
            if (i === ".") {
                i = "\\.";
            }
            const s = t.replace(new RegExp(i, "g"), "").replace(/[^\d.,-]/g, "").replace(r, ".");
            return Number(s);
        }
        createRelativeTimeFormat(t, n) {
            return new Intl.RelativeTimeFormat(n || this.getLocale(), t);
        }
        rt(t, n, e) {
            let i = t.getTime() - this.now();
            const r = this.options.rtEpsilon * (i > 0 ? 1 : 0);
            const s = this.createRelativeTimeFormat(n, e);
            let o = i / 31536e6;
            if (Math.abs(o + r) >= 1) {
                return s.format(Math.round(o), "year");
            }
            o = i / 2592e6;
            if (Math.abs(o + r) >= 1) {
                return s.format(Math.round(o), "month");
            }
            o = i / 6048e5;
            if (Math.abs(o + r) >= 1) {
                return s.format(Math.round(o), "week");
            }
            o = i / 864e5;
            if (Math.abs(o + r) >= 1) {
                return s.format(Math.round(o), "day");
            }
            o = i / 36e5;
            if (Math.abs(o + r) >= 1) {
                return s.format(Math.round(o), "hour");
            }
            o = i / 6e4;
            if (Math.abs(o + r) >= 1) {
                return s.format(Math.round(o), "minute");
            }
            i = Math.abs(i) < 1e3 ? 1e3 : i;
            o = i / 1e3;
            return s.format(Math.round(o), "second");
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
        async u(t) {
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
    }, (() => {
        const t = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        r = [ i.nowrap ];
        __esDecorate(null, null, r, {
            kind: "field",
            name: "i18next",
            static: false,
            private: false,
            access: {
                has: t => "i18next" in t,
                get: t => t.i18next,
                set: (t, n) => {
                    t.i18next = n;
                }
            },
            metadata: t
        }, o, a);
        if (t) Object.defineProperty(e, Symbol.metadata, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: t
        });
    })(), e;
})();

class DateFormatValueConverter {
    constructor() {
        this.signals = [ s.I18N_SIGNAL ];
        this.i18n = t.resolve(p);
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
}

DateFormatValueConverter.$au = {
    type: f,
    name: "df"
};

class NumberFormatBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("nf", n);
    }
}

NumberFormatBindingBehavior.$au = {
    type: u,
    name: "nf"
};

class NumberFormatValueConverter {
    constructor() {
        this.signals = [ s.I18N_SIGNAL ];
        this.i18n = t.resolve(p);
    }
    toView(t, n, e) {
        if (typeof t !== "number") {
            return t;
        }
        return this.i18n.nf(t, n, e);
    }
}

NumberFormatValueConverter.$au = {
    type: f,
    name: "nf"
};

class RelativeTimeBindingBehavior {
    bind(t, n) {
        createIntlFormatValueConverterExpression("rt", n);
    }
}

RelativeTimeBindingBehavior.$au = {
    type: u,
    name: "rt"
};

class RelativeTimeValueConverter {
    constructor() {
        this.signals = [ s.I18N_SIGNAL, s.RT_SIGNAL ];
        this.i18n = t.resolve(p);
    }
    toView(t, n, e) {
        if (!(t instanceof Date)) {
            return t;
        }
        return this.i18n.rt(t, n, e);
    }
}

RelativeTimeValueConverter.$au = {
    type: f,
    name: "rt"
};

class TranslationBindingBehavior {
    bind(t, n) {
        const i = n.ast.expression;
        if (!(i instanceof e.ValueConverterExpression)) {
            const t = new e.ValueConverterExpression(i, "t", n.ast.args);
            n.ast.expression = t;
        }
    }
}

n.BindingBehavior.define("t", TranslationBindingBehavior);

const v = [ "textContent", "innerHTML", "prepend", "append" ];

const B = new Map([ [ "text", "textContent" ], [ "html", "innerHTML" ] ]);

const b = {
    optional: true
};

const T = {
    reusable: false,
    preempt: true
};

class TranslationBinding {
    static create({parser: t, observerLocator: n, context: i, controller: r, target: s, instruction: o, platform: c, isParameterContext: h}) {
        const u = this.B({
            observerLocator: n,
            context: i,
            controller: r,
            target: s,
            platform: c
        });
        const f = typeof o.from === "string" ? t.parse(o.from, l) : o.from;
        if (h) {
            u.useParameter(f);
        } else {
            const n = f instanceof e.CustomExpression ? t.parse(f.value, a) : undefined;
            u.ast = n || f;
        }
    }
    static B({observerLocator: t, context: n, controller: e, target: i, platform: r}) {
        let s = e.bindings && e.bindings.find((t => t instanceof TranslationBinding && t.target === i));
        if (!s) {
            s = new TranslationBinding(e, n, t, r, i);
            e.addBinding(s);
        }
        return s;
    }
    constructor(t, n, e, i, r) {
        this.isBound = false;
        this.T = v;
        this.C = null;
        this.parameter = null;
        this.boundFn = false;
        this.l = n;
        this.I = t;
        this.target = r;
        this.i18n = n.get(p);
        this.p = i;
        this.P = new Set;
        this.oL = e;
        this.F = i.domWriteQueue;
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        const e = this.ast;
        if (e == null) {
            throw new Error("key expression is missing");
        }
        this.s = t;
        this.i18n.subscribeLocaleChange(this);
        this.V = n.astEvaluate(e, t, this, this);
        this._();
        this.parameter?.bind(t);
        this.updateTranslations();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.i18n.unsubscribeLocaleChange(this);
        n.astUnbind(this.ast, this.s, this);
        this.parameter?.unbind();
        this.P.clear();
        if (this.C !== null) {
            this.C.cancel();
            this.C = null;
        }
        this.s = void 0;
        this.obs.clearAll();
    }
    handleChange(t, e) {
        this.obs.version++;
        this.V = n.astEvaluate(this.ast, this.s, this, this);
        this.obs.clear();
        this._();
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
        const e = this.i18n.evaluate(this.V, this.parameter?.value);
        const r = Object.create(null);
        const s = [];
        const o = this.C;
        this.P.clear();
        for (const o of e) {
            const e = o.value;
            const a = this.N(o.attributes);
            for (const o of a) {
                if (this.A(o)) {
                    r[o] = e;
                } else {
                    const r = n.CustomElement.for(this.target, b);
                    const a = r?.viewModel ? this.oL.getAccessor(r.viewModel, t.camelCase(o)) : this.oL.getAccessor(this.target, o);
                    const l = this.I.state !== h && (a.type & i.AccessorType.Layout) > 0;
                    if (l) {
                        s.push(new AccessorUpdateTask(a, e, this.target, o));
                    } else {
                        a.setValue(e, this.target, o);
                    }
                    this.P.add(a);
                }
            }
        }
        let a = false;
        if (Object.keys(r).length > 0) {
            a = this.I.state !== h;
            if (!a) {
                this.L(r);
            }
        }
        if (s.length > 0 || a) {
            this.C = this.F.queueTask((() => {
                this.C = null;
                for (const t of s) {
                    t.run();
                }
                if (a) {
                    this.L(r);
                }
            }), T);
        }
        o?.cancel();
    }
    N(t) {
        if (t.length === 0) {
            t = this.target.tagName === "IMG" ? [ "src" ] : [ "textContent" ];
        }
        for (const [n, e] of B) {
            const i = t.findIndex((t => t === n));
            if (i > -1) {
                t.splice(i, 1, e);
            }
        }
        return t;
    }
    A(t) {
        return this.T.includes(t);
    }
    L(n) {
        const e = t.toArray(this.target.childNodes);
        const i = [];
        const r = "au-i18n";
        for (const t of e) {
            if (!Reflect.get(t, r)) {
                i.push(t);
            }
        }
        const s = this.M(n, r, i);
        this.target.innerHTML = "";
        for (const n of t.toArray(s.content.childNodes)) {
            this.target.appendChild(n);
        }
    }
    M(t, n, e) {
        const i = this.p.document.createElement("template");
        this.R(i, t.prepend, n);
        if (!this.R(i, t.innerHTML ?? t.textContent, n)) {
            for (const t of e) {
                i.content.append(t);
            }
        }
        this.R(i, t.append, n);
        return i;
    }
    R(n, e, i) {
        if (e !== void 0 && e !== null) {
            const r = this.p.document.createElement("div");
            r.innerHTML = e;
            for (const e of t.toArray(r.childNodes)) {
                Reflect.set(e, i, true);
                n.content.append(e);
            }
            return true;
        }
        return false;
    }
    _() {
        const t = this.V ??= "";
        const n = typeof t;
        if (n !== "string") {
            throw new Error(`Expected the i18n key to be a string, but got ${t} of type ${n}`);
        }
    }
}

i.connectable(TranslationBinding, null);

n.mixinAstEvaluator(true)(TranslationBinding);

n.mixingBindingLimited(TranslationBinding, (() => "updateTranslations"));

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

i.connectable(ParameterBinding, null);

n.mixinAstEvaluator(true)(ParameterBinding);

const x = "tpt";

const C = "t-params.bind";

const w = n.AttributePattern.define([ {
    pattern: C,
    symbols: ""
} ], class TranslationParametersAttributePattern {
    [C](t, e) {
        return new n.AttrSyntax(t, e, "", C);
    }
});

class TranslationParametersBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = x;
        this.mode = c;
    }
}

class TranslationParametersBindingCommand {
    constructor() {
        this.ignoreAttr = false;
    }
    build(n, e, i) {
        const r = n.attr;
        let s = r.target;
        if (n.bindable == null) {
            s = i.map(n.node, s) ?? t.camelCase(s);
        } else {
            s = n.bindable.name;
        }
        return new TranslationParametersBindingInstruction(e.parse(r.rawValue, l), s);
    }
}

TranslationParametersBindingCommand.$au = {
    type: "binding-command",
    name: C
};

const y = /*@__PURE__*/ n.renderer(class TranslationParametersBindingRenderer {
    constructor() {
        this.target = x;
    }
    render(t, n, e, i, r, s) {
        TranslationBinding.create({
            parser: r,
            observerLocator: s,
            context: t.container,
            controller: t,
            target: n,
            instruction: e,
            isParameterContext: true,
            platform: i
        });
    }
}, null);

const I = "tt";

class TranslationAttributePattern {
    static registerAlias(t) {
        this.prototype[t] = function(e, i, r) {
            return new n.AttrSyntax(e, i, "", t);
        };
    }
}

class TranslationBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = I;
        this.mode = c;
    }
}

class TranslationBindingCommand {
    constructor() {
        this.ignoreAttr = false;
    }
    build(n, i, r) {
        let s;
        if (n.bindable == null) {
            s = r.map(n.node, n.attr.target) ?? t.camelCase(n.attr.target);
        } else {
            s = n.bindable.name;
        }
        return new TranslationBindingInstruction(new e.CustomExpression(n.attr.rawValue), s);
    }
}

const P = /*@__PURE__*/ n.renderer(class TranslationBindingRenderer {
    constructor() {
        this.target = I;
    }
    render(t, n, e, i, r, s) {
        TranslationBinding.create({
            parser: r,
            observerLocator: s,
            context: t.container,
            controller: t,
            target: n,
            instruction: e,
            platform: i
        });
    }
}, null);

const F = "tbt";

class TranslationBindAttributePattern {
    static registerAlias(t) {
        const e = `${t}.bind`;
        this.prototype[e] = function(t, i, r) {
            return new n.AttrSyntax(t, i, r[1], e);
        };
    }
}

class TranslationBindBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = F;
        this.mode = c;
    }
}

class TranslationBindBindingCommand {
    constructor() {
        this.ignoreAttr = false;
    }
    build(n, e, i) {
        let r;
        if (n.bindable == null) {
            r = i.map(n.node, n.attr.target) ?? t.camelCase(n.attr.target);
        } else {
            r = n.bindable.name;
        }
        return new TranslationBindBindingInstruction(e.parse(n.attr.rawValue, l), r);
    }
}

const V = /*@__PURE__*/ n.renderer(class TranslationBindBindingRenderer {
    constructor() {
        this.target = F;
    }
    render(t, n, e, i, r, s) {
        TranslationBinding.create({
            parser: r,
            observerLocator: s,
            context: t.container,
            controller: t,
            target: n,
            instruction: e,
            platform: i
        });
    }
}, null);

class TranslationValueConverter {
    constructor() {
        this.signals = [ s.I18N_SIGNAL ];
        this.i18n = t.resolve(p);
    }
    toView(t, n) {
        return this.i18n.tr(t, n);
    }
}

n.ValueConverter.define("t", TranslationValueConverter);

const _ = [ TranslationValueConverter, TranslationBindingBehavior ];

function coreComponents(e) {
    const i = e.translationAttributeAliases;
    const r = Array.isArray(i) ? i : [ "t" ];
    const s = [];
    const o = [];
    const a = [];
    const l = [];
    for (const t of r) {
        const n = `${t}.bind`;
        s.push({
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
            l.push(n);
        }
    }
    const c = [ n.AttributePattern.define(s, TranslationAttributePattern), n.BindingCommand.define({
        name: "t",
        aliases: a
    }, TranslationBindingCommand), P, n.AttributePattern.define(o, TranslationBindAttributePattern), n.BindingCommand.define({
        name: "t.bind",
        aliases: l
    }, TranslationBindBindingCommand), V, w, TranslationParametersBindingCommand, y ];
    return {
        register(i) {
            const r = e.i18nextWrapper != null && typeof e.i18nextWrapper === "object" ? t.Registration.instance(m, e.i18nextWrapper) : t.Registration.singleton(m, I18nextWrapper);
            return i.register(t.Registration.callback(d, (() => e.initOptions)), n.AppTask.activating(p, (t => t.initPromise)), r, t.Registration.singleton(p, g), ...c, ..._);
        }
    };
}

const N = [ DateFormatValueConverter, DateFormatBindingBehavior ];

const A = [ NumberFormatValueConverter, NumberFormatBindingBehavior ];

const E = [ RelativeTimeValueConverter, RelativeTimeBindingBehavior ];

function createI18nConfiguration(t) {
    return {
        optionsProvider: t,
        register(n) {
            const e = {
                initOptions: Object.create(null)
            };
            t(e);
            return n.register(coreComponents(e), ...N, ...A, ...E);
        },
        customize(n) {
            return createI18nConfiguration(n || t);
        }
    };
}

const L = createI18nConfiguration((() => {}));

exports.DateFormatBindingBehavior = DateFormatBindingBehavior;

exports.DateFormatValueConverter = DateFormatValueConverter;

exports.I18N = p;

exports.I18nConfiguration = L;

exports.I18nInitOptions = d;

exports.I18nKeyEvaluationResult = I18nKeyEvaluationResult;

exports.I18nService = g;

exports.II18nextWrapper = m;

exports.NumberFormatBindingBehavior = NumberFormatBindingBehavior;

exports.NumberFormatValueConverter = NumberFormatValueConverter;

exports.RelativeTimeBindingBehavior = RelativeTimeBindingBehavior;

exports.RelativeTimeValueConverter = RelativeTimeValueConverter;

exports.Signals = s;

exports.TranslationAttributePattern = TranslationAttributePattern;

exports.TranslationBindAttributePattern = TranslationBindAttributePattern;

exports.TranslationBindBindingCommand = TranslationBindBindingCommand;

exports.TranslationBindBindingInstruction = TranslationBindBindingInstruction;

exports.TranslationBindBindingRenderer = V;

exports.TranslationBindInstructionType = F;

exports.TranslationBinding = TranslationBinding;

exports.TranslationBindingBehavior = TranslationBindingBehavior;

exports.TranslationBindingCommand = TranslationBindingCommand;

exports.TranslationBindingInstruction = TranslationBindingInstruction;

exports.TranslationBindingRenderer = P;

exports.TranslationInstructionType = I;

exports.TranslationParametersAttributePattern = w;

exports.TranslationParametersBindingCommand = TranslationParametersBindingCommand;

exports.TranslationParametersBindingInstruction = TranslationParametersBindingInstruction;

exports.TranslationParametersBindingRenderer = y;

exports.TranslationParametersInstructionType = x;

exports.TranslationValueConverter = TranslationValueConverter;
//# sourceMappingURL=index.cjs.map
