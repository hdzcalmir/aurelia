import { compatRegistration } from '@aurelia/compat-v1';
import { assert, createFixture } from '@aurelia/testing';
describe('compat-v1/delegate.spec.ts', function () {
    it('works with delegate event binding', async function () {
        const { stop, appHost, component } = createFixture('<button click.delegate="doSomething()"></my-ce>', class App {
            constructor() {
                this.callCount = 0;
            }
            doSomething() {
                this.callCount++;
            }
        }, [compatRegistration]);
        assert.strictEqual(component.callCount, 0);
        const button = appHost.querySelector('button');
        button.click();
        assert.strictEqual(component.callCount, 1);
        await stop();
    });
});
//# sourceMappingURL=delegate.spec.js.map