import { type ValueConverterInstance, type ValueConverterStaticAuDefinition } from '@aurelia/runtime-html';
export declare class DateFormatValueConverter implements ValueConverterInstance {
    static readonly $au: ValueConverterStaticAuDefinition;
    readonly signals: string[];
    private readonly i18n;
    toView(value: string | number | Date, options?: Intl.DateTimeFormatOptions, locale?: string): string | number;
}
//# sourceMappingURL=date-format-value-converter.d.ts.map