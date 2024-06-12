import { IContainer, ILogEvent, LogLevel } from '@aurelia/kernel';
export declare const createSink: ((callback: (message: any) => any, level?: LogLevel) => {
    new (): {
        handleEvent(event: ILogEvent): void;
    };
    register(container: IContainer): void;
}) & {
    error: (callback: (message: any) => any) => {
        new (): {
            handleEvent(event: ILogEvent): void;
        };
        register(container: IContainer): void;
    };
    warn: (callback: (message: any) => any) => {
        new (): {
            handleEvent(event: ILogEvent): void;
        };
        register(container: IContainer): void;
    };
    info: (callback: (message: any) => any) => {
        new (): {
            handleEvent(event: ILogEvent): void;
        };
        register(container: IContainer): void;
    };
    debug: (callback: (message: any) => any) => {
        new (): {
            handleEvent(event: ILogEvent): void;
        };
        register(container: IContainer): void;
    };
    trace: (callback: (message: any) => any) => {
        new (): {
            handleEvent(event: ILogEvent): void;
        };
        register(container: IContainer): void;
    };
};
//# sourceMappingURL=logger-sinks.d.ts.map