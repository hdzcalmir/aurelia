"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var e = require("@aurelia/i18n");

var r = require("@aurelia/kernel");

var t = require("@aurelia/runtime");

var a = require("@aurelia/runtime-html");

var i = require("@aurelia/validation");

var o = require("@aurelia/validation-html");

function __decorate(e, r, t, a) {
    var i = arguments.length, o = i < 3 ? r : a === null ? a = Object.getOwnPropertyDescriptor(r, t) : a, n;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") o = Reflect.decorate(e, r, t, a); else for (var s = e.length - 1; s >= 0; s--) if (n = e[s]) o = (i < 3 ? n(o) : i > 3 ? n(r, t, o) : n(r, t)) || o;
    return i > 3 && o && Object.defineProperty(r, t, o), o;
}

function __param(e, r) {
    return function(t, a) {
        r(t, a, e);
    };
}

const n = "i18n:locale:changed:validation";

const s = /*@__PURE__*/ r.DI.createInterface("I18nKeyConfiguration");

exports.LocalizedValidationController = class LocalizedValidationController extends o.ValidationController {
    constructor(e, r, t, a, i) {
        super(t, a, i, e);
        this.localeChangeSubscription = r.subscribe(n, (() => {
            i.domReadQueue.queueTask((async () => {
                await this.revalidateErrors();
            }));
        }));
    }
};

exports.LocalizedValidationController = __decorate([ __param(0, r.IServiceLocator), __param(1, r.IEventAggregator), __param(2, i.IValidator), __param(3, t.IExpressionParser), __param(4, a.IPlatform) ], exports.LocalizedValidationController);

class LocalizedValidationControllerFactory extends o.ValidationControllerFactory {
    construct(e, r) {
        return e.invoke(exports.LocalizedValidationController, r);
    }
}

exports.LocalizedValidationMessageProvider = class LocalizedValidationMessageProvider extends i.ValidationMessageProvider {
    constructor(r, t, a, i, o) {
        super(i, o, []);
        this.i18n = t;
        const s = r.DefaultNamespace;
        const c = r.DefaultKeyPrefix;
        if (s !== void 0 || c !== void 0) {
            this.keyPrefix = s !== void 0 ? `${s}:` : "";
            this.keyPrefix = c !== void 0 ? `${this.keyPrefix}${c}.` : this.keyPrefix;
        }
        a.subscribe(e.Signals.I18N_EA_CHANNEL, (() => {
            this.registeredMessages = new WeakMap;
            a.publish(n);
        }));
    }
    getMessage(e) {
        const r = this.registeredMessages.get(e);
        if (r !== void 0) {
            return r;
        }
        return this.setMessage(e, this.i18n.tr(this.getKey(e.messageKey)));
    }
    getDisplayName(e, r) {
        if (r !== null && r !== undefined) {
            return r instanceof Function ? r() : r;
        }
        if (e === void 0) {
            return;
        }
        return this.i18n.tr(this.getKey(e));
    }
    getKey(e) {
        const r = this.keyPrefix;
        return r !== void 0 ? `${r}${e}` : e;
    }
};

exports.LocalizedValidationMessageProvider = __decorate([ __param(0, s), __param(1, e.I18N), __param(2, r.IEventAggregator), __param(3, t.IExpressionParser), __param(4, r.ILogger) ], exports.LocalizedValidationMessageProvider);

function createConfiguration(e) {
    return {
        optionsProvider: e,
        register(t) {
            const a = {
                ...o.getDefaultValidationHtmlConfiguration(),
                MessageProviderType: exports.LocalizedValidationMessageProvider,
                ValidationControllerFactoryType: LocalizedValidationControllerFactory,
                DefaultNamespace: void 0,
                DefaultKeyPrefix: void 0
            };
            e(a);
            const i = {
                DefaultNamespace: a.DefaultNamespace,
                DefaultKeyPrefix: a.DefaultKeyPrefix
            };
            return t.register(o.ValidationHtmlConfiguration.customize((e => {
                for (const r of Object.keys(e)) {
                    if (r in a) {
                        e[r] = a[r];
                    }
                }
            })), r.Registration.callback(s, (() => i)));
        },
        customize(r) {
            return createConfiguration(r ?? e);
        }
    };
}

const c = createConfiguration(r.noop);

exports.I18nKeyConfiguration = s;

exports.LocalizedValidationControllerFactory = LocalizedValidationControllerFactory;

exports.ValidationI18nConfiguration = c;
//# sourceMappingURL=index.cjs.map
