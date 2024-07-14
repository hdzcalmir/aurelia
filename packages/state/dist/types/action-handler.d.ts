import { IActionHandler, IRegistrableAction } from './interfaces';
export declare const ActionHandler: Readonly<{
    define<T extends IActionHandler>(actionHandler: T): IRegistrableAction;
    isType: <T>(r: unknown) => r is IActionHandler<T>;
}>;
//# sourceMappingURL=action-handler.d.ts.map