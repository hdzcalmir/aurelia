"use strict";

var e = require("@aurelia/i18n");

var i = require("@aurelia/kernel");

var t = require("@aurelia/runtime-html");

var r = require("@aurelia/validation");

var o = require("@aurelia/validation-html");

const a = "i18n:locale:changed:validation";

const n = /*@__PURE__*/ i.DI.createInterface("I18nKeyConfiguration");

class LocalizedValidationController extends o.ValidationController {
    constructor(e = i.resolve(i.IEventAggregator), r = i.resolve(t.IPlatform)) {
        super();
        this.localeChangeSubscription = e.subscribe(a, (() => {
            r.domReadQueue.queueTask((async () => {
                await this.revalidateErrors();
            }));
        }));
    }
}

class LocalizedValidationControllerFactory extends o.ValidationControllerFactory {
    construct(e, i) {
        return e.invoke(LocalizedValidationController, i);
    }
}

class LocalizedValidationMessageProvider extends r.ValidationMessageProvider {
    constructor(t = i.resolve(n), r = i.resolve(i.IEventAggregator)) {
        super(undefined, []);
        this.i18n = i.resolve(e.I18N);
        const o = t.DefaultNamespace;
        const s = t.DefaultKeyPrefix;
        if (o !== void 0 || s !== void 0) {
            this.keyPrefix = o !== void 0 ? `${o}:` : "";
            this.keyPrefix = s !== void 0 ? `${this.keyPrefix}${s}.` : this.keyPrefix;
        }
        r.subscribe(e.Signals.I18N_EA_CHANNEL, (() => {
            this.registeredMessages = new WeakMap;
            r.publish(a);
        }));
    }
    getMessage(e) {
        const i = this.registeredMessages.get(e);
        if (i !== void 0) {
            return i;
        }
        return this.setMessage(e, this.i18n.tr(this.getKey(e.messageKey)));
    }
    getDisplayName(e, i) {
        if (i !== null && i !== undefined) {
            return i instanceof Function ? i() : i;
        }
        if (e === void 0) {
            return;
        }
        return this.i18n.tr(this.getKey(e));
    }
    getKey(e) {
        const i = this.keyPrefix;
        return i !== void 0 ? `${i}${e}` : e;
    }
}

function createConfiguration(e) {
    return {
        optionsProvider: e,
        register(t) {
            const r = {
                ...o.getDefaultValidationHtmlConfiguration(),
                MessageProviderType: LocalizedValidationMessageProvider,
                ValidationControllerFactoryType: LocalizedValidationControllerFactory,
                DefaultNamespace: void 0,
                DefaultKeyPrefix: void 0
            };
            e(r);
            const a = {
                DefaultNamespace: r.DefaultNamespace,
                DefaultKeyPrefix: r.DefaultKeyPrefix
            };
            return t.register(o.ValidationHtmlConfiguration.customize((e => {
                for (const i of Object.keys(e)) {
                    if (i in r) {
                        e[i] = r[i];
                    }
                }
            })), i.Registration.callback(n, (() => a)));
        },
        customize(i) {
            return createConfiguration(i ?? e);
        }
    };
}

const s = createConfiguration(i.noop);

exports.I18nKeyConfiguration = n;

exports.LocalizedValidationController = LocalizedValidationController;

exports.LocalizedValidationControllerFactory = LocalizedValidationControllerFactory;

exports.LocalizedValidationMessageProvider = LocalizedValidationMessageProvider;

exports.ValidationI18nConfiguration = s;
//# sourceMappingURL=index.cjs.map
