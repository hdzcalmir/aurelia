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
import template from './checkbox-list.html';
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime`
 *   - `array-observer`
 * - `@aurelia/runtime-html`
 *   - `checked-observer` (`checked` bind)
 *   - `setter-observer` (`model` bind)
 */
let CheckboxList = class CheckboxList {
};
__decorate([
    bindable,
    __metadata("design:type", Array)
], CheckboxList.prototype, "choices1", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], CheckboxList.prototype, "selectedItems1", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], CheckboxList.prototype, "choices2", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], CheckboxList.prototype, "selectedItems2", void 0);
__decorate([
    bindable,
    __metadata("design:type", Function)
], CheckboxList.prototype, "matcher", void 0);
CheckboxList = __decorate([
    customElement({ name: 'checkbox-list', template })
], CheckboxList);
export { CheckboxList };
//# sourceMappingURL=checkbox-list.js.map