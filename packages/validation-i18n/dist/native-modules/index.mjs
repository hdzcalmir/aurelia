import { I18N as i, Signals as t } from "../../../i18n/dist/native-modules/index.mjs";

import { DI as e, resolve as o, IEventAggregator as r, Registration as a, noop as n } from "../../../kernel/dist/native-modules/index.mjs";

import { IPlatform as s } from "../../../runtime-html/dist/native-modules/index.mjs";

import { ValidationMessageProvider as l } from "../../../validation/dist/native-modules/index.mjs";

import { ValidationController as c, ValidationControllerFactory as d, getDefaultValidationHtmlConfiguration as u, ValidationHtmlConfiguration as f } from "../../../validation-html/dist/native-modules/index.mjs";

const h = "i18n:locale:changed:validation";

const m = /*@__PURE__*/ e.createInterface("I18nKeyConfiguration");

class LocalizedValidationController extends c {
    constructor(i = o(r), t = o(s)) {
        super();
        this.localeChangeSubscription = i.subscribe(h, (() => {
            t.domQueue.queueTask((async () => {
                await this.revalidateErrors();
            }));
        }));
    }
}

class LocalizedValidationControllerFactory extends d {
    construct(i, t) {
        return i.invoke(LocalizedValidationController, t);
    }
}

class LocalizedValidationMessageProvider extends l {
    constructor(e = o(m), a = o(r)) {
        super(undefined, []);
        this.i18n = o(i);
        const n = e.DefaultNamespace;
        const s = e.DefaultKeyPrefix;
        if (n !== void 0 || s !== void 0) {
            this.keyPrefix = n !== void 0 ? `${n}:` : "";
            this.keyPrefix = s !== void 0 ? `${this.keyPrefix}${s}.` : this.keyPrefix;
        }
        a.subscribe(t.I18N_EA_CHANNEL, (() => {
            this.registeredMessages = new WeakMap;
            a.publish(h);
        }));
    }
    getMessage(i) {
        const t = this.registeredMessages.get(i);
        if (t !== void 0) {
            return t;
        }
        return this.setMessage(i, this.i18n.tr(this.getKey(i.messageKey)));
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
            const e = {
                ...u(),
                MessageProviderType: LocalizedValidationMessageProvider,
                ValidationControllerFactoryType: LocalizedValidationControllerFactory,
                DefaultNamespace: void 0,
                DefaultKeyPrefix: void 0
            };
            i(e);
            const o = {
                DefaultNamespace: e.DefaultNamespace,
                DefaultKeyPrefix: e.DefaultKeyPrefix
            };
            return t.register(f.customize((i => {
                for (const t of Object.keys(i)) {
                    if (t in e) {
                        i[t] = e[t];
                    }
                }
            })), a.callback(m, (() => o)));
        },
        customize(t) {
            return createConfiguration(t ?? i);
        }
    };
}

const v = /*@__PURE__*/ createConfiguration(n);

export { m as I18nKeyConfiguration, LocalizedValidationController, LocalizedValidationControllerFactory, LocalizedValidationMessageProvider, v as ValidationI18nConfiguration };

