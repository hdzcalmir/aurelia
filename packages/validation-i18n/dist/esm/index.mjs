import { I18N as i, Signals as t } from "@aurelia/i18n";

import { DI as o, resolve as e, IEventAggregator as a, isFunction as r, Registration as n, noop as s } from "@aurelia/kernel";

import { IPlatform as l } from "@aurelia/runtime-html";

import { ValidationMessageProvider as c } from "@aurelia/validation";

import { ValidationController as d, ValidationControllerFactory as u, getDefaultValidationHtmlConfiguration as f, ValidationHtmlConfiguration as m } from "@aurelia/validation-html";

const h = "i18n:locale:changed:validation";

const v = /*@__PURE__*/ o.createInterface("I18nKeyConfiguration");

class LocalizedValidationController extends d {
    constructor(i = e(a), t = e(l)) {
        super();
        this.localeChangeSubscription = i.subscribe(h, (() => {
            t.domQueue.queueTask((async () => {
                await this.revalidateErrors();
            }));
        }));
    }
}

class LocalizedValidationControllerFactory extends u {
    construct(i, t) {
        return i.invoke(LocalizedValidationController, t);
    }
}

const p = Symbol.for("au:validation:explicit-message-key");

class LocalizedValidationMessageProvider extends c {
    constructor(o = e(v), r = e(a)) {
        super(undefined, []);
        this.i18n = e(i);
        const n = o.DefaultNamespace;
        const s = o.DefaultKeyPrefix;
        if (n !== void 0 || s !== void 0) {
            this.keyPrefix = n !== void 0 ? `${n}:` : "";
            this.keyPrefix = s !== void 0 ? `${this.keyPrefix}${s}.` : this.keyPrefix;
        }
        r.subscribe(t.I18N_EA_CHANNEL, (() => {
            this.registeredMessages = new WeakMap;
            r.publish(h);
        }));
    }
    getMessage(i) {
        const t = r(i.getMessage) ? i.getMessage() : i.messageKey;
        const o = this.registeredMessages.get(i);
        if (o != null) {
            const i = o.get(p) ?? o.get(t);
            if (i !== void 0) {
                return i;
            }
        }
        return this.setMessage(i, this.i18n.tr(this.getKey(t)));
    }
    getDisplayName(i, t) {
        if (t !== null && t !== undefined) {
            return t instanceof Function ? t() : t;
        }
        if (i === void 0) {
            return;
        }
        return this.i18n.tr(this.getKey(i));
    }
    getKey(i) {
        const t = this.keyPrefix;
        return t !== void 0 ? `${t}${i}` : i;
    }
}

function createConfiguration(i) {
    return {
        optionsProvider: i,
        register(t) {
            const o = {
                ...f(),
                MessageProviderType: LocalizedValidationMessageProvider,
                ValidationControllerFactoryType: LocalizedValidationControllerFactory,
                DefaultNamespace: void 0,
                DefaultKeyPrefix: void 0
            };
            i(o);
            const e = {
                DefaultNamespace: o.DefaultNamespace,
                DefaultKeyPrefix: o.DefaultKeyPrefix
            };
            return t.register(m.customize((i => {
                for (const t of Object.keys(i)) {
                    if (t in o) {
                        i[t] = o[t];
                    }
                }
            })), n.callback(v, (() => e)));
        },
        customize(t) {
            return createConfiguration(t ?? i);
        }
    };
}

const g = /*@__PURE__*/ createConfiguration(s);

export { v as I18nKeyConfiguration, LocalizedValidationController, LocalizedValidationControllerFactory, LocalizedValidationMessageProvider, g as ValidationI18nConfiguration };
//# sourceMappingURL=index.mjs.map
