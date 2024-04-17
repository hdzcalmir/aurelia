import { camelCase, kebabCase } from '@aurelia/kernel';
import * as path from 'path';
import pkg from 'typescript';
import * as $modifyCode from 'modify-code';
import $modifyCode__default from 'modify-code';
import { BindingMode } from '@aurelia/runtime-html';
import { parseFragment } from 'parse5';
import * as fs from 'fs';

function nameConvention(className) {
    const m = /^(.+?)(CustomElement|CustomAttribute|ValueConverter|BindingBehavior|BindingCommand|TemplateController)?$/.exec(className);
    if (!m) {
        throw new Error(`No convention found for class name ${className}`);
    }
    const bareName = m[1];
    const type = (m[2] ? camelCase(m[2]) : 'customElement');
    return {
        name: normalizedName(bareName, type),
        type
    };
}
function normalizedName(name, type) {
    if (type === 'valueConverter' || type === 'bindingBehavior') {
        return camelCase(name);
    }
    return kebabCase(name);
}

function resourceName(filePath) {
    const parsed = path.parse(filePath);
    const name = parsed.name === 'index' ? path.basename(parsed.dir) : parsed.name;
    return kebabCase(name);
}

const modifyCode = (typeof $modifyCode__default === 'function'
    ? $modifyCode__default
    : typeof $modifyCode__default.default === 'function'
        ? $modifyCode__default.default
        : typeof $modifyCode === 'function'
            ? $modifyCode
            : $modifyCode.default);

