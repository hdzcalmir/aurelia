var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { bindable, CustomElement, cssModules } from '@aurelia/runtime-html';
import * as css from './cards.css';
import template from './cards.html';
/**
 * Potential coverage target
 * - `runtime-html`
 *    - `css-modules-registry`
 *    - `class-attribute-accessor`
 *    - `style-attribute-accessor`
 *    - `data-attribute-accessor`
 */
export class Cards {
    constructor() {
        this.styleStr = "background-color: rgb(255, 0, 0); font-weight: 700 !important";
        this.styleObj = { 'background-color': 'rgb(255, 0, 0)', 'font-weight': '700 !important' };
        this.styleArray = [{ 'background-color': 'rgb(255, 0, 0)' }, { 'font-weight': '700 !important' }];
    }
    static customize(useCSSModule) {
        /**
         * Note that this is done only for testing.
         * Normally, this goes like this: `@customElement({ name: 'cards', template, dependencies: [styles(css)] })`.
         */
        const defn = { name: 'cards', template, dependencies: useCSSModule ? [cssModules(css)] : undefined };
        return CustomElement.define(defn, Cards);
    }
    select(card) {
        this.selected = card;
    }
}
__decorate([
    bindable,
    __metadata("design:type", Array)
], Cards.prototype, "items", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], Cards.prototype, "selected", void 0);
//# sourceMappingURL=cards.js.map