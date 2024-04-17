import { type ValueConverterInstance, type ValueConverterStaticAuDefinition } from '@aurelia/runtime-html';
export declare class NumberFormatValueConverter implements ValueConverterInstance {
    static readonly $au: ValueConverterStaticAuDefinition;
    readonly signals: string[];
    private readonly i18n;
    toView(value: unknown, options?: Intl.NumberFormatOptions, locale?: string): unknown;
}
//# sourceMappingURL=number-format-value-converter.d.ts.map