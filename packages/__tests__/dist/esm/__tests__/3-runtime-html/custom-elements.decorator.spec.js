var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { capture, customElement, CustomElement, CustomElementDefinition } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
describe('3-runtime-html/custom-elements.decorator.spec.ts', function () {
    describe('@capture', function () {
        it('retrieves capture on class annonated', function () {
            let El = class El {
            };
            El = __decorate([
                capture()
            ], El);
            const { capture: $capture } = CustomElementDefinition.create('el', El);
            assert.deepStrictEqual($capture, true);
        });
        it('retries capture on class annotated with filter function', function () {
            const filter = attr => true;
            let El = class El {
            };
            El = __decorate([
                capture(filter)
            ], El);
            const { capture: $capture } = CustomElementDefinition.create('el', El);
            assert.deepStrictEqual($capture, filter);
        });
        it('setups the right value when decorated before @customElement', function () {
            let El = class El {
            };
            El = __decorate([
                capture(),
                customElement({ name: 'el' })
            ], El);
            const { capture: $capture } = CustomElement.getDefinition(El);
            assert.deepStrictEqual($capture, true);
        });
        it('setups the right value when decorated after @customElement', function () {
            let El = class El {
            };
            El = __decorate([
                customElement({ name: 'el' }),
                capture()
            ], El);
            const { capture: $capture } = CustomElement.getDefinition(El);
            assert.deepStrictEqual($capture, true);
        });
    });
});
//# sourceMappingURL=custom-elements.decorator.spec.js.map