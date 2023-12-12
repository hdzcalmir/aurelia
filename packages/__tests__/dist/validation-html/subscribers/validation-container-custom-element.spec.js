var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { newInstanceForScope, newInstanceOf, toArray } from '@aurelia/kernel';
import { assert, createSpy, getVisibleText, TestContext } from '@aurelia/testing';
import { IValidationRules } from '@aurelia/validation';
import { CustomElement, customElement, IPlatform, Aurelia } from '@aurelia/runtime-html';
import { IValidationController, ValidationController, ValidationHtmlConfiguration, } from '@aurelia/validation-html';
import { createSpecFunction, ToNumberValueConverter } from '../../util.js';
import { Person } from '../../validation/_test-resources.js';
describe('validation-html/subscribers/validation-container-custom-element.spec.ts', function () {
    describe('validation-container-custom-element', function () {
        let App = class App {
            constructor(platform, controller, validationRules) {
                this.platform = platform;
                this.controller = controller;
                this.validationRules = validationRules;
                this.person = new Person((void 0), (void 0));
                this.controllerValidateSpy = createSpy(controller, 'validate', true);
                this.controllerRemoveSubscriberSpy = createSpy(controller, 'removeSubscriber', true);
                validationRules
                    .on(this.person)
                    .ensure('name')
                    .displayName('Name')
                    .required()
                    .ensure('age')
                    .displayName('Age')
                    .required()
                    .satisfies((age) => age === null || age === void 0 || age % 3 === 0 && age % 5 === 0)
                    .withMessage('${$displayName} is not fizbaz');
            }
            unbinding() {
                this.validationRules.off();
                // mandatory cleanup in root
                this.controller.reset();
            }
            dispose() {
                const controller = this.controller;
                assert.equal(controller.results.length, 0, 'the result should have been removed');
                assert.equal(controller.bindings.size, 0, 'the bindings should have been removed');
                assert.equal(controller.objects.size, 0, 'the objects should have been removed');
            }
        };
        App = __decorate([
            __param(0, IPlatform),
            __param(1, newInstanceForScope(IValidationController)),
            __param(2, IValidationRules),
            __metadata("design:paramtypes", [Object, ValidationController, Object])
        ], App);
        async function runTest(testFunction, { template, containerTemplate }) {
            const ctx = TestContext.create();
            const container = ctx.container;
            const host = ctx.doc.createElement('app');
            ctx.doc.body.appendChild(host);
            const au = new Aurelia(container);
            await au
                .register(ValidationHtmlConfiguration.customize((options) => {
                if (containerTemplate) {
                    options.SubscriberCustomElementTemplate = containerTemplate;
                }
            }), ToNumberValueConverter)
                .app({
                host,
                component: CustomElement.define({ name: 'app', template }, App)
            })
                .start();
            const app = au.root.controller.viewModel;
            await testFunction({ app, host, container, platform: app.platform, ctx });
            await au.stop();
            ctx.doc.body.removeChild(host);
            assert.equal(app.controllerRemoveSubscriberSpy.calls.length, template.match(/validation-container/g).length / 2 + template.match(/validate/g).length);
            au.dispose();
        }
        const $it = createSpecFunction(runTest);
        async function assertEventHandler(target, platform, controllerValidateSpy, handleValidationEventSpy, ctx, event = 'focusout') {
            handleValidationEventSpy.calls.splice(0);
            controllerValidateSpy.calls.splice(0);
            target.dispatchEvent(new ctx.Event(event));
            await platform.domReadQueue.yield();
            assert.equal(controllerValidateSpy.calls.length, 1, 'incorrect #calls for validate');
            assert.equal(handleValidationEventSpy.calls.length, 1, 'incorrect #calls for handleValidationEvent');
        }
        function assertSubscriber(controller, ce) {
            const subscribers = controller['subscribers'];
            assert.equal((subscribers).has(ce), true);
            assert.equal(ce['controller'], controller);
        }
        $it('shows the errors for the containing validation targets', async function ({ host, platform, app, ctx }) {
            const ceEl1 = host.querySelector('validation-container');
            const ceEl2 = host.querySelector('validation-container:nth-of-type(2)');
            const ceVm1 = CustomElement.for(ceEl1).viewModel;
            const ceVm2 = CustomElement.for(ceEl2).viewModel;
            const controller = app.controller;
            assertSubscriber(controller, ceVm1);
            assertSubscriber(controller, ceVm2);
            const input1 = ceEl1.querySelector('input#target1');
            const input2 = ceEl2.querySelector('input#target2');
            const controllerSpy = app.controllerValidateSpy;
            const spy1 = createSpy(ceVm1, 'handleValidationEvent', true);
            const spy2 = createSpy(ceVm2, 'handleValidationEvent', true);
            await assertEventHandler(input1, platform, controllerSpy, spy1, ctx);
            await assertEventHandler(input2, platform, controllerSpy, spy2, ctx);
            const errors1 = toArray(ceEl1.shadowRoot.querySelectorAll('span')).map((el) => getVisibleText(el, true));
            const errors2 = toArray(ceEl2.shadowRoot.querySelectorAll('span')).map((el) => getVisibleText(el, true));
            assert.deepStrictEqual(errors1, ['Name is required.']);
            assert.deepStrictEqual(errors2, ['Age is required.']);
        }, {
            template: `
        <validation-container>
          <input id="target1" type="text" value.two-way="person.name & validate">
        </validation-container>
        <validation-container>
          <input id="target2" type="text" value.two-way="person.age & validate">
        </validation-container>
      `
        });
        $it('sorts the errors according to the target position', async function ({ host, platform, app, ctx }) {
            const ceEl = host.querySelector('validation-container');
            const ceVm = CustomElement.for(ceEl).viewModel;
            const spy = createSpy(ceVm, 'handleValidationEvent', true);
            const controller = app.controller;
            assertSubscriber(controller, ceVm);
            const target1 = ceEl.querySelector('#target1');
            const target2 = ceEl.querySelector('#target2');
            const controllerSpy = app.controllerValidateSpy;
            await assertEventHandler(target1, platform, controllerSpy, spy, ctx);
            await assertEventHandler(target2, platform, controllerSpy, spy, ctx);
            const errors = toArray(ceEl.shadowRoot.querySelectorAll('span')).map((el) => getVisibleText(el, true));
            assert.deepStrictEqual(errors, ['Age is required.', 'Name is required.']);
        }, {
            template: `
      <validation-container>
        <input id="target2" type="text" value.two-way="person.age & validate">
        <input id="target1" type="text" value.two-way="person.name & validate">
      </validation-container>
      `
        });
        $it('lets injection of error template via Light DOM', async function ({ host, platform, app, ctx }) {
            const ceEl1 = host.querySelector('validation-container');
            const ceVm1 = CustomElement.for(ceEl1).viewModel;
            const controller = app.controller;
            assertSubscriber(controller, ceVm1);
            const input1 = ceEl1.querySelector('input#target1');
            const controllerSpy = app.controllerValidateSpy;
            const spy1 = createSpy(ceVm1, 'handleValidationEvent', true);
            await assertEventHandler(input1, platform, controllerSpy, spy1, ctx);
            assert.deepStrictEqual(toArray(ceEl1.shadowRoot.querySelectorAll('span')).map((el) => getVisibleText(el, true)), ['Name is required.']);
            assert.deepStrictEqual(toArray(ceEl1.querySelectorAll('small')).map((el) => getVisibleText(el, true)), ['Name is required.']);
        }, {
            template: `
        <validation-container errors.from-view="errors">
          <input id="target1" type="text" value.two-way="person.name & validate">
          <div slot="secondary">
            <small repeat.for="error of errors">
              \${error.result.message}
            </small>
          </div>
        </validation-container>
      `
        });
        $it('the template is customizable', async function ({ host, platform, app, ctx }) {
            const ceEl1 = host.querySelector('validation-container');
            const ceVm1 = CustomElement.for(ceEl1).viewModel;
            const controller = app.controller;
            assertSubscriber(controller, ceVm1);
            const input1 = ceEl1.querySelector('input#target1');
            const controllerSpy = app.controllerValidateSpy;
            const spy1 = createSpy(ceVm1, 'handleValidationEvent', true);
            await assertEventHandler(input1, platform, controllerSpy, spy1, ctx);
            if (typeof getComputedStyle === 'function') { // seems not to work with jsdom
                assert.equal(getComputedStyle(ceEl1).display, 'flex');
                const spans = toArray(ceEl1.shadowRoot.querySelectorAll('span.error'));
                assert.equal(spans.every((span) => getComputedStyle(span).color === 'rgb(255, 0, 0)'), true, 'incorrect color');
            }
        }, {
            template: `
        <validation-container>
          <input id="target1" type="text" value.two-way="person.name & validate">
        </validation-container>
        `,
            containerTemplate: `
        <style>
        :host {
          contain: content;
          display: flex;
          flex-direction: column;
        }
        :host .error {
          color: rgb(255, 0, 0);
        }
        </style>
        <slot></slot>
        <slot name='secondary'>
          <span class="error" repeat.for="error of errors">
            \${error.result.message}
          </span>
        </slot>
        `
        });
        it('can be used without any available registration for scoped controller', async function () {
            let App1 = class App1 {
                constructor(controller, validationRules) {
                    this.controller = controller;
                    this.validationRules = validationRules;
                    this.person = new Person((void 0), (void 0));
                    this.controllerValidateSpy = createSpy(controller, 'validate', true);
                    validationRules
                        .on(this.person)
                        .ensure('name')
                        .required();
                }
                unbinding() {
                    this.validationRules.off();
                }
            };
            App1 = __decorate([
                customElement({
                    name: 'app',
                    template: `
        <validation-container controller.bind="controller">
          <input id="target1" type="text" value.two-way="person.name & validate:undefined:controller">
        </validation-container>
      `
                }),
                __param(0, newInstanceOf(IValidationController)),
                __param(1, IValidationRules),
                __metadata("design:paramtypes", [ValidationController, Object])
            ], App1);
            const ctx = TestContext.create();
            const container = ctx.container;
            const host = ctx.doc.createElement('app');
            ctx.doc.body.appendChild(host);
            const au = new Aurelia(container).register(ValidationHtmlConfiguration);
            await au
                .app({ host, component: App1 })
                .start();
            const app = au.root.controller.viewModel;
            const platform = container.get(IPlatform);
            const ceEl1 = host.querySelector('validation-container');
            const ceVm1 = CustomElement.for(ceEl1).viewModel;
            const controller = app.controller;
            assertSubscriber(controller, ceVm1);
            const input1 = ceEl1.querySelector('input#target1');
            const controllerSpy = app.controllerValidateSpy;
            const spy1 = createSpy(ceVm1, 'handleValidationEvent', true);
            await assertEventHandler(input1, platform, controllerSpy, spy1, ctx);
            const errors1 = toArray(ceEl1.shadowRoot.querySelectorAll('span')).map((el) => getVisibleText(el, true));
            assert.deepStrictEqual(errors1, ['Name is required.']);
            await au.stop();
            ctx.doc.body.removeChild(host);
            au.dispose();
        });
    });
});
//# sourceMappingURL=validation-container-custom-element.spec.js.map