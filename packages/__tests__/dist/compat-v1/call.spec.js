var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { compatRegistration } from '@aurelia/compat-v1';
import { bindable, customElement } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('compat-v1/call.spec.ts', function () {
    it('works with function call binding', async function () {
        let MyCe = class MyCe {
        };
        __decorate([
            bindable,
            __metadata("design:type", Function)
        ], MyCe.prototype, "action", void 0);
        MyCe = __decorate([
            customElement({ name: 'my-ce', template: '<button click.trigger="action()"></button>' })
        ], MyCe);
        const { stop, appHost, component } = createFixture('<my-ce action.call="doSomething()"></my-ce>', class App {
            constructor() {
                this.callCount = 0;
            }
            doSomething() {
                this.callCount++;
            }
        }, [MyCe, compatRegistration]);
        assert.strictEqual(component.callCount, 0);
        const button = appHost.querySelector('button');
        button.click();
        assert.strictEqual(component.callCount, 1);
        await stop();
    });
});
//# sourceMappingURL=call.spec.js.map