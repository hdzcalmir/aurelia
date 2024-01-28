'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var plugin = require('@parcel/plugin');
var $SourceMap = require('@parcel/source-map');
var pluginConventions = require('@aurelia/plugin-conventions');
var path = require('path');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        for (var k in e) {
            n[k] = e[k];
        }
    }
    n.default = e;
    return Object.freeze(n);
}

var $SourceMap__namespace = /*#__PURE__*/_interopNamespaceDefault($SourceMap);

const SourceMap = (typeof $SourceMap === 'function'
    ? $SourceMap
    : typeof $SourceMap.default === 'function'
        ? $SourceMap.default
        : (typeof $SourceMap__namespace === 'function'
            ? $SourceMap__namespace
            : $SourceMap__namespace.default));
var index = new plugin.Transformer({
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
        const auOptions = pluginConventions.preprocessOptions({
            ...config,
            stringModuleWrap: (id) => `bundle-text:${id}`
        });
        if (asset.type === 'js' && auOptions.templateExtensions.includes(path.extname(asset.filePath))) {
            return [asset];
        }
        const result = pluginConventions.preprocess({
            path: path.relative(options.projectRoot, asset.filePath.slice()),
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

exports.default = index;
//# sourceMappingURL=index.cjs.map
