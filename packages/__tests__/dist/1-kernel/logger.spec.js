var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
let EventLog = class EventLog {
    constructor() {
        this.log = [];
    }
    handleEvent(event) {
        this.log.push(event);
    }
};
EventLog = __decorate([
    sink({ handles: [LogLevel.error] })
], EventLog);
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