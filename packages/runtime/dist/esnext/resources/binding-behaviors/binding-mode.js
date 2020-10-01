var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BindingMode } from '../../flags';
import { bindingBehavior } from '../binding-behavior';
export class BindingModeBehavior {
    constructor(mode) {
        this.mode = mode;
        this.originalModes = new WeakMap();
    }
    bind(flags, scope, binding) {
        this.originalModes.set(binding, binding.mode);
        binding.mode = this.mode;
    }
    unbind(flags, scope, binding) {
        binding.mode = this.originalModes.get(binding);
    }
}
let OneTimeBindingBehavior = /** @class */ (() => {
    let OneTimeBindingBehavior = class OneTimeBindingBehavior extends BindingModeBehavior {
        constructor() {
            super(BindingMode.oneTime);
        }
    };
    OneTimeBindingBehavior = __decorate([
        bindingBehavior('oneTime'),
        __metadata("design:paramtypes", [])
    ], OneTimeBindingBehavior);
    return OneTimeBindingBehavior;
})();
export { OneTimeBindingBehavior };
let ToViewBindingBehavior = /** @class */ (() => {
    let ToViewBindingBehavior = class ToViewBindingBehavior extends BindingModeBehavior {
        constructor() {
            super(BindingMode.toView);
        }
    };
    ToViewBindingBehavior = __decorate([
        bindingBehavior('toView'),
        __metadata("design:paramtypes", [])
    ], ToViewBindingBehavior);
    return ToViewBindingBehavior;
})();
export { ToViewBindingBehavior };
let FromViewBindingBehavior = /** @class */ (() => {
    let FromViewBindingBehavior = class FromViewBindingBehavior extends BindingModeBehavior {
        constructor() {
            super(BindingMode.fromView);
        }
    };
    FromViewBindingBehavior = __decorate([
        bindingBehavior('fromView'),
        __metadata("design:paramtypes", [])
    ], FromViewBindingBehavior);
    return FromViewBindingBehavior;
})();
export { FromViewBindingBehavior };
let TwoWayBindingBehavior = /** @class */ (() => {
    let TwoWayBindingBehavior = class TwoWayBindingBehavior extends BindingModeBehavior {
        constructor() {
            super(BindingMode.twoWay);
        }
    };
    TwoWayBindingBehavior = __decorate([
        bindingBehavior('twoWay'),
        __metadata("design:paramtypes", [])
    ], TwoWayBindingBehavior);
    return TwoWayBindingBehavior;
})();
export { TwoWayBindingBehavior };
//# sourceMappingURL=binding-mode.js.map