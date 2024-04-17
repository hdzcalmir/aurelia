import { type ValueConverterStaticAuDefinition, type ValueConverterInstance } from '@aurelia/runtime-html';
export declare class RelativeTimeValueConverter implements ValueConverterInstance {
    static readonly $au: ValueConverterStaticAuDefinition;
    readonly signals: string[];
    private readonly i18n;
    toView(value: unknown, options?: Intl.RelativeTimeFormatOptions, locale?: string): unknown;
}
//# sourceMappingURL=relative-time-value-converter.d.ts.map