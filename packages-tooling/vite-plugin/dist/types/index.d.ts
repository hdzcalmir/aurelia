import { FilterPattern } from '@rollup/pluginutils';
export default function au(options?: {
    include?: FilterPattern;
    exclude?: FilterPattern;
    pre?: boolean;
    /**
     * Indiciates whether the plugin should alias aurelia packages to the dev bundle.
     */
    useDev?: boolean;
}): import("vite").Plugin[];
//# sourceMappingURL=index.d.ts.map