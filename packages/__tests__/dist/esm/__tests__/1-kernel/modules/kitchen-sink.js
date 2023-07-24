var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { valueConverter, bindingBehavior, customElement, customAttribute } from '@aurelia/runtime-html';
export let CE = class CE {
};
CE = __decorate([
    customElement({ name: 'ce' })
], CE);
export let CA = class CA {
};
CA = __decorate([
    customAttribute({ name: 'ca' })
], CA);
export let VC = class VC {
};
VC = __decorate([
    valueConverter({ name: 'vc' })
], VC);
export let BB = class BB {
};
BB = __decorate([
    bindingBehavior({ name: 'bb' })
], BB);
export class X {
}
export const $null = null;
export const $undefined = undefined;
export const $1 = 1;
export const $true = true;
export const $false = false;
export const Registry = {
    register(container) {
        container.register(CE, CA, VC, BB);
    },
};
//# sourceMappingURL=kitchen-sink.js.map