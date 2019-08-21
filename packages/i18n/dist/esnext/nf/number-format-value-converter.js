import * as tslib_1 from "tslib";
import { valueConverter } from '@aurelia/runtime';
import { I18N } from '../i18n';
let NumberFormatValueConverter = class NumberFormatValueConverter {
    constructor(i18n) {
        this.i18n = i18n;
        this.signals = ["aurelia-translation-signal" /* I18N_SIGNAL */];
    }
    toView(value, options, locale) {
        if (typeof value !== 'number') {
            return value;
        }
        return this.i18n.nf(value, options, locale);
    }
};
NumberFormatValueConverter = tslib_1.__decorate([
    valueConverter("nf" /* numberFormatValueConverterName */),
    tslib_1.__param(0, I18N)
], NumberFormatValueConverter);
export { NumberFormatValueConverter };
//# sourceMappingURL=number-format-value-converter.js.map