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
import template from './user-preference.html';
import { trace } from '@aurelia/testing';
import { callCollection } from '../../debug.js';
export class TestArray extends Array {
    constructor(...args) {
        super(...args);
        this.indeterminate = 'test';
        Object.setPrototypeOf(this, TestArray.prototype);
    }
}
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime`
 *   - Observers
 *     - `computed-observer`
 *     - `dirty-checker`
 */
let User = class User {
    constructor(firstName, lastName, age, role, organization, city, country) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.role = role;
        this.organization = organization;
        this.city = city;
        this.country = country;
        this.arr = new TestArray();
    }
    get fullNameStatic() {
        return `${this.firstName}${this.lastName ? ` ${this.lastName}` : ''}`;
    }
    // default setting, that is no decorator === `@computed({ static: false })`
    get fullNameNonStatic() {
        if (this.age < 1) {
            return 'infant';
        }
        return `${this.firstName}${this.lastName ? ` ${this.lastName}` : ''}`;
    }
    get fullNameWrongStatic() {
        if (this.age < 1) {
            return `infant`;
        }
        return `${this.firstName}${this.lastName ? ` ${this.lastName}` : ''}`;
    }
    get $role() {
        return `${this.role}, ${this.organization}`;
    }
    set $role(value) {
        this.role = value;
    }
    get $location() {
        return `${this.city}, ${this.country}`;
    }
    set $location(value) {
        this.country = value;
    }
};
User = __decorate([
    trace(callCollection),
    __metadata("design:paramtypes", [String, String, Number, String, String, String, String])
], User);
export { User };
let UserPreference = class UserPreference {
};
__decorate([
    bindable,
    __metadata("design:type", User)
], UserPreference.prototype, "user", void 0);
UserPreference = __decorate([
    customElement({ name: 'user-preference', template })
], UserPreference);
export { UserPreference };
//# sourceMappingURL=user-preference.js.map