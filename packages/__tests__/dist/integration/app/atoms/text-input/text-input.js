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
import template from './text-input.html';
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime`
 *   - bindings
 *     - `property-binding`, different binding modes, such as `two-way`, `one-time`, `to-view`, and `from-view`.
 *   - custom-attributes
 *     - `if` (template controller)
 * - `@aurelia/runtime-html`
 *   - bindings
 *     - `value-attribute-observer`
 *   - binding behavior
 *     - `update-trigger`
 */
let TextInput = class TextInput {
    constructor() {
        this.trigger = undefined;
    }
};
__decorate([
    bindable,
    __metadata("design:type", String)
], TextInput.prototype, "value", void 0);
__decorate([
    bindable,
    __metadata("design:type", String)
], TextInput.prototype, "trigger", void 0);
TextInput = __decorate([
    customElement({ name: 'text-input', template })
], TextInput);
export { TextInput };
//# sourceMappingURL=text-input.js.map