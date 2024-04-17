import { Observable } from 'rxjs';
import { Store } from './store';
export interface ConnectToSettings<T, R = T> {
    onChanged?: string;
    selector: ((store: Store<T>) => Observable<R>) | MultipleSelector<T, R>;
    /**
     * the function to be called for setup of the state subscription, typically an Aurelia lifecycle hook
     */
    setup?: string;
    target?: string;
    /**
     * the function to be called for teardown of the state subscription, typically an Aurelia lifecycle hook
     */
    teardown?: string;
}
export interface MultipleSelector<T, R = T> {
    [key: string]: ((store: Store<T>) => Observable<R>);
}
export declare function connectTo<T, R = any>(settings?: ((store: Store<T>) => Observable<R>) | ConnectToSettings<T, R>): <TClass extends {
    new (...args: any[]): unknown;
    readonly prototype: unknown;
}>(target: any, _context: ClassDecoratorContext<TClass>) => void;
//# sourceMappingURL=decorator.d.ts.map