const { createSourceFile, ScriptTarget, isImportDeclaration, isStringLiteral, isNamedImports, isClassDeclaration, canHaveModifiers, getModifiers, SyntaxKind, canHaveDecorators, getDecorators, isCallExpression, isIdentifier, visitEachChild, visitNode, isExpressionStatement, isObjectLiteralExpression, transform, createPrinter, isPropertyDeclaration, getCombinedModifierFlags, ModifierFlags, isPropertyAccessExpression, factory: { createSpreadAssignment, createIdentifier, createObjectLiteralExpression, updateCallExpression, updateExpressionStatement, createPropertyAssignment, updateClassDeclaration, updatePropertyDeclaration, } } = pkg;
function preprocessResource(unit, options) {
    const expectedResourceName = resourceName(unit.path);
    const sf = createSourceFile(unit.path, unit.contents, ScriptTarget.Latest);
    let exportedClassName;
    let auImport = { names: [], start: 0, end: 0 };
    let runtimeImport = { names: [], start: 0, end: 0 };
    let implicitElement;
    let customElementDecorator;
    let defineElementInformation;
    const localDeps = [];
    const definitions = [];
    sf.statements.forEach(s => {
        const au = captureImport(s, 'aurelia', unit.contents);
        if (au) {
            auImport = au;
            return;
        }
        const runtime = captureImport(s, '@aurelia/runtime-html', unit.contents);
        if (runtime) {
            runtimeImport = runtime;
            return;
        }
        const resource = findResource(s, expectedResourceName, unit.filePair, unit.contents);
        if (!resource)
            return;
        const { className, localDep, needDefinition, implicitStatement, runtimeImportName, customElementDecorator: customName, defineElementInformation: $defineElementInformation, } = resource;
        if (localDep)
            localDeps.push(localDep);
        if (needDefinition)
            definitions.push(needDefinition);
        if (implicitStatement)
            implicitElement = implicitStatement;
        if (runtimeImportName && !auImport.names.includes(runtimeImportName)) {
            ensureTypeIsExported(runtimeImport.names, runtimeImportName);
        }
        if (className) {
            exportedClassName = className;
        }
        if (customName)
            customElementDecorator = customName;
        if ($defineElementInformation)
            defineElementInformation = $defineElementInformation;
    });
    let m = modifyCode(unit.contents, unit.path);
    const hmrEnabled = options.hmr && exportedClassName && process.env.NODE_ENV !== 'production';
    if (options.enableConventions || hmrEnabled) {
        if (runtimeImport.names.length) {
            let runtimeImportStatement = `import { ${runtimeImport.names.join(', ')} } from '@aurelia/runtime-html';`;
            if (runtimeImport.end === runtimeImport.start)
                runtimeImportStatement += '\n';
            m.replace(runtimeImport.start, runtimeImport.end, runtimeImportStatement);
        }
    }
    if (options.enableConventions) {
        m = modifyResource(unit, m, {
            exportedClassName,
            implicitElement,
            localDeps,
            definitions: definitions,
            customElementDecorator,
            transformHtmlImportSpecifier: options.transformHtmlImportSpecifier,
            defineElementInformation,
        });
    }
    if (options.hmr && exportedClassName && process.env.NODE_ENV !== 'production') {
        if (options.getHmrCode) {
            m.append(options.getHmrCode(exportedClassName, unit.path));
        }
    }
    return m.transform();
}
function modifyResource(unit, m, options) {
    const { implicitElement, localDeps, definitions, customElementDecorator, transformHtmlImportSpecifier = s => s, exportedClassName, defineElementInformation, } = options;
    if (implicitElement && unit.filePair) {
        const viewDef = '__au2ViewDef';
        m.prepend(`import * as ${viewDef} from './${transformHtmlImportSpecifier(unit.filePair)}';\n`);
        if (defineElementInformation) {
            m.replace(defineElementInformation.position.pos, defineElementInformation.position.end, defineElementInformation.modifiedContent);
        }
        else {
            const elementStatement = unit.contents.slice(implicitElement.pos, implicitElement.end);
            if (elementStatement.includes('$au')) {
                const sf = createSourceFile('temp.ts', elementStatement, ScriptTarget.Latest);
                const result = transform(sf, [createAuResourceTransformer()]);
                const modified = createPrinter().printFile(result.transformed[0]);
                m.replace(implicitElement.pos, implicitElement.end, modified);
            }
            else if (localDeps.length) {
                if (customElementDecorator) {
                    const elementStatement = unit.contents.slice(customElementDecorator.position.end, implicitElement.end);
                    m.replace(implicitElement.pos, implicitElement.end, '');
                    const name = unit.contents.slice(customElementDecorator.namePosition.pos, customElementDecorator.namePosition.end);
                    m.append(`\n${elementStatement}\nCustomElement.define({ ...${viewDef}, name: ${name}, dependencies: [ ...${viewDef}.dependencies, ${localDeps.join(', ')} ] }, ${exportedClassName});\n`);
                }
                else {
                    const elementStatement = unit.contents.slice(implicitElement.pos, implicitElement.end);
                    m.replace(implicitElement.pos, implicitElement.end, '');
                    m.append(`\n${elementStatement}\nCustomElement.define({ ...${viewDef}, dependencies: [ ...${viewDef}.dependencies, ${localDeps.join(', ')} ] }, ${exportedClassName});\n`);
                }
            }
            else {
                if (customElementDecorator) {
                    const name = unit.contents.slice(customElementDecorator.namePosition.pos, customElementDecorator.namePosition.end);
                    m.replace(customElementDecorator.position.pos - 1, customElementDecorator.position.end, '');
                    m.insert(implicitElement.end, `\nCustomElement.define({ ...${viewDef}, name: ${name} }, ${exportedClassName});\n`);
                }
                else {
                    m.insert(implicitElement.end, `\nCustomElement.define(${viewDef}, ${exportedClassName});\n`);
                }
            }
        }
    }
    if (definitions.length) {
        definitions.forEach(([pos, str]) => m.insert(pos, str));
    }
    return m;
}
function captureImport(s, lib, code) {
    if (isImportDeclaration(s) &&
        isStringLiteral(s.moduleSpecifier) &&
        s.moduleSpecifier.text === lib &&
        s.importClause &&
        s.importClause.namedBindings &&
        isNamedImports(s.importClause.namedBindings)) {
        return {
            names: s.importClause.namedBindings.elements.map(e => e.name.text),
            start: ensureTokenStart(s.pos, code),
            end: s.end
        };
    }
}
function ensureTypeIsExported(runtimeExports, type) {
    if (!runtimeExports.includes(type)) {
        runtimeExports.push(type);
    }
}
function ensureTokenStart(start, code) {
    while (start < code.length - 1 && /^\s$/.exec(code[start]))
        start++;
    return start;
}
function isExported(node) {
    if (!canHaveModifiers(node))
        return false;
    const modifiers = getModifiers(node);
    if (modifiers === void 0)
        return false;
    for (const mod of modifiers) {
        if (mod.kind === SyntaxKind.ExportKeyword)
            return true;
    }
    return false;
}
const KNOWN_DECORATORS = ['view', 'customElement', 'customAttribute', 'valueConverter', 'bindingBehavior', 'bindingCommand', 'templateController'];
function findDecoratedResourceType(node) {
    if (!canHaveDecorators(node))
        return;
    const decorators = getDecorators(node);
    if (decorators === void 0)
        return;
    for (const d of decorators) {
        if (!isCallExpression(d.expression))
            return;
        const exp = d.expression.expression;
        if (isIdentifier(exp)) {
            const name = exp.text;
            if (KNOWN_DECORATORS.includes(name)) {
                return {
                    type: name,
                    expression: d.expression
                };
            }
        }
    }
}
function isKindOfSame(name1, name2) {
    return name1.replace(/-/g, '') === name2.replace(/-/g, '');
}
function createDefineElementTransformer() {
    return function factory(context) {
        function visit(node) {
            if (isExpressionStatement(node))
                return visitExpression(node);
            return visitEachChild(node, visit, context);
        }
        return (node => visitNode(node, visit));
    };
    function visitExpression(node) {
        const callExpression = node.expression;
        if (!isCallExpression(callExpression))
            return node;
        const propertyAccessExpression = callExpression.expression;
        if (!isPropertyAccessExpression(propertyAccessExpression)
            || !(isIdentifier(propertyAccessExpression.expression) && propertyAccessExpression.expression.escapedText === 'CustomElement')
            || !(isIdentifier(propertyAccessExpression.name) && propertyAccessExpression.name.escapedText === 'define'))
            return node;
        const $arguments = callExpression.arguments;
        if ($arguments.length !== 2)
            return node;
        const [definitionExpression, className] = $arguments;
        if (!isIdentifier(className))
            return node;
        if (!isStringLiteral(definitionExpression) && !isObjectLiteralExpression(definitionExpression))
            return node;
        const spreadAssignment = createSpreadAssignment(createIdentifier('__au2ViewDef'));
        const newDefinition = isStringLiteral(definitionExpression)
            ? createObjectLiteralExpression([
                spreadAssignment,
                createPropertyAssignment('name', definitionExpression),
            ])
            : createObjectLiteralExpression([
                spreadAssignment,
                ...definitionExpression.properties,
            ]);
        const newCallExpression = updateCallExpression(callExpression, propertyAccessExpression, undefined, [newDefinition, className]);
        return updateExpressionStatement(node, newCallExpression);
    }
}
function createAuResourceTransformer() {
    return function factory(context) {
        function visit(node) {
            if (isClassDeclaration(node))
                return visitClass(node);
            return visitEachChild(node, visit, context);
        }
        return (node => visitNode(node, visit));
    };
    function visitClass(node) {
        const newMembers = node.members.map(member => {
            if (!isPropertyDeclaration(member))
                return member;
            const name = member.name.escapedText;
            if (name !== '$au')
                return member;
            const modifiers = getCombinedModifierFlags(member);
            if ((modifiers & ModifierFlags.Static) === 0)
                return member;
            const initializer = member.initializer;
            if (initializer == null || !isObjectLiteralExpression(initializer))
                return member;
            const spreadAssignment = createSpreadAssignment(createIdentifier('__au2ViewDef'));
            const newInitializer = createObjectLiteralExpression([spreadAssignment, ...initializer.properties]);
            return updatePropertyDeclaration(member, member.modifiers, member.name, member.questionToken, member.type, newInitializer);
        });
        return updateClassDeclaration(node, node.modifiers, node.name, node.typeParameters, node.heritageClauses, newMembers);
    }
}
function findResource(node, expectedResourceName, filePair, code) {
    if (isExpressionStatement(node)) {
        const pos = ensureTokenStart(node.pos, code);
        const statement = code.slice(pos, node.end);
        if (!statement.startsWith('CustomElement.define'))
            return;
        const sf = createSourceFile('temp.ts', statement, ScriptTarget.Latest);
        const result = transform(sf, [createDefineElementTransformer()]);
        const modifiedContent = createPrinter().printFile(result.transformed[0]);
        return {
            defineElementInformation: {
                position: { pos, end: node.end },
                modifiedContent
            }
        };
    }
    if (!isClassDeclaration(node))
        return;
    if (!node.name)
        return;
    if (!isExported(node))
        return;
    const pos = ensureTokenStart(node.pos, code);
    const className = node.name.text;
    const { name, type } = nameConvention(className);
    const isImplicitResource = isKindOfSame(name, expectedResourceName);
    const foundType = findDecoratedResourceType(node);
    if (foundType) {
        if (!isImplicitResource &&
            foundType.type !== 'customElement') {
            return {
                localDep: className
            };
        }
        if (isImplicitResource &&
            foundType.type === 'customElement' &&
            foundType.expression.arguments.length === 1 &&
            isStringLiteral(foundType.expression.arguments[0])) {
            const decorator = foundType.expression;
            const customName = decorator.arguments[0];
            return {
                className,
                implicitStatement: { pos: pos, end: node.end },
                customElementDecorator: {
                    position: { pos: ensureTokenStart(decorator.pos, code), end: decorator.end },
                    namePosition: { pos: ensureTokenStart(customName.pos, code), end: customName.end }
                },
                runtimeImportName: filePair ? 'CustomElement' : undefined
            };
        }
    }
    else {
        if (type === 'customElement') {
            if (isImplicitResource && filePair) {
                return {
                    className,
                    implicitStatement: { pos: pos, end: node.end },
                    runtimeImportName: 'CustomElement'
                };
            }
        }
        else {
            let resourceDefinitionStatement;
            let runtimeImportName;
            switch (type) {
                case 'customAttribute':
                    resourceDefinitionStatement = `\nCustomAttribute.define('${name}', ${className});\n`;
                    runtimeImportName = 'CustomAttribute';
                    break;
                case 'templateController':
                    resourceDefinitionStatement = `\nCustomAttribute.define({ name: '${name}', isTemplateController: true }, ${className});\n`;
                    runtimeImportName = 'CustomAttribute';
                    break;
                case 'valueConverter':
                    resourceDefinitionStatement = `\nValueConverter.define('${name}', ${className});\n`;
                    runtimeImportName = 'ValueConverter';
                    break;
                case 'bindingBehavior':
                    resourceDefinitionStatement = `\nBindingBehavior.define('${name}', ${className});\n`;
                    runtimeImportName = 'BindingBehavior';
                    break;
                case 'bindingCommand':
                    resourceDefinitionStatement = `\nBindingCommand.define('${name}', ${className});\n`;
                    runtimeImportName = 'BindingCommand';
                    break;
            }
            const result = {
                needDefinition: resourceDefinitionStatement ? [node.end, resourceDefinitionStatement] : void 0,
                localDep: className,
            };
            if (runtimeImportName) {
                result.runtimeImportName = runtimeImportName;
            }
            return result;
        }
    }
}

