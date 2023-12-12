import { Registration, LoggerConfiguration } from '@aurelia/kernel';
import { MockBrowserHistoryLocation } from '@aurelia/testing';
import { IRouter } from '@aurelia/router';
import { AppTask, IHistory, ILocation } from '@aurelia/runtime-html';
export const TestRouterConfiguration = {
    for(ctx, logLevel = 1 /* LogLevel.debug */) {
        return {
            register(container) {
                container.register(LoggerConfiguration.create({ $console: console, level: logLevel }));
                const mockBrowserHistoryLocation = new MockBrowserHistoryLocation();
                container.register(Registration.instance(IHistory, mockBrowserHistoryLocation), Registration.instance(ILocation, mockBrowserHistoryLocation), AppTask.hydrating(IRouter, router => {
                    mockBrowserHistoryLocation.changeCallback = async (ev) => { router.viewer.handlePopStateEvent(ev); };
                }));
            },
        };
    },
};
function getModifiedRouter(container) {
    const router = container.get(IRouter);
    const mockBrowserHistoryLocation = new MockBrowserHistoryLocation();
    mockBrowserHistoryLocation.changeCallback = router.viewer.handlePopstate;
    router.viewer.history = mockBrowserHistoryLocation;
    router.viewer.location = mockBrowserHistoryLocation;
    return router;
}
//# sourceMappingURL=configuration.js.map