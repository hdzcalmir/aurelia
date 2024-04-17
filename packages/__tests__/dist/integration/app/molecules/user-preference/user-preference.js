var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
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
let User = (() => {
    let _classDecorators = [trace(callCollection)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var User = _classThis = class {
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
    __setFunctionName(_classThis, "User");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
})();
export { User };
let UserPreference = (() => {
    let _classDecorators = [customElement({ name: 'user-preference', template })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _user_decorators;
    let _user_initializers = [];
    let _user_extraInitializers = [];
    var UserPreference = _classThis = class {
        constructor() {
            this.user = __runInitializers(this, _user_initializers, void 0);
            __runInitializers(this, _user_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "UserPreference");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _user_decorators = [bindable];
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: obj => "user" in obj, get: obj => obj.user, set: (obj, value) => { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserPreference = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserPreference = _classThis;
})();
export { UserPreference };
//# sourceMappingURL=user-preference.js.map