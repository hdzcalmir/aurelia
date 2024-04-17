var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { LoggerConfiguration, DI, ILogger, LogLevel, ISink, sink, ConsoleSink, Registration, } from '@aurelia/kernel';
import { assert, eachCartesianJoin } from '@aurelia/testing';
class ConsoleMock {
    constructor() {
        this.calls = [];
    }
    debug(...args) {
        this.calls.push(['debug', args]);
        // console.debug(...args);
    }
    info(...args) {
        this.calls.push(['info', args]);
        // console.info(...args);
    }
    warn(...args) {
        this.calls.push(['warn', args]);
        // console.warn(...args);
    }
    error(...args) {
        this.calls.push(['error', args]);
        // console.error(...args);
    }
}
let EventLog = (() => {
    let _classDecorators = [sink({ handles: [LogLevel.error] })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EventLog = _classThis = class {
        constructor() {
            this.log = [];
        }
        handleEvent(event) {
            this.log.push(event);
        }
    };
    __setFunctionName(_classThis, "EventLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventLog = _classThis;
})();
const levels = [
    [
        LogLevel.trace,
        'trace',
        'debug',
        'TRC',
    ],
    [
        LogLevel.debug,
        'debug',
        'debug',
        'DBG',
    ],
    [
        LogLevel.info,
        'info',
        'info',
        'INF',
    ],
    [
        LogLevel.warn,
        'warn',
        'warn',
        'WRN',
    ],
    [
        LogLevel.error,
        'error',
        'error',
        'ERR',
    ],
    [
        LogLevel.fatal,
        'fatal',
        'error',
        'FTL',
    ],
    [
        LogLevel.none,
        'none',
        '',
        '',
    ],
];
describe('1-kernel/logger.spec.ts', function () {
    function createFixture(level, colorOpts, scopeTo, deactivateConsoleLog = false) {
        const container = DI.createContainer();
        const mock = new ConsoleMock();
        const consoleSink = new ConsoleSink({ console: mock });
        container.register(LoggerConfiguration.create({
            level,
            colorOptions: colorOpts,
            sinks: deactivateConsoleLog ? [EventLog] : [EventLog, Registration.instance(ISink, consoleSink)],
        }));
        let sut = container.get(ILogger);
        for (let i = 0; i < scopeTo.length; ++i) {
            sut = sut.scopeTo(scopeTo[i]);
        }
        return { sut, mock, container };
    }
    eachCartesianJoin([
        levels.slice(0, -1),
        levels.slice(),
        [
            'no-colors',
            'colors',
        ],
        [
            [
                'test',
            ],
            [
                () => 'test',
            ],
            [
                'test',
                {},
            ],
            [
                () => 'test',
                {},
            ],
        ],
        [
            [],
            ['foo'],
            ['foo', 'bar'],
        ]
    ], function ([methodLevel, loggerMethodName, consoleMethodName, abbrev], [configLevel, configName], colorOpts, [msgOrGetMsg, ...optionalParams], scopeTo) {
        const colorRE = colorOpts === 'colors' ? '\\u001b\\[\\d{1,2}m' : '';
        const timestampRE = `${colorRE}\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z${colorRE}`;
        const scopeRE = scopeTo.length === 0
            ? ''
            : ` ${scopeTo.map(x => `${colorRE}${x}${colorRE}`).join('\\.')}`;
        const abbrevRE = `\\[${colorRE}${abbrev}${colorRE}${scopeRE}\\]`;
        describe(`with configured level=${configName}, colors=${colorOpts}, msgOrGetMsg=${msgOrGetMsg}, optionalParams=${optionalParams}, scopeTo=${scopeTo}`, function () {
            if (methodLevel >= configLevel) {
                it(`logs ${loggerMethodName}`, function () {
                    const { sut, mock } = createFixture(configLevel, colorOpts, scopeTo);
                    sut[loggerMethodName](msgOrGetMsg, ...optionalParams);
                    assert.strictEqual(mock.calls.length, 1, `mock.calls.length`);
                    const [method, args] = mock.calls[0];
                    assert.strictEqual(method, consoleMethodName, `method`);
                    assert.strictEqual(args.length, optionalParams.length + 1, `args.length`);
                    assert.match(args[0], new RegExp(`${timestampRE} ${abbrevRE} test`));
                    if (optionalParams.length > 0) {
                        assert.deepStrictEqual(args.slice(1), optionalParams);
                    }
                });
            }
            else {
                it(`does NOT log ${loggerMethodName}`, function () {
                    const { sut, mock } = createFixture(configLevel, colorOpts, scopeTo);
                    sut[loggerMethodName](msgOrGetMsg, ...optionalParams);
                    assert.strictEqual(mock.calls.length, 0, `mock.calls.length`);
                });
                it(`can change the level after instantiation`, function () {
                    const { sut, mock } = createFixture(configLevel, colorOpts, scopeTo);
                    sut.config.level = methodLevel;
                    sut[loggerMethodName](msgOrGetMsg, ...optionalParams);
                    assert.strictEqual(mock.calls.length, 1, `mock.calls.length`);
                    const [method, args] = mock.calls[0];
                    assert.strictEqual(method, consoleMethodName, `method`);
                    assert.strictEqual(args.length, optionalParams.length + 1, `args.length`);
                    assert.match(args[0], new RegExp(`${timestampRE} ${abbrevRE} test`));
                    if (optionalParams.length > 0) {
                        assert.deepStrictEqual(args.slice(1), optionalParams);
                    }
                });
            }
        });
    });
    it('additional sink registration works', function () {
        const { sut } = createFixture(LogLevel.error, 'no-colors', []);
        const sinks = sut.sinks;
        const eventLog = sinks.find((s) => s instanceof EventLog);
        assert.notStrictEqual(eventLog, void 0);
        sut.error('foo');
        assert.strictEqual(eventLog.log.length, 1, `eventLog.log.length`);
        const event = eventLog.log[0];
        assert.strictEqual(event.severity, LogLevel.error);
        assert.includes(event.toString(), "foo");
    });
    it('respects the handling capabilities of sinks', function () {
        const { sut } = createFixture(LogLevel.trace, 'no-colors', []);
        const sinks = sut.sinks;
        const eventLog = sinks.find((s) => s instanceof EventLog);
        assert.strictEqual(eventLog !== void 0, true);
        sut.info('foo');
        assert.strictEqual(eventLog.log.length, 0, `eventLog.log.length1`);
        sut.error('foo');
        assert.strictEqual(eventLog.log.length, 1, `eventLog.log.length2`);
        const event = eventLog.log[0];
        assert.strictEqual(event.severity, LogLevel.error);
        assert.includes(event.toString(), "foo");
    });
    it('console logging can be deactivated', function () {
        const { sut, mock } = createFixture(LogLevel.trace, 'no-colors', [], true);
        const sinks = sut.sinks;
        const eventLog = sinks.find((s) => s instanceof EventLog);
        sut.error('foo');
        assert.strictEqual(eventLog.log.length, 1, `eventLog.log.length`);
        const event = eventLog.log[0];
        assert.strictEqual(event.severity, LogLevel.error);
        assert.includes(event.toString(), "foo");
        assert.strictEqual(mock.calls.length, 0, `mock.calls.length`);
    });
    it('logging an error instance without a message results in empty message', function () {
        const { sut, mock } = createFixture(LogLevel.trace, 'no-colors', []);
        const error = new Error('foo');
        sut.error(error);
        assert.strictEqual(mock.calls.length, 1, `mock.calls.length`);
        const [level, [message, $error]] = mock.calls[0];
        assert.strictEqual(level, 'error', `level`);
        assert.match(message, /\[ERR\] $/, `args[0]`);
        assert.strictEqual($error, error, `args[1]`);
    });
    it('logging error with message template', function () {
        const { sut, mock } = createFixture(LogLevel.trace, 'no-colors', []);
        sut.error('foo %s', '1', 42);
        assert.strictEqual(mock.calls.length, 1, `mock.calls.length`);
        const [level, [message, additionalParam]] = mock.calls[0];
        assert.strictEqual(level, 'error', `level`);
        assert.match(message, /\[ERR\] foo 1$/, `args[0]`);
        assert.strictEqual(additionalParam, 42, `args[1]`);
    });
});
//# sourceMappingURL=logger.spec.js.map