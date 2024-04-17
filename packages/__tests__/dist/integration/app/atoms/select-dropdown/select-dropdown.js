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
import template from './select-dropdown.html';
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime-html`
 *   - Observation
 *     - `select-value-observer`
 */
let SelectDropdown = (() => {
    let _classDecorators = [customElement({ name: 'select-dropdown', template })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _options1_decorators;
    let _options1_initializers = [];
    let _options1_extraInitializers = [];
    let _selection1_decorators;
    let _selection1_initializers = [];
    let _selection1_extraInitializers = [];
    let _options2_decorators;
    let _options2_initializers = [];
    let _options2_extraInitializers = [];
    let _selection2_decorators;
    let _selection2_initializers = [];
    let _selection2_extraInitializers = [];
    let _options3_decorators;
    let _options3_initializers = [];
    let _options3_extraInitializers = [];
    let _selection3_decorators;
    let _selection3_initializers = [];
    let _selection3_extraInitializers = [];
    let _matcher_decorators;
    let _matcher_initializers = [];
    let _matcher_extraInitializers = [];
    let _options4_decorators;
    let _options4_initializers = [];
    let _options4_extraInitializers = [];
    let _selection4_decorators;
    let _selection4_initializers = [];
    let _selection4_extraInitializers = [];
    let _selections1_decorators;
    let _selections1_initializers = [];
    let _selections1_extraInitializers = [];
    let _selections2_decorators;
    let _selections2_initializers = [];
    let _selections2_extraInitializers = [];
    let _selections3_decorators;
    let _selections3_initializers = [];
    let _selections3_extraInitializers = [];
    let _selections4_decorators;
    let _selections4_initializers = [];
    let _selections4_extraInitializers = [];
    var SelectDropdown = _classThis = class {
        constructor() {
            this.options1 = __runInitializers(this, _options1_initializers, void 0);
            this.selection1 = (__runInitializers(this, _options1_extraInitializers), __runInitializers(this, _selection1_initializers, void 0));
            this.options2 = (__runInitializers(this, _selection1_extraInitializers), __runInitializers(this, _options2_initializers, void 0));
            this.selection2 = (__runInitializers(this, _options2_extraInitializers), __runInitializers(this, _selection2_initializers, void 0));
            this.options3 = (__runInitializers(this, _selection2_extraInitializers), __runInitializers(this, _options3_initializers, void 0));
            this.selection3 = (__runInitializers(this, _options3_extraInitializers), __runInitializers(this, _selection3_initializers, void 0));
            this.matcher = (__runInitializers(this, _selection3_extraInitializers), __runInitializers(this, _matcher_initializers, void 0));
            this.options4 = (__runInitializers(this, _matcher_extraInitializers), __runInitializers(this, _options4_initializers, void 0));
            this.selection4 = (__runInitializers(this, _options4_extraInitializers), __runInitializers(this, _selection4_initializers, void 0));
            this.selections1 = (__runInitializers(this, _selection4_extraInitializers), __runInitializers(this, _selections1_initializers, void 0));
            this.selections2 = (__runInitializers(this, _selections1_extraInitializers), __runInitializers(this, _selections2_initializers, void 0));
            this.selections3 = (__runInitializers(this, _selections2_extraInitializers), __runInitializers(this, _selections3_initializers, void 0));
            this.selections4 = (__runInitializers(this, _selections3_extraInitializers), __runInitializers(this, _selections4_initializers, void 0));
            __runInitializers(this, _selections4_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SelectDropdown");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _options1_decorators = [bindable];
        _selection1_decorators = [bindable];
        _options2_decorators = [bindable];
        _selection2_decorators = [bindable];
        _options3_decorators = [bindable];
        _selection3_decorators = [bindable];
        _matcher_decorators = [bindable];
        _options4_decorators = [bindable];
        _selection4_decorators = [bindable];
        _selections1_decorators = [bindable];
        _selections2_decorators = [bindable];
        _selections3_decorators = [bindable];
        _selections4_decorators = [bindable];
        __esDecorate(null, null, _options1_decorators, { kind: "field", name: "options1", static: false, private: false, access: { has: obj => "options1" in obj, get: obj => obj.options1, set: (obj, value) => { obj.options1 = value; } }, metadata: _metadata }, _options1_initializers, _options1_extraInitializers);
        __esDecorate(null, null, _selection1_decorators, { kind: "field", name: "selection1", static: false, private: false, access: { has: obj => "selection1" in obj, get: obj => obj.selection1, set: (obj, value) => { obj.selection1 = value; } }, metadata: _metadata }, _selection1_initializers, _selection1_extraInitializers);
        __esDecorate(null, null, _options2_decorators, { kind: "field", name: "options2", static: false, private: false, access: { has: obj => "options2" in obj, get: obj => obj.options2, set: (obj, value) => { obj.options2 = value; } }, metadata: _metadata }, _options2_initializers, _options2_extraInitializers);
        __esDecorate(null, null, _selection2_decorators, { kind: "field", name: "selection2", static: false, private: false, access: { has: obj => "selection2" in obj, get: obj => obj.selection2, set: (obj, value) => { obj.selection2 = value; } }, metadata: _metadata }, _selection2_initializers, _selection2_extraInitializers);
        __esDecorate(null, null, _options3_decorators, { kind: "field", name: "options3", static: false, private: false, access: { has: obj => "options3" in obj, get: obj => obj.options3, set: (obj, value) => { obj.options3 = value; } }, metadata: _metadata }, _options3_initializers, _options3_extraInitializers);
        __esDecorate(null, null, _selection3_decorators, { kind: "field", name: "selection3", static: false, private: false, access: { has: obj => "selection3" in obj, get: obj => obj.selection3, set: (obj, value) => { obj.selection3 = value; } }, metadata: _metadata }, _selection3_initializers, _selection3_extraInitializers);
        __esDecorate(null, null, _matcher_decorators, { kind: "field", name: "matcher", static: false, private: false, access: { has: obj => "matcher" in obj, get: obj => obj.matcher, set: (obj, value) => { obj.matcher = value; } }, metadata: _metadata }, _matcher_initializers, _matcher_extraInitializers);
        __esDecorate(null, null, _options4_decorators, { kind: "field", name: "options4", static: false, private: false, access: { has: obj => "options4" in obj, get: obj => obj.options4, set: (obj, value) => { obj.options4 = value; } }, metadata: _metadata }, _options4_initializers, _options4_extraInitializers);
        __esDecorate(null, null, _selection4_decorators, { kind: "field", name: "selection4", static: false, private: false, access: { has: obj => "selection4" in obj, get: obj => obj.selection4, set: (obj, value) => { obj.selection4 = value; } }, metadata: _metadata }, _selection4_initializers, _selection4_extraInitializers);
        __esDecorate(null, null, _selections1_decorators, { kind: "field", name: "selections1", static: false, private: false, access: { has: obj => "selections1" in obj, get: obj => obj.selections1, set: (obj, value) => { obj.selections1 = value; } }, metadata: _metadata }, _selections1_initializers, _selections1_extraInitializers);
        __esDecorate(null, null, _selections2_decorators, { kind: "field", name: "selections2", static: false, private: false, access: { has: obj => "selections2" in obj, get: obj => obj.selections2, set: (obj, value) => { obj.selections2 = value; } }, metadata: _metadata }, _selections2_initializers, _selections2_extraInitializers);
        __esDecorate(null, null, _selections3_decorators, { kind: "field", name: "selections3", static: false, private: false, access: { has: obj => "selections3" in obj, get: obj => obj.selections3, set: (obj, value) => { obj.selections3 = value; } }, metadata: _metadata }, _selections3_initializers, _selections3_extraInitializers);
        __esDecorate(null, null, _selections4_decorators, { kind: "field", name: "selections4", static: false, private: false, access: { has: obj => "selections4" in obj, get: obj => obj.selections4, set: (obj, value) => { obj.selections4 = value; } }, metadata: _metadata }, _selections4_initializers, _selections4_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SelectDropdown = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SelectDropdown = _classThis;
})();
export { SelectDropdown };
//# sourceMappingURL=select-dropdown.js.map