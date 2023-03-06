var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, valueConverter } from '@aurelia/runtime-html';
import template from './let-demo.html';
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime`
 *   - Bindings
 *     - `let-binding`
 *     - `ast` (partial)
 *        - `BinaryExpression`
 *        - `UnaryExpression`
 *        - `ValueConverterExpression`
 */
let LetDemo = class LetDemo {
    constructor() {
        this.a = false;
        this.b = false;
        this.ec = { x: 10, a: -5, b: 3 };
        this.line = { y: 10, intercept: 2, slope: 2 };
    }
};
LetDemo = __decorate([
    customElement({ name: 'let-demo', template })
], LetDemo);
export { LetDemo };
let SqrtValueConverter = class SqrtValueConverter {
    toView(value) {
        return Math.sqrt(value);
    }
};
SqrtValueConverter = __decorate([
    valueConverter({ name: 'sqrt' })
], SqrtValueConverter);
export { SqrtValueConverter };
//# sourceMappingURL=let-demo.js.map