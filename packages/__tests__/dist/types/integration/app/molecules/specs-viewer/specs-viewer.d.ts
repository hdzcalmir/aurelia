import { Thing, ThingViewer } from './thing-viewer.js';
export declare class SpecsViewer {
    things: Thing[];
    private pairs;
    binding(): void;
}
export declare class ViewerValueConverter {
    toView(thing: unknown): typeof ThingViewer;
}
//# sourceMappingURL=specs-viewer.d.ts.map