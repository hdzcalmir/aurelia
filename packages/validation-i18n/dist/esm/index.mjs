import { Signals as t, I18N as e } from "@aurelia/i18n";

import { DI as r, IServiceLocator as a, IEventAggregator as i, ILogger as o, Registration as n, noop as c } from "@aurelia/kernel";

import { IExpressionParser as s } from "@aurelia/runtime";

import { IPlatform as l } from "@aurelia/runtime-html";

import { ValidationMessageProvider as u, IValidator as f } from "@aurelia/validation";

import { ValidationController as d, ValidationControllerFactory as m, getDefaultValidationHtmlConfiguration as p, ValidationHtmlConfiguration as _ } from "@aurelia/validation-html";

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

const h = "i18n:locale:changed:validation";

const v = /*@__PURE__*/ r.createInterface("I18nKeyConfiguration");

let y = class LocalizedValidationController extends d {
    constructor(t, e, r, a, i) {
        super(r, a, i, t);
        this.localeChangeSubscription = e.subscribe(h, (() => {
            i.domReadQueue.queueTask((async () => {
                await this.revalidateErrors();
            }));
        }));
    }
};

y = __decorate([ __param(0, a), __param(1, i), __param(2, f), __param(3, s), __param(4, l) ], y);

class LocalizedValidationControllerFactory extends m {
    construct(t, e) {
        return t.invoke(y, e);
    }
}

let g = class LocalizedValidationMessageProvider extends u {
    constructor(e, r, a, i, o) {
        super(i, o, []);
        this.i18n = r;
        const n = e.DefaultNamespace;
        const c = e.DefaultKeyPrefix;
        if (n !== void 0 || c !== void 0) {
            this.keyPrefix = n !== void 0 ? `${n}:` : "";
            this.keyPrefix = c !== void 0 ? `${this.keyPrefix}${c}.` : this.keyPrefix;
        }
        a.subscribe(t.I18N_EA_CHANNEL, (() => {
            this.registeredMessages = new WeakMap;
            a.publish(h);
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

g = __decorate([ __param(0, v), __param(1, e), __param(2, i), __param(3, s), __param(4, o) ], g);

function createConfiguration(t) {
    return {
        optionsProvider: t,
        register(e) {
            const r = {
                ...p(),
                MessageProviderType: g,
                ValidationControllerFactoryType: LocalizedValidationControllerFactory,
                DefaultNamespace: void 0,
                DefaultKeyPrefix: void 0
            };
            t(r);
            const a = {
                DefaultNamespace: r.DefaultNamespace,
                DefaultKeyPrefix: r.DefaultKeyPrefix
            };
            return e.register(_.customize((t => {
                for (const e of Object.keys(t)) {
                    if (e in r) {
                        t[e] = r[e];
                    }
                }
            })), n.callback(v, (() => a)));
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

const C = createConfiguration(c);

export { v as I18nKeyConfiguration, y as LocalizedValidationController, LocalizedValidationControllerFactory, g as LocalizedValidationMessageProvider, C as ValidationI18nConfiguration };
//# sourceMappingURL=index.mjs.map
