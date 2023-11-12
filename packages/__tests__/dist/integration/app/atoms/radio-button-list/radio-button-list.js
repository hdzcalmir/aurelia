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
import template from './radio-button-list.html';
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime`
 *   - `map-observer`
 * - `@aurelia/runtime-html`
 *   - `checked-observer` (`checked` bind)
 *   - `setter-observer` (`model` bind)
 */
let RadioButtonList = class RadioButtonList {
    constructor() {
        this.group = 'choices';
    }
};
__decorate([
    bindable,
    __metadata("design:type", String)
], RadioButtonList.prototype, "group", void 0);
__decorate([
    bindable,
    __metadata("design:type", Map)
], RadioButtonList.prototype, "choices1", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], RadioButtonList.prototype, "chosen1", void 0);
__decorate([
    bindable,
    __metadata("design:type", Map)
], RadioButtonList.prototype, "choices2", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], RadioButtonList.prototype, "chosen2", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], RadioButtonList.prototype, "choices3", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], RadioButtonList.prototype, "chosen3", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], RadioButtonList.prototype, "choices4", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], RadioButtonList.prototype, "chosen4", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], RadioButtonList.prototype, "choices5", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], RadioButtonList.prototype, "chosen5", void 0);
__decorate([
    bindable,
    __metadata("design:type", Function)
], RadioButtonList.prototype, "matcher", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], RadioButtonList.prototype, "choices6", void 0);
__decorate([
    bindable,
    __metadata("design:type", String)
], RadioButtonList.prototype, "chosen6", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], RadioButtonList.prototype, "choices7", void 0);
__decorate([
    bindable,
    __metadata("design:type", String)
], RadioButtonList.prototype, "chosen7", void 0);
RadioButtonList = __decorate([
    customElement({ name: 'radio-button-list', template })
], RadioButtonList);
export { RadioButtonList };
//# sourceMappingURL=radio-button-list.js.map