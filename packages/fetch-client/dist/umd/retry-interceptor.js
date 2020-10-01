(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@aurelia/runtime-html"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RetryInterceptor = exports.retryStrategy = void 0;
    const runtime_html_1 = require("@aurelia/runtime-html");
    exports.retryStrategy = {
        fixed: 0,
        incremental: 1,
        exponential: 2,
        random: 3
    };
    const defaultRetryConfig = {
        maxRetries: 3,
        interval: 1000,
        strategy: exports.retryStrategy.fixed
    };
    /**
     * Interceptor that retries requests on error, based on a given RetryConfiguration.
     */
    class RetryInterceptor {
        /**
         * Creates an instance of RetryInterceptor.
         */
        constructor(retryConfig) {
            this.retryConfig = { ...defaultRetryConfig, ...(retryConfig !== undefined ? retryConfig : {}) };
            if (this.retryConfig.strategy === exports.retryStrategy.exponential &&
                this.retryConfig.interval <= 1000) {
                throw new Error('An interval less than or equal to 1 second is not allowed when using the exponential retry strategy');
            }
        }
        /**
         * Called with the request before it is sent. It remembers the request so it can be retried on error.
         *
         * @param request - The request to be sent.
         * @returns The existing request, a new request or a response; or a Promise for any of these.
         */
        request(request) {
            if (!request.retryConfig) {
                request.retryConfig = { ...this.retryConfig };
                request.retryConfig.counter = 0;
            }
            // do this on every request
            request.retryConfig.requestClone = request.clone();
            return request;
        }
        /**
         * Called with the response after it is received. Clears the remembered request, as it was succesfull.
         *
         * @param response - The response.
         * @returns The response; or a Promise for one.
         */
        response(response, request) {
            // retry was successful, so clean up after ourselves
            Reflect.deleteProperty(request, 'retryConfig');
            return response;
        }
        /**
         * Handles fetch errors and errors generated by previous interceptors. This
         * function acts as a Promise rejection handler. It wil retry the remembered request based on the
         * configured RetryConfiguration.
         *
         * @param error - The rejection value from the fetch request or from a
         * previous interceptor.
         * @returns The response of the retry; or a Promise for one.
         */
        responseError(error, request, httpClient) {
            const { retryConfig } = request;
            const { requestClone } = retryConfig;
            return Promise.resolve().then(() => {
                if (retryConfig.counter < retryConfig.maxRetries) {
                    const result = retryConfig.doRetry !== undefined ? retryConfig.doRetry(error, request) : true;
                    return Promise.resolve(result).then(doRetry => {
                        if (doRetry) {
                            retryConfig.counter++;
                            const delay = calculateDelay(retryConfig);
                            return new Promise((resolve) => runtime_html_1.DOM.window.setTimeout(resolve, !isNaN(delay) ? delay : 0))
                                .then(() => {
                                const newRequest = requestClone.clone();
                                if (typeof (retryConfig.beforeRetry) === 'function') {
                                    return retryConfig.beforeRetry(newRequest, httpClient);
                                }
                                return newRequest;
                            })
                                .then(newRequest => {
                                const retryableRequest = { ...newRequest, retryConfig };
                                return httpClient.fetch(retryableRequest);
                            });
                        }
                        // no more retries, so clean up
                        Reflect.deleteProperty(request, 'retryConfig');
                        throw error;
                    });
                }
                // no more retries, so clean up
                Reflect.deleteProperty(request, 'retryConfig');
                throw error;
            });
        }
    }
    exports.RetryInterceptor = RetryInterceptor;
    function calculateDelay(retryConfig) {
        const { interval, strategy, minRandomInterval, maxRandomInterval, counter } = retryConfig;
        if (typeof (strategy) === 'function') {
            return retryConfig.strategy(counter);
        }
        switch (strategy) {
            case (exports.retryStrategy.fixed):
                return retryStrategies[exports.retryStrategy.fixed](interval);
            case (exports.retryStrategy.incremental):
                return retryStrategies[exports.retryStrategy.incremental](counter, interval);
            case (exports.retryStrategy.exponential):
                return retryStrategies[exports.retryStrategy.exponential](counter, interval);
            case (exports.retryStrategy.random):
                return retryStrategies[exports.retryStrategy.random](counter, interval, minRandomInterval, maxRandomInterval);
            default:
                throw new Error('Unrecognized retry strategy');
        }
    }
    const retryStrategies = [
        // fixed
        interval => interval,
        // incremental
        (retryCount, interval) => interval * retryCount,
        // exponential
        (retryCount, interval) => retryCount === 1 ? interval : interval ** retryCount / 1000,
        // random
        (retryCount, interval, minRandomInterval = 0, maxRandomInterval = 60000) => {
            return Math.random() * (maxRandomInterval - minRandomInterval) + minRandomInterval;
        }
    ];
});
//# sourceMappingURL=retry-interceptor.js.map