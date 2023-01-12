"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var e = require("@aurelia/runtime-html");

const s = t.DI.createInterface((t => t.singleton(WcCustomElementRegistry)));

class WcCustomElementRegistry {
    constructor(t, e, s) {
        this.ctn = t;
        this.p = e;
        this.r = s;
    }
    define(s, l, o) {
        if (!s.includes("-")) throw i('Invalid web-components custom element name. It must include a "-"');
        let r;
        if (null == l) throw i("Invalid custom element definition");
        switch (typeof l) {
          case "function":
            r = e.CustomElement.isType(l) ? e.CustomElement.getDefinition(l) : e.CustomElementDefinition.create(e.CustomElement.generateName(), l);
            break;

          default:
            r = e.CustomElementDefinition.getOrCreate(l);
            break;
        }
        if (r.containerless) throw i("Containerless custom element is not supported. Consider using buitl-in extends instead");
        const c = o?.extends ? this.p.document.createElement(o.extends).constructor : this.p.HTMLElement;
        const u = this.ctn;
        const a = this.r;
        const h = r.bindables;
        const m = this.p;
        class CustomElementClass extends c {
            auInit() {
                if (this.auInited) return;
                this.auInited = true;
                const s = u.createChild();
                n(s, m.HTMLElement, n(s, m.Element, n(s, e.INode, new t.InstanceProvider("ElementProvider", this))));
                const i = a.compile(r, s, {
                    projections: null
                });
                const l = s.invoke(i.Type);
                const o = this.auCtrl = e.Controller.$el(s, l, this, null, i);
                e.setRef(this, i.key, o);
            }
            connectedCallback() {
                this.auInit();
                this.auCtrl.activate(this.auCtrl, null, 0);
            }
            disconnectedCallback() {
                this.auCtrl.deactivate(this.auCtrl, null, 0);
            }
            adoptedCallback() {
                this.auInit();
            }
            attributeChangedCallback(t, e, s) {
                this.auInit();
                this.auCtrl.viewModel[t] = s;
            }
        }
        CustomElementClass.observedAttributes = Object.keys(h);
        for (const t in h) Object.defineProperty(CustomElementClass.prototype, t, {
            configurable: true,
            enumerable: false,
            get() {
                return this["auCtrl"].viewModel[t];
            },
            set(e) {
                if (!this["auInited"]) this["auInit"]();
                this["auCtrl"].viewModel[t] = e;
            }
        });
        this.p.customElements.define(s, CustomElementClass, o);
        return CustomElementClass;
    }
}

WcCustomElementRegistry.inject = [ t.IContainer, e.IPlatform, e.IRendering ];

const n = (t, e, s) => t.registerResolver(e, s);

const i = t => new Error(t);

exports.IWcElementRegistry = s;

exports.WcCustomElementRegistry = WcCustomElementRegistry;
//# sourceMappingURL=index.cjs.map
