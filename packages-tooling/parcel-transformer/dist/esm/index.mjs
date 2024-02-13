import { Transformer } from '@parcel/plugin';
import * as $SourceMap from '@parcel/source-map';
import $SourceMap__default from '@parcel/source-map';
import { preprocessOptions, preprocess } from '@aurelia/plugin-conventions';
import { extname, relative } from 'path';

const SourceMap = (typeof $SourceMap__default === 'function'
    ? $SourceMap__default
    : typeof $SourceMap__default.default === 'function'
        ? $SourceMap__default.default
        : (typeof $SourceMap === 'function'
            ? $SourceMap
            : $SourceMap.default));
var index = new Transformer({
    async loadConfig({ config }) {
        try {
            const conf = await config.getConfig([], { packageKey: 'aurelia' });
            return conf ? conf.contents : {};
        }
        catch (e) {
            return {};
        }
    },
    async transform({ asset, config, options }) {
        const source = await asset.getCode();
        if (asset.type === 'html' && (/^\s*<!DOCTYPE/i).exec(source))
            return [asset];
        const auOptions = preprocessOptions({
            ...config,
            stringModuleWrap: (id) => `bundle-text:${id}`
        });
        if (asset.type === 'js' && auOptions.templateExtensions.includes(extname(asset.filePath))) {
            return [asset];
        }
        const result = preprocess({
            path: relative(options.projectRoot, asset.filePath.slice()),
            contents: source
        }, auOptions);
        if (!result) {
            return [asset];
        }
        asset.setCode(result.code);
        const map = new SourceMap();
        map.addVLQMap(result.map);
        asset.setMap(map);
        if (auOptions.templateExtensions.includes(`.${asset.type}`)) {
            asset.type = 'js';
        }
        return [asset];
    }
});

export { index as default };
//# sourceMappingURL=index.mjs.map
