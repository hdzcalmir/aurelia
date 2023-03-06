import { Store, StoreOptions, StateHistory, DevToolsOptions, IStoreWindow } from '@aurelia/store-v1';
import { ILogger } from '@aurelia/kernel';
export type testState = {
    foo: string;
    bar?: string;
};
export declare class DevToolsMock {
    devToolsOptions: DevToolsOptions;
    subscriptions: ((message: any) => void)[];
    init(): void;
    subscribe(cb: (message: any) => void): void;
    send(): void;
    constructor(devToolsOptions: DevToolsOptions);
}
export declare function createDI(mockWindow?: object): {
    container: import("@aurelia/kernel").IContainer;
    logger: ILogger;
    storeWindow: IStoreWindow;
};
export declare function createTestStore(): {
    container: import("@aurelia/kernel").IContainer;
    initialState: {
        foo: string;
    };
    store: Store<testState>;
};
export declare function createUndoableTestStore(): {
    initialState: StateHistory<testState>;
    store: Store<StateHistory<testState>>;
};
export declare function createStoreWithState<T>(state: T, withUndo?: boolean): Store<T>;
export declare function createStoreWithStateAndOptions<T>(state: T, options: Partial<StoreOptions>): Store<T>;
export declare function createCallCounter(object: any, forMethod: string, callThrough?: boolean): {
    spyObj: {
        callCounter: number;
        lastArgs: any;
        reset(): void;
    };
    origMethod: any;
};
//# sourceMappingURL=helpers.d.ts.map