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
import template from './tri-state-boolean.html';
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime-html`
 *   - `checked-observer` for boolean
 */
let TriStateBoolean = class TriStateBoolean {
};
__decorate([
    bindable,
    __metadata("design:type", String)
], TriStateBoolean.prototype, "noValueDisplay", void 0);
__decorate([
    bindable,
    __metadata("design:type", String)
], TriStateBoolean.prototype, "trueDisplay", void 0);
__decorate([
    bindable,
    __metadata("design:type", String)
], TriStateBoolean.prototype, "falseDisplay", void 0);
__decorate([
    bindable,
    __metadata("design:type", Boolean)
], TriStateBoolean.prototype, "value", void 0);
TriStateBoolean = __decorate([
    customElement({ name: 'tri-state-boolean', template })
], TriStateBoolean);
export { TriStateBoolean };
//# sourceMappingURL=tri-state-boolean.js.map