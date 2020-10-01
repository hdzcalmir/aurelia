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
import { attributePattern, AttrSyntax, bindingCommand, getTarget } from '@aurelia/jit';
import { BindingMode, IExpressionParser, instructionRenderer, IObserverLocator } from '@aurelia/runtime';
import { TranslationBinding } from './translation-binding';
export const TranslationParametersInstructionType = 'tpt';
// `.bind` part is needed here only for vCurrent compliance
const attribute = 't-params.bind';
let TranslationParametersAttributePattern = /** @class */ (() => {
    let TranslationParametersAttributePattern = class TranslationParametersAttributePattern {
        [attribute](rawName, rawValue, parts) {
            return new AttrSyntax(rawName, rawValue, '', attribute);
        }
    };
    TranslationParametersAttributePattern = __decorate([
        attributePattern({ pattern: attribute, symbols: '' })
    ], TranslationParametersAttributePattern);
    return TranslationParametersAttributePattern;
})();
export { TranslationParametersAttributePattern };
export class TranslationParametersBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = TranslationParametersInstructionType;
        this.mode = BindingMode.toView;
    }
}
let TranslationParametersBindingCommand = /** @class */ (() => {
    let TranslationParametersBindingCommand = class TranslationParametersBindingCommand {
        constructor() {
            this.bindingType = 53 /* BindCommand */;
        }
        compile(binding) {
            return new TranslationParametersBindingInstruction(binding.expression, getTarget(binding, false));
        }
    };
    TranslationParametersBindingCommand = __decorate([
        bindingCommand(attribute)
    ], TranslationParametersBindingCommand);
    return TranslationParametersBindingCommand;
})();
export { TranslationParametersBindingCommand };
let TranslationParametersBindingRenderer = /** @class */ (() => {
    let TranslationParametersBindingRenderer = class TranslationParametersBindingRenderer {
        constructor(parser, observerLocator) {
            this.parser = parser;
            this.observerLocator = observerLocator;
        }
        render(flags, context, controller, target, instruction) {
            TranslationBinding.create({ parser: this.parser, observerLocator: this.observerLocator, context, controller: controller, target, instruction, isParameterContext: true });
        }
    };
    TranslationParametersBindingRenderer = __decorate([
        instructionRenderer(TranslationParametersInstructionType),
        __param(0, IExpressionParser),
        __param(1, IObserverLocator),
        __metadata("design:paramtypes", [Object, Object])
    ], TranslationParametersBindingRenderer);
    return TranslationParametersBindingRenderer;
})();
export { TranslationParametersBindingRenderer };
//# sourceMappingURL=translation-parameters-renderer.js.map