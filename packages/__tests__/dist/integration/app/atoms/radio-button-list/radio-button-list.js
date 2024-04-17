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
import { bindable, customElement } from '@aurelia/runtime-html';
import template from './radio-button-list.html';
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime`
 *   - `map-observer`
 * - `@aurelia/runtime-html`
 *   - `checked-observer` (`checked` bind)
 *   - `setter-observer` (`model` bind)
 */
let RadioButtonList = (() => {
    let _classDecorators = [customElement({ name: 'radio-button-list', template })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _group_decorators;
    let _group_initializers = [];
    let _group_extraInitializers = [];
    let _choices1_decorators;
    let _choices1_initializers = [];
    let _choices1_extraInitializers = [];
    let _chosen1_decorators;
    let _chosen1_initializers = [];
    let _chosen1_extraInitializers = [];
    let _choices2_decorators;
    let _choices2_initializers = [];
    let _choices2_extraInitializers = [];
    let _chosen2_decorators;
    let _chosen2_initializers = [];
    let _chosen2_extraInitializers = [];
    let _choices3_decorators;
    let _choices3_initializers = [];
    let _choices3_extraInitializers = [];
    let _chosen3_decorators;
    let _chosen3_initializers = [];
    let _chosen3_extraInitializers = [];
    let _choices4_decorators;
    let _choices4_initializers = [];
    let _choices4_extraInitializers = [];
    let _chosen4_decorators;
    let _chosen4_initializers = [];
    let _chosen4_extraInitializers = [];
    let _choices5_decorators;
    let _choices5_initializers = [];
    let _choices5_extraInitializers = [];
    let _chosen5_decorators;
    let _chosen5_initializers = [];
    let _chosen5_extraInitializers = [];
    let _matcher_decorators;
    let _matcher_initializers = [];
    let _matcher_extraInitializers = [];
    let _choices6_decorators;
    let _choices6_initializers = [];
    let _choices6_extraInitializers = [];
    let _chosen6_decorators;
    let _chosen6_initializers = [];
    let _chosen6_extraInitializers = [];
    let _choices7_decorators;
    let _choices7_initializers = [];
    let _choices7_extraInitializers = [];
    let _chosen7_decorators;
    let _chosen7_initializers = [];
    let _chosen7_extraInitializers = [];
    var RadioButtonList = _classThis = class {
        constructor() {
            this.group = __runInitializers(this, _group_initializers, 'choices');
            this.choices1 = (__runInitializers(this, _group_extraInitializers), __runInitializers(this, _choices1_initializers, void 0));
            this.chosen1 = (__runInitializers(this, _choices1_extraInitializers), __runInitializers(this, _chosen1_initializers, void 0));
            this.choices2 = (__runInitializers(this, _chosen1_extraInitializers), __runInitializers(this, _choices2_initializers, void 0));
            this.chosen2 = (__runInitializers(this, _choices2_extraInitializers), __runInitializers(this, _chosen2_initializers, void 0));
            this.choices3 = (__runInitializers(this, _chosen2_extraInitializers), __runInitializers(this, _choices3_initializers, void 0));
            this.chosen3 = (__runInitializers(this, _choices3_extraInitializers), __runInitializers(this, _chosen3_initializers, void 0));
            this.choices4 = (__runInitializers(this, _chosen3_extraInitializers), __runInitializers(this, _choices4_initializers, void 0));
            this.chosen4 = (__runInitializers(this, _choices4_extraInitializers), __runInitializers(this, _chosen4_initializers, void 0));
            this.choices5 = (__runInitializers(this, _chosen4_extraInitializers), __runInitializers(this, _choices5_initializers, void 0));
            this.chosen5 = (__runInitializers(this, _choices5_extraInitializers), __runInitializers(this, _chosen5_initializers, void 0));
            this.matcher = (__runInitializers(this, _chosen5_extraInitializers), __runInitializers(this, _matcher_initializers, void 0));
            this.choices6 = (__runInitializers(this, _matcher_extraInitializers), __runInitializers(this, _choices6_initializers, void 0));
            this.chosen6 = (__runInitializers(this, _choices6_extraInitializers), __runInitializers(this, _chosen6_initializers, void 0));
            this.choices7 = (__runInitializers(this, _chosen6_extraInitializers), __runInitializers(this, _choices7_initializers, void 0));
            this.chosen7 = (__runInitializers(this, _choices7_extraInitializers), __runInitializers(this, _chosen7_initializers, void 0));
            __runInitializers(this, _chosen7_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RadioButtonList");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _group_decorators = [bindable];
        _choices1_decorators = [bindable];
        _chosen1_decorators = [bindable];
        _choices2_decorators = [bindable];
        _chosen2_decorators = [bindable];
        _choices3_decorators = [bindable];
        _chosen3_decorators = [bindable];
        _choices4_decorators = [bindable];
        _chosen4_decorators = [bindable];
        _choices5_decorators = [bindable];
        _chosen5_decorators = [bindable];
        _matcher_decorators = [bindable];
        _choices6_decorators = [bindable];
        _chosen6_decorators = [bindable];
        _choices7_decorators = [bindable];
        _chosen7_decorators = [bindable];
        __esDecorate(null, null, _group_decorators, { kind: "field", name: "group", static: false, private: false, access: { has: obj => "group" in obj, get: obj => obj.group, set: (obj, value) => { obj.group = value; } }, metadata: _metadata }, _group_initializers, _group_extraInitializers);
        __esDecorate(null, null, _choices1_decorators, { kind: "field", name: "choices1", static: false, private: false, access: { has: obj => "choices1" in obj, get: obj => obj.choices1, set: (obj, value) => { obj.choices1 = value; } }, metadata: _metadata }, _choices1_initializers, _choices1_extraInitializers);
        __esDecorate(null, null, _chosen1_decorators, { kind: "field", name: "chosen1", static: false, private: false, access: { has: obj => "chosen1" in obj, get: obj => obj.chosen1, set: (obj, value) => { obj.chosen1 = value; } }, metadata: _metadata }, _chosen1_initializers, _chosen1_extraInitializers);
        __esDecorate(null, null, _choices2_decorators, { kind: "field", name: "choices2", static: false, private: false, access: { has: obj => "choices2" in obj, get: obj => obj.choices2, set: (obj, value) => { obj.choices2 = value; } }, metadata: _metadata }, _choices2_initializers, _choices2_extraInitializers);
        __esDecorate(null, null, _chosen2_decorators, { kind: "field", name: "chosen2", static: false, private: false, access: { has: obj => "chosen2" in obj, get: obj => obj.chosen2, set: (obj, value) => { obj.chosen2 = value; } }, metadata: _metadata }, _chosen2_initializers, _chosen2_extraInitializers);
        __esDecorate(null, null, _choices3_decorators, { kind: "field", name: "choices3", static: false, private: false, access: { has: obj => "choices3" in obj, get: obj => obj.choices3, set: (obj, value) => { obj.choices3 = value; } }, metadata: _metadata }, _choices3_initializers, _choices3_extraInitializers);
        __esDecorate(null, null, _chosen3_decorators, { kind: "field", name: "chosen3", static: false, private: false, access: { has: obj => "chosen3" in obj, get: obj => obj.chosen3, set: (obj, value) => { obj.chosen3 = value; } }, metadata: _metadata }, _chosen3_initializers, _chosen3_extraInitializers);
        __esDecorate(null, null, _choices4_decorators, { kind: "field", name: "choices4", static: false, private: false, access: { has: obj => "choices4" in obj, get: obj => obj.choices4, set: (obj, value) => { obj.choices4 = value; } }, metadata: _metadata }, _choices4_initializers, _choices4_extraInitializers);
        __esDecorate(null, null, _chosen4_decorators, { kind: "field", name: "chosen4", static: false, private: false, access: { has: obj => "chosen4" in obj, get: obj => obj.chosen4, set: (obj, value) => { obj.chosen4 = value; } }, metadata: _metadata }, _chosen4_initializers, _chosen4_extraInitializers);
        __esDecorate(null, null, _choices5_decorators, { kind: "field", name: "choices5", static: false, private: false, access: { has: obj => "choices5" in obj, get: obj => obj.choices5, set: (obj, value) => { obj.choices5 = value; } }, metadata: _metadata }, _choices5_initializers, _choices5_extraInitializers);
        __esDecorate(null, null, _chosen5_decorators, { kind: "field", name: "chosen5", static: false, private: false, access: { has: obj => "chosen5" in obj, get: obj => obj.chosen5, set: (obj, value) => { obj.chosen5 = value; } }, metadata: _metadata }, _chosen5_initializers, _chosen5_extraInitializers);
        __esDecorate(null, null, _matcher_decorators, { kind: "field", name: "matcher", static: false, private: false, access: { has: obj => "matcher" in obj, get: obj => obj.matcher, set: (obj, value) => { obj.matcher = value; } }, metadata: _metadata }, _matcher_initializers, _matcher_extraInitializers);
        __esDecorate(null, null, _choices6_decorators, { kind: "field", name: "choices6", static: false, private: false, access: { has: obj => "choices6" in obj, get: obj => obj.choices6, set: (obj, value) => { obj.choices6 = value; } }, metadata: _metadata }, _choices6_initializers, _choices6_extraInitializers);
        __esDecorate(null, null, _chosen6_decorators, { kind: "field", name: "chosen6", static: false, private: false, access: { has: obj => "chosen6" in obj, get: obj => obj.chosen6, set: (obj, value) => { obj.chosen6 = value; } }, metadata: _metadata }, _chosen6_initializers, _chosen6_extraInitializers);
        __esDecorate(null, null, _choices7_decorators, { kind: "field", name: "choices7", static: false, private: false, access: { has: obj => "choices7" in obj, get: obj => obj.choices7, set: (obj, value) => { obj.choices7 = value; } }, metadata: _metadata }, _choices7_initializers, _choices7_extraInitializers);
        __esDecorate(null, null, _chosen7_decorators, { kind: "field", name: "chosen7", static: false, private: false, access: { has: obj => "chosen7" in obj, get: obj => obj.chosen7, set: (obj, value) => { obj.chosen7 = value; } }, metadata: _metadata }, _chosen7_initializers, _chosen7_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RadioButtonList = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RadioButtonList = _classThis;
})();
export { RadioButtonList };
//# sourceMappingURL=radio-button-list.js.map