function stripMetaData(rawHtml) {
    const deps = [];
    const depsAliases = {};
    let shadowMode = null;
    let containerless = false;
    let hasSlot = false;
    let capture = false;
    const bindables = {};
    const aliases = [];
    const toRemove = [];
    const tree = parseFragment(rawHtml, { sourceCodeLocationInfo: true });
    traverse(tree, node => {
        stripImport(node, (dep, aliases, ranges) => {
            if (dep) {
                deps.push(dep);
                if (aliases != null) {
                    depsAliases[dep] = { ...depsAliases[dep], ...aliases };
                }
            }
            toRemove.push(...ranges);
        });
        stripUseShadowDom(node, (mode, ranges) => {
            if (mode)
                shadowMode = mode;
            toRemove.push(...ranges);
        });
        stripContainerlesss(node, ranges => {
            containerless = true;
            toRemove.push(...ranges);
        });
        stripBindable(node, (bs, ranges) => {
            Object.assign(bindables, bs);
            toRemove.push(...ranges);
        });
        stripAlias(node, (aliasArray, ranges) => {
            aliases.push(...aliasArray);
            toRemove.push(...ranges);
        });
        stripCapture(node, (ranges) => {
            capture = true;
            toRemove.push(...ranges);
        });
        if (node.tagName === 'slot') {
            hasSlot = true;
        }
    });
    let html = '';
    let lastIdx = 0;
    toRemove.sort((a, b) => a[0] - b[0]).forEach(([start, end]) => {
        html += rawHtml.slice(lastIdx, start);
        lastIdx = end;
    });
    html += rawHtml.slice(lastIdx);
    return { html, deps, depsAliases, shadowMode, containerless, hasSlot, bindables, aliases, capture };
}
function traverse(tree, cb) {
    tree.childNodes.forEach((n) => {
        var _a;
        const ne = n;
        if (ne.tagName === 'template' && ne.attrs.some(attr => attr.name === 'as-custom-element')) {
            return;
        }
        cb(ne);
        if (n.childNodes)
            traverse(n, cb);
        if ((_a = n.content) === null || _a === void 0 ? void 0 : _a.childNodes)
            traverse(n.content, cb);
    });
}
function stripTag(node, tagNames, cb) {
    if (!Array.isArray(tagNames))
        tagNames = [tagNames];
    if (tagNames.includes(node.tagName)) {
        const attrs = {};
        node.attrs.forEach(attr => attrs[attr.name] = attr.value);
        const loc = node.sourceCodeLocation;
        const toRemove = [];
        if (loc.endTag) {
            toRemove.push([loc.endTag.startOffset, loc.endTag.endOffset]);
        }
        toRemove.push([loc.startTag.startOffset, loc.startTag.endOffset]);
        cb(attrs, toRemove);
        return true;
    }
    return false;
}
function stripAttribute(node, tagName, attributeName, cb) {
    if (node.tagName === tagName) {
        const attr = node.attrs.find(a => a.name === attributeName);
        if (attr) {
            const loc = node.sourceCodeLocation;
            cb(attr.value, [[loc.attrs[attributeName].startOffset, loc.attrs[attributeName].endOffset]]);
            return true;
        }
    }
    return false;
}
function stripImport(node, cb) {
    return stripTag(node, ['import', 'require'], (attrs, ranges) => {
        const aliases = { __MAIN__: null };
        let aliasCount = 0;
        Object.keys(attrs).forEach(attr => {
            if (attr === 'from') {
                return;
            }
            if (attr === 'as') {
                aliases.__MAIN__ = attrs[attr];
                aliasCount++;
            }
            else if (attr.endsWith('.as')) {
                aliases[attr.slice(0, -3)] = attrs[attr];
                aliasCount++;
            }
        });
        cb(attrs.from, aliasCount > 0 ? aliases : null, ranges);
    });
}
function stripUseShadowDom(node, cb) {
    let mode = 'open';
    return stripTag(node, 'use-shadow-dom', (attrs, ranges) => {
        if (attrs.mode === 'closed')
            mode = 'closed';
        cb(mode, ranges);
    }) || stripAttribute(node, 'template', 'use-shadow-dom', (value, ranges) => {
        if (value === 'closed')
            mode = 'closed';
        cb(mode, ranges);
    });
}
function stripContainerlesss(node, cb) {
    return stripTag(node, 'containerless', (attrs, ranges) => {
        cb(ranges);
    }) || stripAttribute(node, 'template', 'containerless', (value, ranges) => {
        cb(ranges);
    });
}
function stripAlias(node, cb) {
    return stripTag(node, 'alias', (attrs, ranges) => {
        const { name } = attrs;
        let aliases = [];
        if (name) {
            aliases = name.split(',').map(s => s.trim()).filter(s => s);
        }
        cb(aliases, ranges);
    }) || stripAttribute(node, 'template', 'alias', (value, ranges) => {
        const aliases = value.split(',').map(s => s.trim()).filter(s => s);
        cb(aliases, ranges);
    });
}
function stripBindable(node, cb) {
    return stripTag(node, 'bindable', (attrs, ranges) => {
        const { name, mode, attribute } = attrs;
        const bindables = {};
        if (name) {
            const description = {};
            if (attribute)
                description.attribute = attribute;
            const bindingMode = toBindingMode(mode);
            if (bindingMode)
                description.mode = bindingMode;
            bindables[name] = description;
        }
        cb(bindables, ranges);
    }) || stripAttribute(node, 'template', 'bindable', (value, ranges) => {
        const bindables = {};
        const names = value.split(',').map(s => s.trim()).filter(s => s);
        names.forEach(name => bindables[name] = {});
        cb(bindables, ranges);
    });
}
function stripCapture(node, cb) {
    return stripTag(node, 'capture', (attrs, ranges) => {
        cb(ranges);
    }) || stripAttribute(node, 'template', 'capture', (value, ranges) => {
        cb(ranges);
    });
}
function toBindingMode(mode) {
    if (mode) {
        const normalizedMode = kebabCase(mode);
        if (normalizedMode === 'one-time')
            return BindingMode.oneTime;
        if (normalizedMode === 'one-way' || normalizedMode === 'to-view')
            return BindingMode.toView;
        if (normalizedMode === 'from-view')
            return BindingMode.fromView;
        if (normalizedMode === 'two-way')
            return BindingMode.twoWay;
    }
}

