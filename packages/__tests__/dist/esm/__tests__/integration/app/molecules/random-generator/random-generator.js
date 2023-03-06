var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import template from "./random-generator.html";
import { customElement } from '@aurelia/runtime-html';
/**
 * Potential coverage target
 * - `runtime-html`
 *    - Binding behaviors
 *      - `attr`
 *      - `self`
 */
let RandomGenerator = class RandomGenerator {
    constructor() {
        this.generate();
    }
    generate() {
        this.random = Math.round(Math.random() * 10000);
    }
    doSomething() {
        console.log('random-generator.ts__doSomething()');
    }
};
RandomGenerator = __decorate([
    customElement({ name: 'random-generator', template }),
    __metadata("design:paramtypes", [])
], RandomGenerator);
export { RandomGenerator };
//# sourceMappingURL=random-generator.js.map