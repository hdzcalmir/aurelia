import { TestExecutionContext, StartupConfiguration } from './app/startup.js';
import { Call } from '@aurelia/testing';
export declare function createTestFunction(testFunction: (ctx: TestExecutionContext) => Promise<void> | void, startupConfiguration?: StartupConfiguration): () => Promise<void>;
export declare function $it(title: string, testFunction: (ctx: TestExecutionContext) => Promise<void> | void, startupConfiguration?: StartupConfiguration): void;
export declare namespace $it {
    var skip: (title: string, testFunction: (ctx: TestExecutionContext) => void | Promise<void>, startupConfiguration?: Partial<import("./app/molecules/index.js").MolecularConfiguration & {
        method: "app" | "enhance";
        componentMode: import("./app/startup.js").ComponentMode;
    }>) => void;
    var only: (title: string, testFunction: (ctx: TestExecutionContext) => void | Promise<void>, startupConfiguration?: Partial<import("./app/molecules/index.js").MolecularConfiguration & {
        method: "app" | "enhance";
        componentMode: import("./app/startup.js").ComponentMode;
    }>) => void;
}
export declare function getViewModel<T>(element: Element): T;
export declare function assertCalls(calls: Call[], fromIndex: number, instance: any, expectedCalls: string[], unexpectedCalls?: string[], message?: string): void;
//# sourceMappingURL=util.d.ts.map