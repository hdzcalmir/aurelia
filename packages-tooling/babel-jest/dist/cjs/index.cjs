'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginConventions = require('@aurelia/plugin-conventions');
var babelJest = require('babel-jest');

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

var babelJest__namespace = /*#__PURE__*/_interopNamespaceDefault(babelJest);

const babelTransformer = babelJest__namespace.createTransformer();
function _createTransformer(conventionsOptions = {}, _preprocess = pluginConventions.preprocess, _babelProcess = babelTransformer.process.bind(babelTransformer)) {
    const au2Options = pluginConventions.preprocessOptions(conventionsOptions);
    function getCacheKey(fileData, filePath, options) {
        const babelKey = babelTransformer.getCacheKey(fileData, filePath, options);
        return `${babelKey}:${JSON.stringify(au2Options)}`;
    }
    function process(sourceText, sourcePath, transformOptions) {
        const result = _preprocess({ path: sourcePath, contents: sourceText }, au2Options);
        if (result !== undefined) {
            return _babelProcess(result.code, sourcePath, transformOptions);
        }
        return _babelProcess(sourceText, sourcePath, transformOptions);
    }
    return {
        canInstrument: babelTransformer.canInstrument,
        getCacheKey,
        process
    };
}
function createTransformer(conventionsOptions = {}) {
    return _createTransformer(conventionsOptions);
}
const { canInstrument, getCacheKey, process } = createTransformer();
var index = { canInstrument, getCacheKey, process, createTransformer, _createTransformer };

exports.default = index;
//# sourceMappingURL=index.cjs.map
