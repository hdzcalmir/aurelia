export declare class Spy {
    callRecords: Map<string, any[][]>;
    getMock<T extends object>(objectToMock: T): T;
    setCallRecord(methodName: string, args: any[]): void;
    clearCallRecords(): void;
    methodCalledTimes(methodName: string, times: number): void;
    methodCalledOnceWith(methodName: string, expectedArgs: any[]): void;
    methodCalledNthTimeWith(methodName: string, n: number, expectedArgs: any[]): void;
}
//# sourceMappingURL=Spy.d.ts.map