var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { bindable, customElement } from '@aurelia/runtime-html';
import template from './camera-specs-viewer.html';
import { Thing } from './thing-viewer.js';
export class Zoom {
    constructor(optical, digital) {
        this.optical = optical;
        this.digital = digital;
    }
}
export class Camera extends Thing {
    constructor(zoom, iso, focalLengthRange, fNumberRange, modelNumber, make) {
        super(modelNumber, make);
        this.zoom = zoom;
        this.iso = iso;
        this.focalLengthRange = focalLengthRange;
        this.fNumberRange = fNumberRange;
    }
}
let CameraSpecsViewer = class CameraSpecsViewer {
    binding(..._args) {
        const { focalLengthRange: [fln, flx], fNumberRange: [fnn, fnx] } = this.model;
        this.focalLength = `${fln}-${flx}`;
        this.fNumber = `${fnn}-${fnx}`;
    }
};
__decorate([
    bindable,
    __metadata("design:type", Camera)
], CameraSpecsViewer.prototype, "model", void 0);
CameraSpecsViewer = __decorate([
    customElement({ name: 'camera-specs-viewer', template })
], CameraSpecsViewer);
export { CameraSpecsViewer };
//# sourceMappingURL=camera-specs-viewer.js.map