import { compatRegistration } from '@aurelia/compat-v1';
import { assert, createFixture } from '@aurelia/testing';
describe('compat-v1/event.spec.ts', function () {
    it('works with delegate event binding', function () {
        const { trigger, component } = createFixture('<button click.delegate="doSomething()"></my-ce>', class App {
            constructor() {
                this.callCount = 0;
            }
            doSomething() {
                this.callCount++;
            }
        }, [compatRegistration]);
        assert.strictEqual(component.callCount, 0);
        trigger.click('button', { bubbles: true });
        assert.strictEqual(component.callCount, 1);
    });
    it('does not call preventDefault() without compat registration', function () {
        let prevented = false;
        const { trigger } = createFixture('<button click.trigger="doSomething($event)"></my-ce>', class App {
            constructor() {
                this.callCount = 0;
            }
            doSomething(e) {
                Object.defineProperty(e, 'preventDefault', { value: () => { prevented = true; } });
            }
        }, []);
        trigger.click('button');
        assert.strictEqual(prevented, false);
    });
    it('calls preventDefault() when using eventPreventDefaultBehavior', function () {
        let prevented = false;
        const { trigger } = createFixture('<button click.trigger="doSomething($event)"></my-ce>', class App {
            constructor() {
                this.callCount = 0;
            }
            doSomething(e) {
                Object.defineProperty(e, 'preventDefault', { value: () => { prevented = true; } });
            }
        }, [compatRegistration]);
        trigger.click('button');
        assert.strictEqual(prevented, true);
    });
});
//# sourceMappingURL=event.spec.js.map