import { DI as t, IContainer as s, InstanceProvider as e } from "../../../kernel/dist/native-modules/index.mjs";

import { CustomElementDefinition as n, CustomElement as i, IPlatform as o, IRendering as l, INode as c, Controller as r, setRef as u } from "../../../runtime-html/dist/native-modules/index.mjs";

const a = /*@__PURE__*/ t.createInterface((t => t.singleton(WcCustomElementRegistry)));

class WcCustomElementRegistry {
    constructor(t, s, e) {
        this.ctn = t;
        this.p = s;
        this.r = e;
    }
    define(t, s, o) {
        if (!t.includes("-")) {
            throw createError('Invalid web-components custom element name. It must include a "-"');
        }
        let l;
        if (s == null) {
            throw createError("Invalid custom element definition");
        }
        switch (typeof s) {
          case "function":
            l = i.isType(s) ? i.getDefinition(s) : n.create(i.generateName(), s);
            break;

          default:
            l = n.getOrCreate(s);
            break;
        }
        if (l.containerless) {
            throw createError("Containerless custom element is not supported. Consider using buitl-in extends instead");
        }
        const a = o?.extends ? this.p.document.createElement(o.extends).constructor : this.p.HTMLElement;
        const m = this.ctn;
        const h = this.r;
        const C = l.bindables;
        const d = this.p;
        class CustomElementClass extends a {
            auInit() {
                if (this.auInited) {
                    return;
                }
                this.auInited = true;
                const t = m.createChild();
                registerResolver(t, d.HTMLElement, registerResolver(t, d.Element, registerResolver(t, c, new e("ElementProvider", this))));
                const s = h.compile(l, t, {
                    projections: null
                });
                const n = t.invoke(s.Type);
                const i = this.auCtrl = r.$el(t, n, this, null, s);
                u(this, s.key, i);
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
        this.p.customElements.define(t, CustomElementClass, o);
        return CustomElementClass;
    }
}

WcCustomElementRegistry.inject = [ s, o, l ];

const registerResolver = (t, s, e) => t.registerResolver(s, e);

const createError = t => new Error(t);

export { a as IWcElementRegistry, WcCustomElementRegistry };

