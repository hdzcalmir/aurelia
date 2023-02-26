import type { Store } from './store';
export type StepFn<T> = (res: T | undefined) => void | Promise<void>;
export declare function executeSteps<T>(store: Store<T>, shouldLogResults: boolean, ...steps: StepFn<T>[]): Promise<unknown>;
//# sourceMappingURL=test-helpers.d.ts.map