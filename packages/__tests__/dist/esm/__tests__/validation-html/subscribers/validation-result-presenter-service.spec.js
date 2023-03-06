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
import { Registration, toArray, newInstanceForScope, DI } from '@aurelia/kernel';
import { IPlatform, CustomElement, customElement, Aurelia } from '@aurelia/runtime-html';
import { PLATFORM, assert, TestContext, createSpy, getVisibleText } from '@aurelia/testing';
import { IValidationRules, } from '@aurelia/validation';
import { IValidationController, ValidationController, ValidationHtmlConfiguration, ValidationResultPresenterService, IValidationResultPresenterService as $IValidationResultPresenterService, } from '@aurelia/validation-html';
import { Person } from '../../validation/_test-resources.js';
import { ToNumberValueConverter, createSpecFunction } from '../../util.js';
describe('validation-html/subscribers/validation-result-presenter-service.spec.ts', function () {
    describe('validation-result-presenter-service', function () {
        const IValidationResultPresenterService = DI.createInterface('ValidationResultPresenterService');
        let App = class App {
            constructor(platform, controller, presenterService, validationRules) {
                this.platform = platform;
                this.controller = controller;
                this.presenterService = presenterService;
                this.validationRules = validationRules;
                this.person = new Person((void 0), (void 0));
                this.controllerValidateSpy = createSpy(controller, 'validate', true);
                controller.addSubscriber(presenterService);
                validationRules
                    .on(this.person)
                    .ensure('name')
                    .displayName('Name')
                    .required()
                    .ensure('age')
                    .displayName('Age')
                    .required()
                    .satisfies((age) => age % 3 === 0 && age % 5 === 0)
                    .withMessage('${$displayName} is not fizbaz');
            }
            unbinding() {
                this.validationRules.off();
                // mandatory cleanup in root
                this.controller.removeSubscriber(this.presenterService);
                this.controller.reset();
            }
            dispose() {
                const controller = this.controller;
                assert.equal(controller.results.length, 0, 'the result should have been removed');
                assert.equal(controller.bindings.size, 0, 'the bindings should have been removed');
                assert.equal(controller.objects.size, 0, 'the objects should have been removed');
                assert.equal(controller.subscribers.size, 0, 'the subscribers should have been removed');
            }
        };
        App = __decorate([
            __param(0, IPlatform),
            __param(1, newInstanceForScope(IValidationController)),
            __param(2, IValidationResultPresenterService),
            __param(3, IValidationRules),
            __metadata("design:paramtypes", [Object, ValidationController,
                ValidationResultPresenterService, Object])
        ], App);
        async function runTest(testFunction, { template, presenterService }) {
            const ctx = TestContext.create();
            const container = ctx.container;
            const host = ctx.createElement('app');
            ctx.doc.body.appendChild(host);
            const au = new Aurelia(container);
            await au
                .register(ValidationHtmlConfiguration, ToNumberValueConverter, CustomValidationContainer, Registration.cachedCallback(IValidationResultPresenterService, (x) => presenterService ?? x.get($IValidationResultPresenterService)))
                .app({
                host,
                component: CustomElement.define({ name: 'app', isStrictBinding: true, template }, App)
            })
                .start();
            const app = au.root.controller.viewModel;
            await testFunction({ app, host, container, platform: app.platform, ctx });
            await au.stop();
            ctx.doc.body.removeChild(host);
            au.dispose();
        }
        const $it = createSpecFunction(runTest);
        function getResult(args) { return args.flatMap((arg) => [arg.valid, arg.message]); }
        async function assertEventHandler(target, platform, controllerValidateSpy, handleValidationEventSpy, ctx, event = 'focusout') {
            handleValidationEventSpy.calls.splice(0);
            controllerValidateSpy.calls.splice(0);
            target.dispatchEvent(new ctx.Event(event));
            await platform.domReadQueue.yield();
            assert.equal(controllerValidateSpy.calls.length, 1, 'incorrect #calls for validate');
            assert.equal(handleValidationEventSpy.calls.length, 1, 'incorrect #calls for handleValidationEvent');
        }
        function assertSubscriber(controller, subscriber) {
            const subscribers = controller['subscribers'];
            assert.equal((subscribers).has(subscriber), true);
        }
        class CustomPresenterService extends ValidationResultPresenterService {
            getValidationMessageContainer(target) {
                return target.parentElement.shadowRoot.querySelector('small.validation-placeholder');
            }
            showResults(messageContainer, results) {
                messageContainer.append(...results.reduce((acc, result) => {
                    if (!result.valid) {
                        const text = PLATFORM.document.createTextNode(result.message);
                        Reflect.set(text, CustomPresenterService.markerProperty, result.id);
                        acc.push(text);
                    }
                    return acc;
                }, []));
            }
            removeResults(messageContainer, results) {
                const children = toArray(messageContainer.childNodes);
                for (const result of results) {
                    if (!result.valid) {
                        children.find((child) => Reflect.get(child, CustomPresenterService.markerProperty) === result.id)?.remove();
                    }
                }
            }
        }
        CustomPresenterService.markerProperty = 'validation-result-id';
        let CustomValidationContainer = class CustomValidationContainer {
        };
        CustomValidationContainer = __decorate([
            customElement({
                name: 'custom-validation-container',
                template: `<au-slot></au-slot><small class='validation-placeholder'></small>`,
                shadowOptions: { mode: 'open' }
            })
        ], CustomValidationContainer);
        $it('shows the errors for the associated validation targets', async function ({ host, platform, app, ctx }) {
            const div1 = host.querySelector('div');
            const div2 = host.querySelector('div:nth-of-type(2)');
            const nameError = 'Name is required.';
            const ageRequiredError = 'Age is required.';
            const ageFizbazError = 'Age is not fizbaz';
            const controller = app.controller;
            const presenterService = app.presenterService;
            assertSubscriber(controller, presenterService);
            assertSubscriber(controller, presenterService);
            const input1 = div1.querySelector('input#target1');
            const input2 = div2.querySelector('input#target2');
            const controllerSpy = app.controllerValidateSpy;
            const spy = createSpy(presenterService, 'handleValidationEvent', true);
            const addSpy = createSpy(presenterService, 'add', true);
            const removeSpy = createSpy(presenterService, 'remove', true);
            const showResultsSpy = createSpy(presenterService, 'showResults', true);
            const removeResultsSpy = createSpy(presenterService, 'removeResults', true);
            await assertEventHandler(input1, platform, controllerSpy, spy, ctx);
            await assertEventHandler(input2, platform, controllerSpy, spy, ctx);
            let addArgs = addSpy.calls;
            let removeArgs = removeSpy.calls;
            let showResultsArgs = showResultsSpy.calls;
            let removeResultsArgs = removeResultsSpy.calls;
            assert.equal(removeArgs.length, 0);
            assert.equal(addArgs.length, 2);
            assert.equal(removeResultsArgs.length, 0);
            assert.equal(showResultsArgs.length, 2);
            assert.deepStrictEqual([addArgs[0][0], ...getResult(addArgs[0][1])], [input1, false, nameError]);
            assert.deepStrictEqual([addArgs[1][0], ...getResult(addArgs[1][1])], [input2, false, ageRequiredError, false, ageFizbazError]);
            assert.deepStrictEqual([showResultsArgs[0][0].tagName, ...getResult(showResultsArgs[0][1])], ['DIV', false, nameError]);
            assert.deepStrictEqual([showResultsArgs[1][0].tagName, ...getResult(showResultsArgs[1][1])], ['DIV', false, ageRequiredError, false, ageFizbazError]);
            assert.deepStrictEqual(toArray(div1.querySelectorAll('span')).map((el) => getVisibleText(el, true)), [nameError]);
            assert.deepStrictEqual(toArray(div2.querySelectorAll('span')).map((el) => getVisibleText(el, true)), [ageRequiredError, ageFizbazError]);
            addSpy.reset();
            removeSpy.reset();
            showResultsSpy.reset();
            removeResultsSpy.reset();
            input2.value = '22';
            input2.dispatchEvent(new ctx.Event('change'));
            await platform.domReadQueue.yield();
            await assertEventHandler(input2, platform, controllerSpy, spy, ctx);
            addArgs = addSpy.calls;
            removeArgs = removeSpy.calls;
            showResultsArgs = showResultsSpy.calls;
            removeResultsArgs = removeResultsSpy.calls;
            assert.equal(removeArgs.length, 1);
            assert.equal(addArgs.length, 1);
            assert.equal(removeResultsArgs.length, 1);
            assert.equal(showResultsArgs.length, 1);
            assert.deepStrictEqual([removeArgs[0][0], ...getResult(removeArgs[0][1])], [input2, false, ageRequiredError, false, ageFizbazError]);
            assert.deepStrictEqual([addArgs[0][0], ...getResult(addArgs[0][1])], [input2, true, undefined, false, ageFizbazError]);
            assert.deepStrictEqual([removeResultsArgs[0][0].tagName, ...getResult(removeResultsArgs[0][1])], ['DIV', false, ageRequiredError, false, ageFizbazError]);
            assert.deepStrictEqual([showResultsArgs[0][0].tagName, ...getResult(showResultsArgs[0][1])], ['DIV', true, undefined, false, ageFizbazError]);
            assert.deepStrictEqual(toArray(div1.querySelectorAll('span')).map((el) => getVisibleText(el, true)), [nameError]);
            assert.deepStrictEqual(toArray(div2.querySelectorAll('span')).map((el) => getVisibleText(el, true)), [ageFizbazError]);
            addSpy.reset();
            removeSpy.reset();
            showResultsSpy.reset();
            removeResultsSpy.reset();
            input2.value = '15';
            input2.dispatchEvent(new ctx.Event('change'));
            await platform.domReadQueue.yield();
            await assertEventHandler(input2, platform, controllerSpy, spy, ctx);
            addArgs = addSpy.calls;
            removeArgs = removeSpy.calls;
            showResultsArgs = showResultsSpy.calls;
            removeResultsArgs = removeResultsSpy.calls;
            assert.equal(removeArgs.length, 1);
            assert.equal(addArgs.length, 1);
            assert.equal(removeResultsArgs.length, 1);
            assert.equal(showResultsArgs.length, 1);
            assert.deepStrictEqual([removeArgs[0][0], ...getResult(removeArgs[0][1])], [input2, true, undefined, false, ageFizbazError]);
            assert.deepStrictEqual([addArgs[0][0], ...getResult(addArgs[0][1])], [input2, true, undefined, true, undefined]);
            assert.deepStrictEqual([removeResultsArgs[0][0].tagName, ...getResult(removeResultsArgs[0][1])], ['DIV', true, undefined, false, ageFizbazError]);
            assert.deepStrictEqual([showResultsArgs[0][0].tagName, ...getResult(showResultsArgs[0][1])], ['DIV', true, undefined, true, undefined]);
            assert.deepStrictEqual(toArray(div1.querySelectorAll('span')).map((el) => getVisibleText(el, true)), [nameError]);
            assert.deepStrictEqual(toArray(div2.querySelectorAll('span')).map((el) => getVisibleText(el, true)), []);
        }, {
            template: `
        <div>
          <input id="target1" type="text" value.two-way="person.name & validate">
        </div>
        <div>
          <input id="target2" type="text" value.two-way="person.age|toNumber & validate">
        </div>
      `
        });
        $it('custom presenter implementation can be used to tweak presentation', async function ({ host, platform, app, ctx }) {
            const validationContainer1 = host.querySelector('custom-validation-container');
            const validationContainer2 = host.querySelector('custom-validation-container:nth-of-type(2)');
            const nameError = 'Name is required.';
            const ageRequiredError = 'Age is required.';
            const ageFizbazError = 'Age is not fizbaz';
            const controller = app.controller;
            const presenterService = app.presenterService;
            assert.instanceOf(presenterService, CustomPresenterService);
            assertSubscriber(controller, presenterService);
            assertSubscriber(controller, presenterService);
            const input1 = validationContainer1.querySelector('input#target1');
            const input2 = validationContainer2.querySelector('input#target2');
            const controllerSpy = app.controllerValidateSpy;
            const spy = createSpy(presenterService, 'handleValidationEvent', true);
            const addSpy = createSpy(presenterService, 'add', true);
            const removeSpy = createSpy(presenterService, 'remove', true);
            const showResultsSpy = createSpy(presenterService, 'showResults', true);
            const removeResultsSpy = createSpy(presenterService, 'removeResults', true);
            await assertEventHandler(input1, platform, controllerSpy, spy, ctx);
            await assertEventHandler(input2, platform, controllerSpy, spy, ctx);
            let addArgs = addSpy.calls;
            let removeArgs = removeSpy.calls;
            let showResultsArgs = showResultsSpy.calls;
            let removeResultsArgs = removeResultsSpy.calls;
            assert.equal(removeArgs.length, 0);
            assert.equal(addArgs.length, 2);
            assert.equal(removeResultsArgs.length, 0);
            assert.equal(showResultsArgs.length, 2);
            assert.deepStrictEqual([addArgs[0][0], ...getResult(addArgs[0][1])], [input1, false, nameError]);
            assert.deepStrictEqual([addArgs[1][0], ...getResult(addArgs[1][1])], [input2, false, ageRequiredError, false, ageFizbazError]);
            assert.deepStrictEqual([showResultsArgs[0][0].tagName, ...getResult(showResultsArgs[0][1])], ['SMALL', false, nameError]);
            assert.deepStrictEqual([showResultsArgs[1][0].tagName, ...getResult(showResultsArgs[1][1])], ['SMALL', false, ageRequiredError, false, ageFizbazError]);
            assert.equal(getVisibleText(validationContainer1.shadowRoot.querySelector('small'), true), nameError);
            assert.equal(getVisibleText(validationContainer2.shadowRoot.querySelector('small'), true), `${ageRequiredError}${ageFizbazError}`);
            addSpy.reset();
            removeSpy.reset();
            showResultsSpy.reset();
            removeResultsSpy.reset();
            input2.value = '22';
            input2.dispatchEvent(new ctx.Event('change'));
            await platform.domReadQueue.yield();
            await assertEventHandler(input2, platform, controllerSpy, spy, ctx);
            addArgs = addSpy.calls;
            removeArgs = removeSpy.calls;
            showResultsArgs = showResultsSpy.calls;
            removeResultsArgs = removeResultsSpy.calls;
            assert.equal(removeArgs.length, 1);
            assert.equal(addArgs.length, 1);
            assert.equal(removeResultsArgs.length, 1);
            assert.equal(showResultsArgs.length, 1);
            assert.deepStrictEqual([removeArgs[0][0], ...getResult(removeArgs[0][1])], [input2, false, ageRequiredError, false, ageFizbazError]);
            assert.deepStrictEqual([addArgs[0][0], ...getResult(addArgs[0][1])], [input2, true, undefined, false, ageFizbazError]);
            assert.deepStrictEqual([removeResultsArgs[0][0].tagName, ...getResult(removeResultsArgs[0][1])], ['SMALL', false, ageRequiredError, false, ageFizbazError]);
            assert.deepStrictEqual([showResultsArgs[0][0].tagName, ...getResult(showResultsArgs[0][1])], ['SMALL', true, undefined, false, ageFizbazError]);
            assert.equal(getVisibleText(validationContainer1.shadowRoot.querySelector('small'), true), nameError);
            assert.equal(getVisibleText(validationContainer2.shadowRoot.querySelector('small'), true), ageFizbazError);
            addSpy.reset();
            removeSpy.reset();
            showResultsSpy.reset();
            removeResultsSpy.reset();
            input2.value = '15';
            input2.dispatchEvent(new ctx.Event('change'));
            await platform.domReadQueue.yield();
            await assertEventHandler(input2, platform, controllerSpy, spy, ctx);
            addArgs = addSpy.calls;
            removeArgs = removeSpy.calls;
            showResultsArgs = showResultsSpy.calls;
            removeResultsArgs = removeResultsSpy.calls;
            assert.equal(removeArgs.length, 1);
            assert.equal(addArgs.length, 1);
            assert.equal(removeResultsArgs.length, 1);
            assert.equal(showResultsArgs.length, 1);
            assert.deepStrictEqual([removeArgs[0][0], ...getResult(removeArgs[0][1])], [input2, true, undefined, false, ageFizbazError]);
            assert.deepStrictEqual([addArgs[0][0], ...getResult(addArgs[0][1])], [input2, true, undefined, true, undefined]);
            assert.deepStrictEqual([removeResultsArgs[0][0].tagName, ...getResult(removeResultsArgs[0][1])], ['SMALL', true, undefined, false, ageFizbazError]);
            assert.deepStrictEqual([showResultsArgs[0][0].tagName, ...getResult(showResultsArgs[0][1])], ['SMALL', true, undefined, true, undefined]);
            assert.equal(getVisibleText(validationContainer1.shadowRoot.querySelector('small'), true), nameError);
            assert.equal(getVisibleText(validationContainer2.shadowRoot.querySelector('small'), true), '');
        }, {
            presenterService: new CustomPresenterService(PLATFORM),
            template: `
        <custom-validation-container>
          <input id="target1" type="text" value.two-way="person.name & validate">
        </custom-validation-container>
        <custom-validation-container>
          <input id="target2" type="text" value.two-way="person.age|toNumber & validate">
        </custom-validation-container>
      `
        });
        $it('does not add/remove results if the container returned is null', async function ({ host, platform, app, ctx }) {
            const validationContainer1 = host.querySelector('div');
            const validationContainer2 = host.querySelector('div:nth-of-type(2)');
            const controller = app.controller;
            const presenterService = app.presenterService;
            assertSubscriber(controller, presenterService);
            assertSubscriber(controller, presenterService);
            const input1 = validationContainer1.querySelector('input#target1');
            const input2 = validationContainer2.querySelector('input#target2');
            const controllerSpy = app.controllerValidateSpy;
            const spy = createSpy(presenterService, 'handleValidationEvent', true);
            const addSpy = createSpy(presenterService, 'add', true);
            const removeSpy = createSpy(presenterService, 'remove', true);
            const showResultsSpy = createSpy(presenterService, 'showResults', true);
            const removeResultsSpy = createSpy(presenterService, 'removeResults', true);
            await assertEventHandler(input1, platform, controllerSpy, spy, ctx);
            await assertEventHandler(input2, platform, controllerSpy, spy, ctx);
            let addArgs = addSpy.calls;
            let removeArgs = removeSpy.calls;
            let showResultsArgs = showResultsSpy.calls;
            let removeResultsArgs = removeResultsSpy.calls;
            assert.equal(removeArgs.length, 0);
            assert.equal(addArgs.length, 2);
            assert.equal(removeResultsArgs.length, 0);
            assert.equal(showResultsArgs.length, 0);
            addSpy.reset();
            removeSpy.reset();
            showResultsSpy.reset();
            removeResultsSpy.reset();
            input2.value = '22';
            input2.dispatchEvent(new ctx.Event('change'));
            await platform.domReadQueue.yield();
            await assertEventHandler(input2, platform, controllerSpy, spy, ctx);
            addArgs = addSpy.calls;
            removeArgs = removeSpy.calls;
            showResultsArgs = showResultsSpy.calls;
            removeResultsArgs = removeResultsSpy.calls;
            assert.equal(removeArgs.length, 1);
            assert.equal(addArgs.length, 1);
            assert.equal(removeResultsArgs.length, 0);
            assert.equal(showResultsArgs.length, 0);
        }, {
            presenterService: new (class extends ValidationResultPresenterService {
                getValidationMessageContainer() { return null; }
            })(PLATFORM),
            template: `
        <div>
          <input id="target1" type="text" value.two-way="person.name & validate">
        </div>
        <div>
          <input id="target2" type="text" value.two-way="person.age|toNumber & validate">
        </div>
      `
        });
    });
});
//# sourceMappingURL=validation-result-presenter-service.spec.js.map