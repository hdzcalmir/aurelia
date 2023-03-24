export declare class TestArray extends Array {
    indeterminate: string;
    constructor(...args: any[]);
}
/**
 * Potential test coverage targets:
 * - `@aurelia/runtime`
 *   - Observers
 *     - `computed-observer`
 *     - `dirty-checker`
 */
export declare class User {
    firstName: string;
    lastName: string;
    age: number;
    role: string;
    organization: string;
    city: string;
    country: string;
    arr: TestArray;
    constructor(firstName: string, lastName: string, age: number, role: string, organization: string, city: string, country: string);
    get fullNameStatic(): string;
    get fullNameNonStatic(): string;
    get fullNameWrongStatic(): string;
    get $role(): string;
    set $role(value: string);
    get $location(): string;
    set $location(value: string);
}
export declare class UserPreference {
    user: User;
}
//# sourceMappingURL=user-preference.d.ts.map