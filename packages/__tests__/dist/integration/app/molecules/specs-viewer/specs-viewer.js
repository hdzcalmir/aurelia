var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { valueConverter, bindable, customElement } from '@aurelia/runtime-html';
import { Thing, ThingViewer } from './thing-viewer.js';
import { Camera, CameraSpecsViewer } from './camera-specs-viewer.js';
import { Laptop, LaptopSpecsViewer } from './laptop-specs-viewer.js';
import template from './specs-viewer.html';
let SpecsViewer = class SpecsViewer {
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
__decorate([
    bindable,
    __metadata("design:type", Array)
], SpecsViewer.prototype, "things", void 0);
SpecsViewer = __decorate([
    customElement({ name: 'specs-viewer', template })
], SpecsViewer);
export { SpecsViewer };
let ViewerValueConverter = class ViewerValueConverter {
    toView(thing) {
        switch (true) {
            case thing instanceof Camera: return CameraSpecsViewer;
            case thing instanceof Laptop: return LaptopSpecsViewer;
            case thing instanceof Thing: return ThingViewer;
            default: throw new Error(`Unsupported type ${thing.constructor.prototype}`);
        }
    }
};
ViewerValueConverter = __decorate([
    valueConverter('viewer')
], ViewerValueConverter);
export { ViewerValueConverter };
//# sourceMappingURL=specs-viewer.js.map