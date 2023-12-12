import { Thing } from './thing-viewer.js';
export declare class Storage {
    type: "HDD" | "SSD";
    size: number;
    unit: "GB" | "TB";
    constructor(type: "HDD" | "SSD", size: number, unit: "GB" | "TB");
}
export declare class Laptop extends Thing {
    cpu: string;
    ram: string;
    storage: Storage;
    screen: string;
    constructor(cpu: string, ram: string, storage: Storage, screen: string, modelNumber: string, make: string);
}
export declare class LaptopSpecsViewer {
    model: Laptop;
    private storage;
    binding(): void;
}
//# sourceMappingURL=laptop-specs-viewer.d.ts.map