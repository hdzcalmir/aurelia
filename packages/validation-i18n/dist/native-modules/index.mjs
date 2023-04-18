import { I18N as t } from "@aurelia/i18n";

import { DI as e, IServiceLocator as r, IEventAggregator as a, ILogger as i, Registration as o, noop as n } from "../kernel/dist/native-modules/index.mjs";

import { IExpressionParser as c } from "../runtime/dist/native-modules/index.mjs";

import { IPlatform as l } from "../runtime-html/dist/native-modules/index.mjs";

import { ValidationMessageProvider as s, IValidator as u } from "../validation/dist/native-modules/index.mjs";

import { ValidationController as f, ValidationControllerFactory as d, getDefaultValidationHtmlConfiguration as m, ValidationHtmlConfiguration as p } from "../validation-html/dist/native-modules/index.mjs";

function __decorate(t, e, r, a) {
    var i = arguments.length, o = i < 3 ? e : a === null ? a = Object.getOwnPropertyDescriptor(e, r) : a, n;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") o = Reflect.decorate(t, e, r, a); else for (var c = t.length - 1; c >= 0; c--) if (n = t[c]) o = (i < 3 ? n(o) : i > 3 ? n(e, r, o) : n(e, r)) || o;
    return i > 3 && o && Object.defineProperty(e, r, o), o;
}

function __param(t, e) {
    return function(r, a) {
        e(r, a, t);
    };
}

const _ = "i18n:locale:changed:validation";

const h = /*@__PURE__*/ e.createInterface("I18nKeyConfiguration");

let v = class LocalizedValidationController extends f {
    constructor(t, e, r, a, i) {
        super(r, a, i, t);
        this.localeChangeSubscription = e.subscribe(_, (() => {
            i.domReadQueue.queueTask((async () => {
                await this.revalidateErrors();
            }));
        }));
    }
};

v = __decorate([ __param(0, r), __param(1, a), __param(2, u), __param(3, c), __param(4, l) ], v);

class LocalizedValidationControllerFactory extends d {
    construct(t, e) {
        return t.invoke(v, e);
    }
}

let y = class LocalizedValidationMessageProvider extends s {
    constructor(t, e, r, a, i) {
        super(a, i, []);
        this.i18n = e;
        const o = t.DefaultNamespace;
        const n = t.DefaultKeyPrefix;
        if (o !== void 0 || n !== void 0) {
            this.keyPrefix = o !== void 0 ? `${o}:` : "";
            this.keyPrefix = n !== void 0 ? `${this.keyPrefix}${n}.` : this.keyPrefix;
        }
        r.subscribe("i18n:locale:changed", (() => {
            this.registeredMessages = new WeakMap;
            r.publish(_);
        }));
    }
    getMessage(t) {
        const e = this.registeredMessages.get(t);
        if (e !== void 0) {
            return e;
        }
        return this.setMessage(t, this.i18n.tr(this.getKey(t.messageKey)));
    }
    getDisplayName(t, e) {
        if (e !== null && e !== undefined) {
            return e instanceof Function ? e() : e;
        }
        if (t === void 0) {
            return;
        }
        return this.i18n.tr(this.getKey(t));
    }
    getKey(t) {
        const e = this.keyPrefix;
        return e !== void 0 ? `${e}${t}` : t;
    }
};

y = __decorate([ __param(0, h), __param(1, t), __param(2, a), __param(3, c), __param(4, i) ], y);

function createConfiguration(t) {
    return {
        optionsProvider: t,
        register(e) {
            const r = {
                ...m(),
                MessageProviderType: y,
                ValidationControllerFactoryType: LocalizedValidationControllerFactory,
                DefaultNamespace: void 0,
                DefaultKeyPrefix: void 0
            };
            t(r);
            const a = {
                DefaultNamespace: r.DefaultNamespace,
                DefaultKeyPrefix: r.DefaultKeyPrefix
            };
            return e.register(p.customize((t => {
                for (const e of Object.keys(t)) {
                    if (e in r) {
                        t[e] = r[e];
                    }
                }
            })), o.callback(h, (() => a)));
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

const g = createConfiguration(n);

export { h as I18nKeyConfiguration, v as LocalizedValidationController, LocalizedValidationControllerFactory, y as LocalizedValidationMessageProvider, g as ValidationI18nConfiguration };

