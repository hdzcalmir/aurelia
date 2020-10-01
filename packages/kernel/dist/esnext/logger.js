var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { all, DI, ignore, optional, Registration } from './di';
import { toLookup } from './functions';
import { Protocol } from './resource';
import { Metadata } from '@aurelia/metadata';
/**
 * Flags to enable/disable color usage in the logging output.
 */
export var ColorOptions;
(function (ColorOptions) {
    /**
     * Do not use ASCII color codes in logging output.
     */
    ColorOptions[ColorOptions["noColors"] = 0] = "noColors";
    /**
     * Use ASCII color codes in logging output. By default, timestamps and the TRC and DBG prefix are colored grey. INF white, WRN yellow, and ERR and FTL red.
     */
    ColorOptions[ColorOptions["colors"] = 1] = "colors";
})(ColorOptions || (ColorOptions = {}));
export const ILogConfig = DI.createInterface('ILogConfig').withDefault(x => x.instance(new LogConfig(0 /* noColors */, 3 /* warn */)));
export const ISink = DI.createInterface('ISink').noDefault();
export const ILogEventFactory = DI.createInterface('ILogEventFactory').withDefault(x => x.singleton(DefaultLogEventFactory));
export const ILogger = DI.createInterface('ILogger').withDefault(x => x.singleton(DefaultLogger));
export const ILogScopes = DI.createInterface('ILogScope').noDefault();
export const LoggerSink = Object.freeze({
    key: Protocol.annotation.keyFor('logger-sink-handles'),
    define(target, definition) {
        Metadata.define(this.key, definition.handles, target.prototype);
        return target;
    },
    getHandles(target) {
        return Metadata.get(this.key, target);
    },
});
export function sink(definition) {
    return function (target) {
        return LoggerSink.define(target, definition);
    };
}
// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
export const format = toLookup({
    red(str) {
        return `\u001b[31m${str}\u001b[39m`;
    },
    green(str) {
        return `\u001b[32m${str}\u001b[39m`;
    },
    yellow(str) {
        return `\u001b[33m${str}\u001b[39m`;
    },
    blue(str) {
        return `\u001b[34m${str}\u001b[39m`;
    },
    magenta(str) {
        return `\u001b[35m${str}\u001b[39m`;
    },
    cyan(str) {
        return `\u001b[36m${str}\u001b[39m`;
    },
    white(str) {
        return `\u001b[37m${str}\u001b[39m`;
    },
    grey(str) {
        return `\u001b[90m${str}\u001b[39m`;
    },
});
export class LogConfig {
    constructor(colorOptions, level) {
        this.colorOptions = colorOptions;
        this.level = level;
    }
}
const getLogLevelString = (function () {
    const logLevelString = [
        toLookup({
            TRC: 'TRC',
            DBG: 'DBG',
            INF: 'INF',
            WRN: 'WRN',
            ERR: 'ERR',
            FTL: 'FTL',
            QQQ: '???',
        }),
        toLookup({
            TRC: format.grey('TRC'),
            DBG: format.grey('DBG'),
            INF: format.white('INF'),
            WRN: format.yellow('WRN'),
            ERR: format.red('ERR'),
            FTL: format.red('FTL'),
            QQQ: format.grey('???'),
        }),
    ];
    return function (level, colorOptions) {
        if (level <= 0 /* trace */) {
            return logLevelString[colorOptions].TRC;
        }
        if (level <= 1 /* debug */) {
            return logLevelString[colorOptions].DBG;
        }
        if (level <= 2 /* info */) {
            return logLevelString[colorOptions].INF;
        }
        if (level <= 3 /* warn */) {
            return logLevelString[colorOptions].WRN;
        }
        if (level <= 4 /* error */) {
            return logLevelString[colorOptions].ERR;
        }
        if (level <= 5 /* fatal */) {
            return logLevelString[colorOptions].FTL;
        }
        return logLevelString[colorOptions].QQQ;
    };
})();
function getScopeString(scope, colorOptions) {
    if (colorOptions === 0 /* noColors */) {
        return scope.join('.');
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return scope.map(format.cyan).join('.');
}
function getIsoString(timestamp, colorOptions) {
    if (colorOptions === 0 /* noColors */) {
        return new Date(timestamp).toISOString();
    }
    return format.grey(new Date(timestamp).toISOString());
}
export class DefaultLogEvent {
    constructor(severity, message, optionalParams, scope, colorOptions, timestamp) {
        this.severity = severity;
        this.message = message;
        this.optionalParams = optionalParams;
        this.scope = scope;
        this.colorOptions = colorOptions;
        this.timestamp = timestamp;
    }
    toString() {
        const { severity, message, scope, colorOptions, timestamp } = this;
        if (scope.length === 0) {
            return `${getIsoString(timestamp, colorOptions)} [${getLogLevelString(severity, colorOptions)}] ${message}`;
        }
        return `${getIsoString(timestamp, colorOptions)} [${getLogLevelString(severity, colorOptions)} ${getScopeString(scope, colorOptions)}] ${message}`;
    }
}
let DefaultLogEventFactory = /** @class */ (() => {
    let DefaultLogEventFactory = class DefaultLogEventFactory {
        constructor(config) {
            this.config = config;
        }
        createLogEvent(logger, level, message, optionalParams) {
            return new DefaultLogEvent(level, message, optionalParams, logger.scope, this.config.colorOptions, Date.now());
        }
    };
    DefaultLogEventFactory = __decorate([
        __param(0, ILogConfig),
        __metadata("design:paramtypes", [Object])
    ], DefaultLogEventFactory);
    return DefaultLogEventFactory;
})();
export { DefaultLogEventFactory };
export class ConsoleSink {
    constructor($console) {
        this.handleEvent = function emit(event) {
            const optionalParams = event.optionalParams;
            if (optionalParams === void 0 || optionalParams.length === 0) {
                switch (event.severity) {
                    case 0 /* trace */:
                    case 1 /* debug */:
                        return $console.debug(event.toString());
                    case 2 /* info */:
                        return $console.info(event.toString());
                    case 3 /* warn */:
                        return $console.warn(event.toString());
                    case 4 /* error */:
                    case 5 /* fatal */:
                        return $console.error(event.toString());
                }
            }
            else {
                switch (event.severity) {
                    case 0 /* trace */:
                    case 1 /* debug */:
                        return $console.debug(event.toString(), ...optionalParams);
                    case 2 /* info */:
                        return $console.info(event.toString(), ...optionalParams);
                    case 3 /* warn */:
                        return $console.warn(event.toString(), ...optionalParams);
                    case 4 /* error */:
                    case 5 /* fatal */:
                        return $console.error(event.toString(), ...optionalParams);
                }
            }
        };
    }
}
let DefaultLogger = /** @class */ (() => {
    let DefaultLogger = class DefaultLogger {
        constructor(config, factory, sinks, scope = [], parent = null) {
            var _a, _b, _c, _d, _e, _f;
            this.config = config;
            this.factory = factory;
            this.scope = scope;
            this.scopedLoggers = Object.create(null);
            let traceSinks;
            let debugSinks;
            let infoSinks;
            let warnSinks;
            let errorSinks;
            let fatalSinks;
            if (parent === null) {
                this.root = this;
                this.parent = this;
                traceSinks = this.traceSinks = [];
                debugSinks = this.debugSinks = [];
                infoSinks = this.infoSinks = [];
                warnSinks = this.warnSinks = [];
                errorSinks = this.errorSinks = [];
                fatalSinks = this.fatalSinks = [];
                for (const $sink of sinks) {
                    const handles = LoggerSink.getHandles($sink);
                    if ((_a = handles === null || handles === void 0 ? void 0 : handles.includes(0 /* trace */)) !== null && _a !== void 0 ? _a : true) {
                        traceSinks.push($sink);
                    }
                    if ((_b = handles === null || handles === void 0 ? void 0 : handles.includes(1 /* debug */)) !== null && _b !== void 0 ? _b : true) {
                        debugSinks.push($sink);
                    }
                    if ((_c = handles === null || handles === void 0 ? void 0 : handles.includes(2 /* info */)) !== null && _c !== void 0 ? _c : true) {
                        infoSinks.push($sink);
                    }
                    if ((_d = handles === null || handles === void 0 ? void 0 : handles.includes(3 /* warn */)) !== null && _d !== void 0 ? _d : true) {
                        warnSinks.push($sink);
                    }
                    if ((_e = handles === null || handles === void 0 ? void 0 : handles.includes(4 /* error */)) !== null && _e !== void 0 ? _e : true) {
                        errorSinks.push($sink);
                    }
                    if ((_f = handles === null || handles === void 0 ? void 0 : handles.includes(5 /* fatal */)) !== null && _f !== void 0 ? _f : true) {
                        fatalSinks.push($sink);
                    }
                }
            }
            else {
                this.root = parent.root;
                this.parent = parent;
                traceSinks = this.traceSinks = parent.traceSinks;
                debugSinks = this.debugSinks = parent.debugSinks;
                infoSinks = this.infoSinks = parent.infoSinks;
                warnSinks = this.warnSinks = parent.warnSinks;
                errorSinks = this.errorSinks = parent.errorSinks;
                fatalSinks = this.fatalSinks = parent.fatalSinks;
            }
            const emit = ($sinks, level, msgOrGetMsg, optionalParams) => {
                const message = typeof msgOrGetMsg === 'function' ? msgOrGetMsg() : msgOrGetMsg;
                const event = factory.createLogEvent(this, level, message, optionalParams);
                for (let i = 0, ii = $sinks.length; i < ii; ++i) {
                    $sinks[i].handleEvent(event);
                }
            };
            this.trace = function trace(messageOrGetMessage, ...optionalParams) {
                if (config.level <= 0 /* trace */) {
                    emit(traceSinks, 0 /* trace */, messageOrGetMessage, optionalParams);
                }
            };
            this.debug = function debug(messageOrGetMessage, ...optionalParams) {
                if (config.level <= 1 /* debug */) {
                    emit(debugSinks, 1 /* debug */, messageOrGetMessage, optionalParams);
                }
            };
            this.info = function info(messageOrGetMessage, ...optionalParams) {
                if (config.level <= 2 /* info */) {
                    emit(infoSinks, 2 /* info */, messageOrGetMessage, optionalParams);
                }
            };
            this.warn = function warn(messageOrGetMessage, ...optionalParams) {
                if (config.level <= 3 /* warn */) {
                    emit(warnSinks, 3 /* warn */, messageOrGetMessage, optionalParams);
                }
            };
            this.error = function error(messageOrGetMessage, ...optionalParams) {
                if (config.level <= 4 /* error */) {
                    emit(errorSinks, 4 /* error */, messageOrGetMessage, optionalParams);
                }
            };
            this.fatal = function fatal(messageOrGetMessage, ...optionalParams) {
                if (config.level <= 5 /* fatal */) {
                    emit(fatalSinks, 5 /* fatal */, messageOrGetMessage, optionalParams);
                }
            };
        }
        scopeTo(name) {
            const scopedLoggers = this.scopedLoggers;
            let scopedLogger = scopedLoggers[name];
            if (scopedLogger === void 0) {
                scopedLogger = scopedLoggers[name] = new DefaultLogger(this.config, this.factory, (void 0), this.scope.concat(name), this);
            }
            return scopedLogger;
        }
    };
    DefaultLogger = __decorate([
        __param(0, ILogConfig),
        __param(1, ILogEventFactory),
        __param(2, all(ISink)),
        __param(3, optional(ILogScopes)),
        __param(4, ignore),
        __metadata("design:paramtypes", [Object, Object, Array, Array, Object])
    ], DefaultLogger);
    return DefaultLogger;
})();
export { DefaultLogger };
/**
 * A basic `ILogger` configuration that configures a single `console` sink based on provided options.
 *
 * NOTE: You *must* register the return value of `.create` with the container / au instance, not this `LoggerConfiguration` object itself.
 *
 * @example
 * ```ts
 * container.register(LoggerConfiguration.create());
 *
 * container.register(LoggerConfiguration.create({$console: console}))
 *
 * container.register(LoggerConfiguration.create({$console: console, level: LogLevel.debug}))
 *
 * container.register(LoggerConfiguration.create({
 *  $console: {
 *     debug: PLATFORM.noop,
 *     info: PLATFORM.noop,
 *     warn: PLATFORM.noop,
 *     error: msg => {
 *       throw new Error(msg);
 *     }
 *  },
 *  level: LogLevel.debug
 * }))
 *
 * ```
 */
export const LoggerConfiguration = toLookup({
    /**
     * @param $console - The `console` object to use. Can be the native `window.console` / `global.console`, but can also be a wrapper or mock that implements the same interface.
     * @param level - The global `LogLevel` to configure. Defaults to `warn` or higher.
     * @param colorOptions - Whether to use colors or not. Defaults to `noColors`. Colors are especially nice in nodejs environments but don't necessarily work (well) in all environments, such as browsers.
     */
    create({ $console, level = 3 /* warn */, colorOptions = 0 /* noColors */, sinks = [], } = {}) {
        return toLookup({
            register(container) {
                container.register(Registration.instance(ILogConfig, new LogConfig(colorOptions, level)));
                if ($console !== void 0 && $console !== null) {
                    container.register(Registration.instance(ISink, new ConsoleSink($console)));
                }
                for (const $sink of sinks) {
                    container.register(Registration.singleton(ISink, $sink));
                }
                return container;
            },
        });
    },
});
//# sourceMappingURL=logger.js.map