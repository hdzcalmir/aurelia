import { type ValueConverterInstance } from '@aurelia/runtime-html';
import type * as i18next from 'i18next';
export declare class TranslationValueConverter implements ValueConverterInstance {
    readonly signals: string[];
    private readonly i18n;
    toView(value: string, options?: i18next.TOptions): string;
}
//# sourceMappingURL=translation-value-converter.d.ts.map