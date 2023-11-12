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
import template from './read-only-text.html';
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime`
 *   - `interpolation-binding`
 *   - `property-binding`, different binding modes, such as `one-time`, and `to-view`.
 * - `@aurelia/runtime-html`
 *   - `setter-observer`
 *   - `element-property-accessor`
 */
let ReadOnlyText = class ReadOnlyText {
};
__decorate([
    bindable,
    __metadata("design:type", String)
], ReadOnlyText.prototype, "value", void 0);
ReadOnlyText = __decorate([
    customElement({ name: 'read-only-text', template })
], ReadOnlyText);
export { ReadOnlyText };
//# sourceMappingURL=read-only-text.js.map