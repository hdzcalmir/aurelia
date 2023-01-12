'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kernel = require('@aurelia/kernel');
var runtimeHtml = require('@aurelia/runtime-html');

const IWcElementRegistry = kernel.DI.createInterface(x => x.singleton(WcCustomElementRegistry));
class WcCustomElementRegistry {
    constructor(ctn, p, r) {
        this.ctn = ctn;
        this.p = p;
        this.r = r;
    }
    define(name, def, options) {
        if (!name.includes('-')) {
            throw createError('Invalid web-components custom element name. It must include a "-"');
        }
        let elDef;
        if (def == null) {
            throw createError('Invalid custom element definition');
        }
        switch (typeof def) {
            case 'function':
                elDef = runtimeHtml.CustomElement.isType(def)
                    ? runtimeHtml.CustomElement.getDefinition(def)
                    : runtimeHtml.CustomElementDefinition.create(runtimeHtml.CustomElement.generateName(), def);
                break;
            default:
                elDef = runtimeHtml.CustomElementDefinition.getOrCreate(def);
                break;
        }
        if (elDef.containerless) {
            throw createError('Containerless custom element is not supported. Consider using buitl-in extends instead');
        }
        const BaseClass = options?.extends
            ? this.p.document.createElement(options.extends).constructor
            : this.p.HTMLElement;
        const container = this.ctn;
        const rendering = this.r;
        const bindables = elDef.bindables;
        const p = this.p;
        class CustomElementClass extends BaseClass {
            auInit() {
                if (this.auInited) {
                    return;
                }
                this.auInited = true;
                const childCtn = container.createChild();
                registerResolver(childCtn, p.HTMLElement, registerResolver(childCtn, p.Element, registerResolver(childCtn, runtimeHtml.INode, new kernel.InstanceProvider('ElementProvider', this))));
                const compiledDef = rendering.compile(elDef, childCtn, { projections: null });
                const viewModel = childCtn.invoke(compiledDef.Type);
                const controller = this.auCtrl = runtimeHtml.Controller.$el(childCtn, viewModel, this, null, compiledDef);
                runtimeHtml.setRef(this, compiledDef.key, controller);
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
            attributeChangedCallback(name, oldValue, newValue) {
                this.auInit();
                this.auCtrl.viewModel[name] = newValue;
            }
        }
        CustomElementClass.observedAttributes = Object.keys(bindables);
        for (const bindableProp in bindables) {
            Object.defineProperty(CustomElementClass.prototype, bindableProp, {
                configurable: true,
                enumerable: false,
                get() {
                    return this['auCtrl'].viewModel[bindableProp];
                },
                set(v) {
                    if (!this['auInited']) {
                        this['auInit']();
                    }
                    this['auCtrl'].viewModel[bindableProp] = v;
                }
            });
        }
        this.p.customElements.define(name, CustomElementClass, options);
        return CustomElementClass;
    }
}
WcCustomElementRegistry.inject = [kernel.IContainer, runtimeHtml.IPlatform, runtimeHtml.IRendering];
const registerResolver = (ctn, key, resolver) => ctn.registerResolver(key, resolver);
const createError = (message) => new Error(message);

exports.IWcElementRegistry = IWcElementRegistry;
exports.WcCustomElementRegistry = WcCustomElementRegistry;
//# sourceMappingURL=index.dev.cjs.map
