import { IContainer, Registration, LoggerConfiguration, ConsoleSink } from '@aurelia/kernel';
import { MockBrowserHistoryLocation } from '@aurelia/testing';
import { AppTask, IHistory, ILocation, IWindow } from '@aurelia/runtime-html';
import { IRouterOptions } from '@aurelia/router-lite';
export const TestRouterConfiguration = {
    for(logLevel = 3 /* LogLevel.warn */, sinks = [ConsoleSink]) {
        return {
            register(container) {
                container.register(LoggerConfiguration.create({
                    level: logLevel,
                    colorOptions: 0 /* ColorOptions.noColors */,
                    sinks,
                }));
                const mockBrowserHistoryLocation = new MockBrowserHistoryLocation();
                container.register(Registration.instance(IHistory, mockBrowserHistoryLocation), Registration.instance(ILocation, mockBrowserHistoryLocation));
            },
        };
    },
};
export function getLocationChangeHandlerRegistration() {
    return AppTask.hydrated(IContainer, container => {
        const useHash = container.get(IRouterOptions).useUrlFragmentHash;
        const window = container.get(IWindow);
        const mockBrowserHistoryLocation = container.get(IHistory);
        mockBrowserHistoryLocation.changeCallback = () => {
            window.dispatchEvent(useHash ? new HashChangeEvent('hashchange') : new PopStateEvent('popstate'));
            return Promise.resolve();
        };
    });
}
//# sourceMappingURL=configuration.js.map