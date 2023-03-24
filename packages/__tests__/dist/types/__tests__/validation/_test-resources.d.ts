export interface Address {
    line1: string;
    line2?: string;
    city: string;
    pin: number;
}
export declare class Person {
    name: string;
    age: number;
    address?: Address;
    constructor(name: string, age: number, address?: Address);
}
export declare class Organization {
    employees: Person[];
    address: Address;
    constructor(employees: Person[], address: Address);
}
//# sourceMappingURL=_test-resources.d.ts.map