function resolveFilePath(unit, relativeOrAbsolutePath) {
    if (relativeOrAbsolutePath.startsWith('.')) {
        return path.resolve(unit.base || '', path.dirname(unit.path), relativeOrAbsolutePath);
    }
    else {
        return path.resolve(unit.base || '', relativeOrAbsolutePath);
    }
}
function fileExists(unit, relativeOrAbsolutePath) {
    const p = resolveFilePath(unit, relativeOrAbsolutePath);
    try {
        const stats = fs.statSync(p);
        return stats.isFile();
    }
    catch (e) {
        return false;
    }
}

function preprocessHtmlTemplate(unit, options, hasViewModel, _fileExists = fileExists) {
    const name = resourceName(unit.path);
    const stripped = stripMetaData(unit.contents);
    const { html, deps, depsAliases, containerless, hasSlot, bindables, aliases, capture } = stripped;
    let { shadowMode } = stripped;
    if (unit.filePair) {
        const basename = path.basename(unit.filePair, path.extname(unit.filePair));
        if (!deps.some(dep => options.cssExtensions.some(e => dep === `./${basename}${e}`))) {
            deps.unshift(`./${unit.filePair}`);
        }
    }
    if (options.defaultShadowOptions && shadowMode === null) {
        shadowMode = options.defaultShadowOptions.mode;
    }
    const useCSSModule = shadowMode !== null ? false : options.useCSSModule;
    const viewDeps = [];
    const cssDeps = [];
    const statements = [];
    let registrationImported = false;
    let aliasedModule = 0;
    deps.forEach((d, i) => {
        var _a, _b;
        const aliases = (_a = depsAliases[d]) !== null && _a !== void 0 ? _a : {};
        let ext = path.extname(d);
        if (!ext) {
            if (_fileExists(unit, `${d}.ts`)) {
                ext = '.ts';
            }
            else if (_fileExists(unit, `${d}.js`)) {
                ext = '.js';
            }
            d = d + ext;
        }
        if (!ext || ext === '.js' || ext === '.ts') {
            const { __MAIN__: main, ...others } = aliases;
            const hasAliases = main != null || Object.keys(others).length > 0;
            if (hasAliases && aliasedModule++ === 0) {
                statements.push(`import { aliasedResourcesRegistry as $$arr } from '@aurelia/kernel';\n`);
            }
            statements.push(`import * as d${i} from ${s(d)};\n`);
            if (hasAliases) {
                viewDeps.push(`$$arr(d${i}, ${s(main)}${Object.keys(others).length > 0 ? `, ${s(others)}` : ''})`);
            }
            else {
                viewDeps.push(`d${i}`);
            }
            return;
        }
        if (options.templateExtensions.includes(ext)) {
            const { __MAIN__: main } = aliases;
            const hasAliases = main != null;
            if (hasAliases && aliasedModule++ === 0) {
                statements.push(`import { aliasedResourcesRegistry as $$arr } from '@aurelia/kernel';\n`);
                statements.push(`function __get_el__(m) { let e; m.register({ register(el) { e = el; } }); return { default: e }; }\n`);
            }
            statements.push(`import * as d${i} from ${s(((_b = options.transformHtmlImportSpecifier) !== null && _b !== void 0 ? _b : (s => s))(d))};\n`);
            if (hasAliases) {
                viewDeps.push(`$$arr(__get_el__(d${i}), ${s(main)})`);
            }
            else {
                viewDeps.push(`d${i}`);
            }
            return;
        }
        if (options.cssExtensions.includes(ext)) {
            if (shadowMode !== null) {
                const stringModuleId = options.stringModuleWrap ? options.stringModuleWrap(d) : d;
                statements.push(`import d${i} from ${s(stringModuleId)};\n`);
                cssDeps.push(`d${i}`);
            }
            else if (useCSSModule) {
                statements.push(`import d${i} from ${s(d)};\n`);
                cssDeps.push(`d${i}`);
            }
            else {
                statements.push(`import ${s(d)};\n`);
            }
            return;
        }
        if (!registrationImported) {
            statements.push(`import { Registration } from '@aurelia/kernel';\n`);
            registrationImported = true;
        }
        statements.push(`import d${i} from ${s(d)};\n`);
        viewDeps.push(`Registration.defer('${ext}', d${i})`);
    });
    const m = modifyCode('', unit.path);
    const hmrEnabled = !hasViewModel && options.hmr && process.env.NODE_ENV !== 'production';
    m.append(`import { CustomElement } from '@aurelia/runtime-html';\n`);
    if (cssDeps.length > 0) {
        if (shadowMode !== null) {
            m.append(`import { shadowCSS } from '@aurelia/runtime-html';\n`);
            viewDeps.push(`shadowCSS(${cssDeps.join(', ')})`);
        }
        else if (useCSSModule) {
            m.append(`import { cssModules } from '@aurelia/runtime-html';\n`);
            viewDeps.push(`cssModules(${cssDeps.join(', ')})`);
        }
    }
    statements.forEach(st => m.append(st));
    m.append(`export const name = ${s(name)};
export const template = ${s(html)};
export default template;
export const dependencies = [ ${viewDeps.join(', ')} ];
`);
    if (shadowMode !== null) {
        m.append(`export const shadowOptions = { mode: '${shadowMode}' };\n`);
    }
    if (containerless) {
        m.append(`export const containerless = true;\n`);
    }
    if (capture) {
        m.append(`export const capture = true;\n`);
    }
    if (Object.keys(bindables).length > 0) {
        m.append(`export const bindables = ${JSON.stringify(bindables)};\n`);
    }
    if (aliases.length > 0) {
        m.append(`export const aliases = ${JSON.stringify(aliases)};\n`);
    }
    const definitionProperties = [
        'name',
        'template',
        'dependencies',
        shadowMode !== null ? 'shadowOptions' : '',
        containerless ? 'containerless' : '',
        capture ? 'capture' : '',
        Object.keys(bindables).length > 0 ? 'bindables' : '',
        aliases.length > 0 ? 'aliases' : '',
    ].filter(Boolean);
    const definition = `{ ${definitionProperties.join(', ')} }`;
    if (hmrEnabled) {
        m.append(`const _e = CustomElement.define(${definition});
      export function register(container) {
        container.register(_e);
      }`);
    }
    else {
        m.append(`let _e;
export function register(container) {
  if (!_e) {
    _e = CustomElement.define(${definition});
  }
  container.register(_e);
}
`);
    }
    if (hmrEnabled && options.getHmrCode) {
        m.append(options.getHmrCode('_e', options.hmrModule));
    }
    const { code, map } = m.transform();
    map.sourcesContent = [unit.contents];
    return { code, map };
}
function s(input) {
    return JSON.stringify(input);
}

