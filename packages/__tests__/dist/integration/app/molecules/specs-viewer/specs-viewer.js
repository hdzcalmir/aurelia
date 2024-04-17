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
import { valueConverter, bindable, customElement } from '@aurelia/runtime-html';
import { Thing, ThingViewer } from './thing-viewer.js';
import { Camera, CameraSpecsViewer } from './camera-specs-viewer.js';
import { Laptop, LaptopSpecsViewer } from './laptop-specs-viewer.js';
import template from './specs-viewer.html';
let SpecsViewer = (() => {
    let _classDecorators = [customElement({ name: 'specs-viewer', template })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _things_decorators;
    let _things_initializers = [];
    let _things_extraInitializers = [];
    var SpecsViewer = _classThis = class {
        constructor() {
            this.things = __runInitializers(this, _things_initializers, void 0);
            this.pairs = __runInitializers(this, _things_extraInitializers);
        }
        binding() {
            const toVm = (thing) => {
                switch (true) {
                    case thing instanceof Camera: return CameraSpecsViewer;
                    case thing instanceof Laptop: return LaptopSpecsViewer;
                    case thing instanceof Thing: return ThingViewer;
                    default: throw new Error(`Unsupported type ${thing.constructor.prototype}`);
                }
            };
            this.pairs = this.things.map((thing) => ({ thing, vm: toVm(thing) }));
        }
    };
    __setFunctionName(_classThis, "SpecsViewer");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _things_decorators = [bindable];
        __esDecorate(null, null, _things_decorators, { kind: "field", name: "things", static: false, private: false, access: { has: obj => "things" in obj, get: obj => obj.things, set: (obj, value) => { obj.things = value; } }, metadata: _metadata }, _things_initializers, _things_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SpecsViewer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SpecsViewer = _classThis;
})();
export { SpecsViewer };
let ViewerValueConverter = (() => {
    let _classDecorators = [valueConverter('viewer')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ViewerValueConverter = _classThis = class {
        toView(thing) {
            switch (true) {
                case thing instanceof Camera: return CameraSpecsViewer;
                case thing instanceof Laptop: return LaptopSpecsViewer;
                case thing instanceof Thing: return ThingViewer;
                default: throw new Error(`Unsupported type ${thing.constructor.prototype}`);
            }
        }
    };
    __setFunctionName(_classThis, "ViewerValueConverter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ViewerValueConverter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ViewerValueConverter = _classThis;
})();
export { ViewerValueConverter };
//# sourceMappingURL=specs-viewer.js.map