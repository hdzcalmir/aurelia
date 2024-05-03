"use strict";

var t = require("@aurelia/kernel");

var s = require("@aurelia/runtime-html");

const e = /*@__PURE__*/ t.DI.createInterface((t => t.singleton(WcCustomElementRegistry)));

class WcCustomElementRegistry {
    constructor() {
        this.ctn = t.resolve(t.IContainer);
        this.p = t.resolve(s.IPlatform);
        this.r = t.resolve(s.IRendering);
    }
    define(e, n, i) {
        if (!e.includes("-")) {
            throw createError('Invalid web-components custom element name. It must include a "-"');
        }
        let l;
        if (n == null) {
            throw createError("Invalid custom element definition");
        }
        switch (typeof n) {
          case "function":
            l = s.CustomElement.isType(n) ? s.CustomElement.getDefinition(n) : s.CustomElementDefinition.create(s.CustomElement.generateName(), n);
            break;

          default:
            l = s.CustomElementDefinition.getOrCreate(n);
            break;
        }
        if (l.containerless) {
            throw createError("Containerless custom element is not supported. Consider using buitl-in extends instead");
        }
        const o = i?.extends ? this.p.document.createElement(i.extends).constructor : this.p.HTMLElement;
        const r = this.ctn;
        const c = this.r;
        const a = l.bindables;
        const u = this.p;
        class CustomElementClass extends o {
            auInit() {
                if (this.auInited) {
                    return;
                }
                this.auInited = true;
                const e = r.createChild();
                registerResolver(e, u.HTMLElement, registerResolver(e, u.Element, registerResolver(e, s.INode, new t.InstanceProvider("ElementProvider", this))));
                const n = c.compile(l, e);
                const i = e.invoke(n.Type);
                const o = this.auCtrl = s.Controller.$el(e, i, this, null, n);
                s.setRef(this, n.key, o);
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
        CustomElementClass.observedAttributes = Object.keys(a);
        for (const t in a) {
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
        this.p.customElements.define(e, CustomElementClass, i);
        return CustomElementClass;
    }
}

const registerResolver = (t, s, e) => t.registerResolver(s, e);

const createError = t => new Error(t);

exports.IWcElementRegistry = e;

exports.WcCustomElementRegistry = WcCustomElementRegistry;
//# sourceMappingURL=index.cjs.map
