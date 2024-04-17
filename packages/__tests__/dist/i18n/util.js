import { I18nConfiguration } from '@aurelia/i18n';
import { DI, EventAggregator, IEventAggregator, Registration } from '@aurelia/kernel';
import { ISignaler } from '@aurelia/runtime-html';
import { MockSignaler } from '@aurelia/testing';
export function createI18NContainer({ ea = new EventAggregator(), initOptions, i18nextWrapper, } = {}) {
    const container = DI.createContainer();
    container.register(Registration.singleton(ISignaler, MockSignaler), Registration.instance(IEventAggregator, ea), I18nConfiguration.customize((x) => {
        x.initOptions = initOptions ?? x.initOptions;
        x.i18nextWrapper = i18nextWrapper;
    }));
    return container;
}
//# sourceMappingURL=util.js.map