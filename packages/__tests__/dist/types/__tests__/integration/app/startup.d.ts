import { Aurelia } from '@aurelia/runtime-html';
import { CallCollection, TestContext } from '@aurelia/testing';
import { MolecularConfiguration } from './molecules/index.js';
export declare class TestExecutionContext {
    au: Aurelia;
    host: HTMLElement;
    ctx: TestContext;
    tearDown: () => Promise<void>;
    callCollection: CallCollection;
    constructor(au: Aurelia, host: HTMLElement, ctx: TestContext, tearDown: () => Promise<void>, callCollection: CallCollection);
}
export declare const enum ComponentMode {
    class = "class",
    instance = "instance"
}
export type StartupConfiguration = Partial<MolecularConfiguration & {
    method: 'app' | 'enhance';
    componentMode: ComponentMode;
}>;
export declare function startup(config?: StartupConfiguration): Promise<TestExecutionContext>;
//# sourceMappingURL=startup.d.ts.map