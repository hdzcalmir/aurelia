import { Thing } from './thing-viewer.js';
export declare class Zoom {
    optical: number;
    digital?: number;
    constructor(optical: number, digital?: number);
}
export declare class Camera extends Thing {
    zoom: Zoom;
    iso: number[];
    focalLengthRange: [number, number];
    fNumberRange: [number, number];
    constructor(zoom: Zoom, iso: number[], focalLengthRange: [number, number], fNumberRange: [number, number], modelNumber: string, make: string);
}
export declare class CameraSpecsViewer {
    model: Camera;
    private focalLength;
    private fNumber;
    binding(..._args: unknown[]): void;
}
//# sourceMappingURL=camera-specs-viewer.d.ts.map