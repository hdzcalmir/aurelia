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
export class Storage {
    constructor(type, size, unit) {
        this.type = type;
        this.size = size;
        this.unit = unit;
    }
}
export class Laptop extends Thing {
    constructor(cpu, ram, storage, screen, modelNumber, make) {
        super(modelNumber, make);
        this.cpu = cpu;
        this.ram = ram;
        this.storage = storage;
        this.screen = screen;
    }
}
let LaptopSpecsViewer = class LaptopSpecsViewer {
    binding() {
        const { storage: { size, unit, type } } = this.model;
        this.storage = `${size}${unit} ${type}`;
    }
};
__decorate([
    bindable,
    __metadata("design:type", Laptop)
], LaptopSpecsViewer.prototype, "model", void 0);
LaptopSpecsViewer = __decorate([
    customElement({ name: 'laptop-specs-viewer', template })
], LaptopSpecsViewer);
export { LaptopSpecsViewer };
//# sourceMappingURL=laptop-specs-viewer.js.map