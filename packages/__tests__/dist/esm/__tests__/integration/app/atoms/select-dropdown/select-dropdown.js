var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { customElement, bindable } from '@aurelia/runtime-html';
import template from './select-dropdown.html';
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime-html`
 *   - Observation
 *     - `select-value-observer`
 */
let SelectDropdown = class SelectDropdown {
};
__decorate([
    bindable,
    __metadata("design:type", Array)
], SelectDropdown.prototype, "options1", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], SelectDropdown.prototype, "selection1", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], SelectDropdown.prototype, "options2", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], SelectDropdown.prototype, "selection2", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], SelectDropdown.prototype, "options3", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], SelectDropdown.prototype, "selection3", void 0);
__decorate([
    bindable,
    __metadata("design:type", Function)
], SelectDropdown.prototype, "matcher", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], SelectDropdown.prototype, "options4", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], SelectDropdown.prototype, "selection4", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], SelectDropdown.prototype, "selections1", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], SelectDropdown.prototype, "selections2", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], SelectDropdown.prototype, "selections3", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], SelectDropdown.prototype, "selections4", void 0);
SelectDropdown = __decorate([
    customElement({ name: 'select-dropdown', template })
], SelectDropdown);
export { SelectDropdown };
//# sourceMappingURL=select-dropdown.js.map