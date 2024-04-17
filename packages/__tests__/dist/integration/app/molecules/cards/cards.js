var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { bindable, CustomElement, cssModules } from '@aurelia/runtime-html';
import * as css from './cards.css';
import template from './cards.html';
/**
 * Potential coverage target
 * - `runtime-html`
 *    - `css-modules-registry`
 *    - `class-attribute-accessor`
 *    - `style-attribute-accessor`
 *    - `data-attribute-accessor`
 */
let Cards = (() => {
    var _a;
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _selected_decorators;
    let _selected_initializers = [];
    let _selected_extraInitializers = [];
    return _a = class Cards {
            constructor() {
                this.items = __runInitializers(this, _items_initializers, void 0);
                this.selected = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _selected_initializers, void 0));
                this.styleStr = (__runInitializers(this, _selected_extraInitializers), "background-color: rgb(255, 0, 0); font-weight: 700 !important");
                this.styleObj = { 'background-color': 'rgb(255, 0, 0)', 'font-weight': '700 !important' };
                this.styleArray = [{ 'background-color': 'rgb(255, 0, 0)' }, { 'font-weight': '700 !important' }];
            }
            static customize(useCSSModule) {
                /**
                 * Note that this is done only for testing.
                 * Normally, this goes like this: `@customElement({ name: 'cards', template, dependencies: [styles(css)] })`.
                 */
                const defn = { name: 'cards', template, dependencies: useCSSModule ? [cssModules(css)] : undefined };
                return CustomElement.define(defn, _a);
            }
            select(card) {
                this.selected = card;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _items_decorators = [bindable];
            _selected_decorators = [bindable];
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _selected_decorators, { kind: "field", name: "selected", static: false, private: false, access: { has: obj => "selected" in obj, get: obj => obj.selected, set: (obj, value) => { obj.selected = value; } }, metadata: _metadata }, _selected_initializers, _selected_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { Cards };
//# sourceMappingURL=cards.js.map