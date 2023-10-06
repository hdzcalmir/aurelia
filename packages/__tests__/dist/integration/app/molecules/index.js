import { noop } from '@aurelia/kernel';
import { Cards } from './cards/cards.js';
import { LetDemo, SqrtValueConverter } from './let-demo/let-demo.js';
import { CameraSpecsViewer } from './specs-viewer/camera-specs-viewer.js';
import { LaptopSpecsViewer } from './specs-viewer/laptop-specs-viewer.js';
import { SpecsViewer, ViewerValueConverter } from './specs-viewer/specs-viewer.js';
import { ThingViewer } from './specs-viewer/thing-viewer.js';
import { UserPreference } from './user-preference/user-preference.js';
import { RandomGenerator } from './random-generator/random-generator.js';
function createMolecularConfiguration(customizeConfiguration) {
    return {
        customizeConfiguration,
        register(container) {
            const config = { useCSSModule: true };
            customizeConfiguration(config);
            const useCSSModule = config.useCSSModule;
            return container.register(SpecsViewer, ThingViewer, CameraSpecsViewer, LaptopSpecsViewer, ViewerValueConverter, UserPreference, LetDemo, SqrtValueConverter, Cards.customize(useCSSModule), RandomGenerator);
        },
        customize(cb) {
            return createMolecularConfiguration(cb || customizeConfiguration);
        },
    };
}
export const molecules = createMolecularConfiguration(noop);
//# sourceMappingURL=index.js.map