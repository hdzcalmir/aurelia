import { DI as t, resolve as s, IContainer as e, InstanceProvider as n } from "../../../kernel/dist/native-modules/index.mjs";

import { IPlatform as i, IRendering as o, CustomElementDefinition as l, CustomElement as c, INode as r, Controller as a, setRef as u } from "../../../runtime-html/dist/native-modules/index.mjs";

const h = /*@__PURE__*/ t.createInterface((t => t.singleton(WcCustomElementRegistry)));

class WcCustomElementRegistry {
    constructor() {
        this.ctn = s(e);
        this.p = s(i);
        this.r = s(o);
    }
    define(t, s, e) {
        if (!t.includes("-")) {
            throw createError('Invalid web-components custom element name. It must include a "-"');
        }
        let i;
        if (s == null) {
            throw createError("Invalid custom element definition");
        }
        switch (typeof s) {
          case "function":
            i = c.isType(s) ? c.getDefinition(s) : l.create(c.generateName(), s);
            break;

          default:
            i = l.getOrCreate(s);
            break;
        }
        if (i.containerless) {
            throw createError("Containerless custom element is not supported. Consider using buitl-in extends instead");
        }
        const o = e?.extends ? this.p.document.createElement(e.extends).constructor : this.p.HTMLElement;
        const h = this.ctn;
        const m = this.r;
        const C = i.bindables;
        const d = this.p;
        class CustomElementClass extends o {
            auInit() {
                if (this.auInited) {
                    return;
                }
                this.auInited = true;
                const t = h.createChild();
                registerResolver(t, d.HTMLElement, registerResolver(t, d.Element, registerResolver(t, r, new n("ElementProvider", this))));
                const s = m.compile(i, t, {
                    projections: null
                });
                const e = t.invoke(s.Type);
                const o = this.auCtrl = a.$el(t, e, this, null, s);
                u(this, s.key, o);
            }
            connectedCallback() {
                this.auInit();
                this.auCtrl.activate(this.auCtrl, null);
            }
            disconnectedCallback() {
                this.auCtrl.deactivate(this.auCtrl, null);
            }
            adoptedCallback() {
                this.auInit();
            }
            attributeChangedCallback(t, s, e) {
                this.auInit();
                this.auCtrl.viewModel[t] = e;
            }
        }
        CustomElementClass.observedAttributes = Object.keys(C);
        for (const t in C) {
            Object.defineProperty(CustomElementClass.prototype, t, {
                configurable: true,
                enumerable: false,
                get() {
                    return this["auCtrl"].viewModel[t];
                },
                set(s) {
                    if (!this["auInited"]) {
                        this["auInit"]();
                    }
                    this["auCtrl"].viewModel[t] = s;
                }
            });
        }
        this.p.customElements.define(t, CustomElementClass, e);
        return CustomElementClass;
    }
}

const registerResolver = (t, s, e) => t.registerResolver(s, e);

const createError = t => new Error(t);

export { h as IWcElementRegistry, WcCustomElementRegistry };

