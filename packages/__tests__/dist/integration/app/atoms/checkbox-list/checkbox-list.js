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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { customElement, bindable } from '@aurelia/runtime-html';
import template from './checkbox-list.html';
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime`
 *   - `array-observer`
 * - `@aurelia/runtime-html`
 *   - `checked-observer` (`checked` bind)
 *   - `setter-observer` (`model` bind)
 */
let CheckboxList = (() => {
    let _classDecorators = [customElement({ name: 'checkbox-list', template })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _choices1_decorators;
    let _choices1_initializers = [];
    let _choices1_extraInitializers = [];
    let _selectedItems1_decorators;
    let _selectedItems1_initializers = [];
    let _selectedItems1_extraInitializers = [];
    let _choices2_decorators;
    let _choices2_initializers = [];
    let _choices2_extraInitializers = [];
    let _selectedItems2_decorators;
    let _selectedItems2_initializers = [];
    let _selectedItems2_extraInitializers = [];
    let _matcher_decorators;
    let _matcher_initializers = [];
    let _matcher_extraInitializers = [];
    var CheckboxList = _classThis = class {
        constructor() {
            this.choices1 = __runInitializers(this, _choices1_initializers, void 0);
            this.selectedItems1 = (__runInitializers(this, _choices1_extraInitializers), __runInitializers(this, _selectedItems1_initializers, void 0));
            this.choices2 = (__runInitializers(this, _selectedItems1_extraInitializers), __runInitializers(this, _choices2_initializers, void 0));
            this.selectedItems2 = (__runInitializers(this, _choices2_extraInitializers), __runInitializers(this, _selectedItems2_initializers, void 0));
            this.matcher = (__runInitializers(this, _selectedItems2_extraInitializers), __runInitializers(this, _matcher_initializers, void 0));
            __runInitializers(this, _matcher_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CheckboxList");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _choices1_decorators = [bindable];
        _selectedItems1_decorators = [bindable];
        _choices2_decorators = [bindable];
        _selectedItems2_decorators = [bindable];
        _matcher_decorators = [bindable];
        __esDecorate(null, null, _choices1_decorators, { kind: "field", name: "choices1", static: false, private: false, access: { has: obj => "choices1" in obj, get: obj => obj.choices1, set: (obj, value) => { obj.choices1 = value; } }, metadata: _metadata }, _choices1_initializers, _choices1_extraInitializers);
        __esDecorate(null, null, _selectedItems1_decorators, { kind: "field", name: "selectedItems1", static: false, private: false, access: { has: obj => "selectedItems1" in obj, get: obj => obj.selectedItems1, set: (obj, value) => { obj.selectedItems1 = value; } }, metadata: _metadata }, _selectedItems1_initializers, _selectedItems1_extraInitializers);
        __esDecorate(null, null, _choices2_decorators, { kind: "field", name: "choices2", static: false, private: false, access: { has: obj => "choices2" in obj, get: obj => obj.choices2, set: (obj, value) => { obj.choices2 = value; } }, metadata: _metadata }, _choices2_initializers, _choices2_extraInitializers);
        __esDecorate(null, null, _selectedItems2_decorators, { kind: "field", name: "selectedItems2", static: false, private: false, access: { has: obj => "selectedItems2" in obj, get: obj => obj.selectedItems2, set: (obj, value) => { obj.selectedItems2 = value; } }, metadata: _metadata }, _selectedItems2_initializers, _selectedItems2_extraInitializers);
        __esDecorate(null, null, _matcher_decorators, { kind: "field", name: "matcher", static: false, private: false, access: { has: obj => "matcher" in obj, get: obj => obj.matcher, set: (obj, value) => { obj.matcher = value; } }, metadata: _metadata }, _matcher_initializers, _matcher_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CheckboxList = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CheckboxList = _classThis;
})();
export { CheckboxList };
//# sourceMappingURL=checkbox-list.js.map