const defaultCssExtensions = ['.css', '.scss', '.sass', '.less', '.styl'];
const defaultJsExtensions = ['.js', '.jsx', '.ts', '.tsx', '.coffee'];
const defaultTemplateExtensions = ['.html', '.md', '.pug', '.haml', '.jade', '.slim', '.slm'];
function preprocessOptions(options = {}) {
    const { cssExtensions = [], jsExtensions = [], templateExtensions = [], useCSSModule = false, hmr = true, enableConventions = true, hmrModule = 'module', ...others } = options;
    return {
        cssExtensions: Array.from(new Set([...defaultCssExtensions, ...cssExtensions])).sort(),
        jsExtensions: Array.from(new Set([...defaultJsExtensions, ...jsExtensions])).sort(),
        templateExtensions: Array.from(new Set([...defaultTemplateExtensions, ...templateExtensions])).sort(),
        useCSSModule,
        hmr,
        hmrModule,
        enableConventions,
        ...others
    };
}

function preprocess(unit, options, _fileExists = fileExists) {
    const ext = path.extname(unit.path);
    const basename = path.basename(unit.path, ext);
    const allOptions = preprocessOptions(options);
    if (allOptions.enableConventions && allOptions.templateExtensions.includes(ext)) {
        const possibleFilePair = allOptions.cssExtensions.map(e => `${basename}${e}`);
        const filePair = possibleFilePair.find(p => _fileExists(unit, `./${p}`));
        if (filePair) {
            if (allOptions.useProcessedFilePairFilename) {
                unit.filePair = `${basename}.css`;
            }
            else {
                unit.filePair = filePair;
            }
        }
        const hasViewModel = Boolean(allOptions.jsExtensions.map(e => `${basename}${e}`).find(p => _fileExists(unit, `./${p}`)));
        return preprocessHtmlTemplate(unit, allOptions, hasViewModel, _fileExists);
    }
    else if (allOptions.jsExtensions.includes(ext)) {
        const possibleFilePair = allOptions.templateExtensions.map(e => `${basename}${e}`);
        const filePair = possibleFilePair.find(p => _fileExists(unit, `./${p}`));
        if (filePair) {
            if (allOptions.useProcessedFilePairFilename) {
                unit.filePair = `${basename}.html`;
            }
            else {
                unit.filePair = filePair;
            }
        }
        else {
            const possibleViewPair = allOptions.templateExtensions.map(e => `${basename}-view${e}`);
            const viewPair = possibleViewPair.find(p => _fileExists(unit, `./${p}`));
            if (viewPair) {
                unit.isViewPair = true;
                if (allOptions.useProcessedFilePairFilename) {
                    unit.filePair = `${basename}-view.html`;
                }
                else {
                    unit.filePair = viewPair;
                }
            }
        }
        return preprocessResource(unit, allOptions);
    }
}

export { defaultCssExtensions, defaultJsExtensions, defaultTemplateExtensions, nameConvention, preprocess, preprocessHtmlTemplate, preprocessOptions, preprocessResource, resourceName, stripMetaData };
//# sourceMappingURL=index.mjs.map
