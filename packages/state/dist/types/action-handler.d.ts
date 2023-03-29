import { IActionHandler, IRegistrableAction } from './interfaces';
export declare const ActionHandler: Readonly<{
    define<T extends IActionHandler<any>>(actionHandler: T): IRegistrableAction;
    isType: <T_1>(r: unknown) => r is IActionHandler<T_1>;
}>;
//# sourceMappingURL=action-handler.d.ts.map