var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { attributePattern, AttrSyntax } from '@aurelia/runtime-html';
/**
 * Attribute syntax pattern recognizer, helping Aurelia understand template:
 * ```html
 * <div attr.some-attr="someAttrValue"></div>
 * <div some-attr.attr="someAttrValue"></div>
 * ````
 */
let AttrAttributePattern = class AttrAttributePattern {
    'attr.PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[1], 'attr');
    }
    'PART.attr'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'attr');
    }
};
AttrAttributePattern = __decorate([
    attributePattern({ pattern: 'attr.PART', symbols: '.' }, { pattern: 'PART.attr', symbols: '.' })
], AttrAttributePattern);
export { AttrAttributePattern };
/**
 * Style syntax pattern recognizer, helps Aurelia understand template:
 * ```html
 * <div background.style="bg"></div>
 * <div style.background="bg"></div>
 * <div background-color.style="bg"></div>
 * <div style.background-color="bg"></div>
 * <div -webkit-user-select.style="select"></div>
 * <div style.-webkit-user-select="select"></div>
 * <div --custom-prop-css.style="cssProp"></div>
 * <div style.--custom-prop-css="cssProp"></div>
 * ```
 */
let StyleAttributePattern = class StyleAttributePattern {
    'style.PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[1], 'style');
    }
    'PART.style'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'style');
    }
};
StyleAttributePattern = __decorate([
    attributePattern({ pattern: 'style.PART', symbols: '.' }, { pattern: 'PART.style', symbols: '.' })
], StyleAttributePattern);
export { StyleAttributePattern };
/**
 * Class syntax pattern recognizer, helps Aurelia understand template:
 * ```html
 * <div my-class.class="class"></div>
 * <div class.my-class="class"></div>
 * <div ✔.class="checked"></div>
 * <div class.✔="checked"></div>
 * ```
 */
let ClassAttributePattern = class ClassAttributePattern {
    'class.PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[1], 'class');
    }
    'PART.class'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'class');
    }
};
ClassAttributePattern = __decorate([
    attributePattern({ pattern: 'class.PART', symbols: '.' }, { pattern: 'PART.class', symbols: '.' })
], ClassAttributePattern);
export { ClassAttributePattern };
//# sourceMappingURL=attribute-pattern.js.map