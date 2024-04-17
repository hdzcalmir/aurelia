import { I18nInitOptions, II18nextWrapper } from '@aurelia/i18n';
import { IContainer, IEventAggregator } from '@aurelia/kernel';
export interface I18nConfiguration {
    ea: IEventAggregator;
    initOptions: I18nInitOptions;
    i18nextWrapper: II18nextWrapper;
}
export declare function createI18NContainer({ ea, initOptions, i18nextWrapper, }?: Partial<I18nConfiguration>): IContainer;
//# sourceMappingURL=util.d.ts.map