import { Registration, LoggerConfiguration, ConsoleSink } from '@aurelia/kernel';
import { MockBrowserHistoryLocation } from '@aurelia/testing';
import { IRouter } from '@aurelia/router';
import { AppTask, IHistory, ILocation } from '@aurelia/runtime-html';
export const TestRouterConfiguration = {
    for(ctx, logLevel = 1 /* LogLevel.debug */) {
        return {
            register(container) {
                container.register(LoggerConfiguration.create({
                    level: logLevel,
                    colorOptions: 0 /* ColorOptions.noColors */,
                    sinks: [ConsoleSink],
                }));
                const mockBrowserHistoryLocation = new MockBrowserHistoryLocation();
                container.register(Registration.instance(IHistory, mockBrowserHistoryLocation), Registration.instance(ILocation, mockBrowserHistoryLocation), AppTask.hydrating(IRouter, router => {
                    mockBrowserHistoryLocation.changeCallback = async (ev) => { router.viewer.handlePopStateEvent(ev); };
                }));
            },
        };
    },
};
//# sourceMappingURL=configuration.js.map