var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { I18N, I18nConfiguration, Signals } from '@aurelia/i18n';
import { ISignaler } from '@aurelia/runtime';
import { Aurelia, bindable, customElement, IPlatform } from '@aurelia/runtime-html';
import { assert, PLATFORM, TestContext } from '@aurelia/testing';
import { createSpecFunction } from '../../util.js';
describe('i18n/t/translation-integration.spec.ts', function () {
    let CustomMessage = class CustomMessage {
    };
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], CustomMessage.prototype, "message", void 0);
    CustomMessage = __decorate([
        customElement({ name: 'custom-message', template: `<div>\${message}</div>` })
    ], CustomMessage);
    let CeWithCamelCaseBindable = class CeWithCamelCaseBindable {
    };
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], CeWithCamelCaseBindable.prototype, "someMessage", void 0);
    CeWithCamelCaseBindable = __decorate([
        customElement({ name: 'camel-ce', template: `<div>\${someMessage}</div>` })
    ], CeWithCamelCaseBindable);
    let FooBar = class FooBar {
    };
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], FooBar.prototype, "status", void 0);
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], FooBar.prototype, "date", void 0);
    FooBar = __decorate([
        customElement({ name: 'foo-bar', template: `<au-slot><span t="status" t-params.bind="{context: status, date: date}"></span></au-slot>` })
    ], FooBar);
    class I18nIntegrationTestContext {
        constructor(en, de, ctx, au, i18n, host, error) {
            this.en = en;
            this.de = de;
            this.ctx = ctx;
            this.au = au;
            this.i18n = i18n;
            this.host = host;
            this.error = error;
            this.container = au.container;
        }
        get app() {
            return this.au.root.controller.viewModel;
        }
        get platform() {
            return this.container.get(IPlatform);
        }
        async teardown() {
            if (this.error === null) {
                await this.au.stop();
            }
        }
    }
    async function runTest(testFunction, { component, aliases, skipTranslationOnMissingKey = false }) {
        const translation = {
            simple: {
                text: 'simple text',
                attr: 'simple attribute'
            },
            status: 'status is unknown',
            status_dispatched: 'dispatched on {{date}}',
            status_delivered: 'delivered on {{date}}',
            custom_interpolation_brace: 'delivered on {date}',
            custom_interpolation_es6_syntax: `delivered on \${date}`,
            interpolation_greeting: 'hello {{name}}',
            itemWithCount: '{{count}} item',
            itemWithCount_plural: '{{count}} items',
            html: 'this is a <i>HTML</i> content',
            pre: 'tic ',
            preHtml: '<b>tic</b><span>foo</span> ',
            mid: 'tac',
            midHtml: '<i>tac</i>',
            post: ' toe',
            postHtml: ' <b>toe</b><span>bar</span>',
            imgPath: 'foo.jpg'
        };
        const deTranslation = {
            simple: {
                text: 'Einfacher Text',
                attr: 'Einfaches Attribut'
            },
            status: 'Status ist unbekannt',
            status_dispatched: 'Versand am {{date}}',
            status_delivered: 'geliefert am {{date}}',
            custom_interpolation_brace: 'geliefert am {date}',
            custom_interpolation_es6_syntax: `geliefert am \${date}`,
            interpolation_greeting: 'Hallo {{name}}',
            itemWithCount: '{{count}} Artikel',
            itemWithCount_plural: '{{count}} Artikel',
            itemWithCount_interval: '(0)$t(itemWithCount_plural);(1)$t(itemWithCount);(2-7)$t(itemWithCount_plural);(7-inf){viele Artikel};',
            html: 'Dies ist ein <i>HTML</i> Inhalt',
            pre: 'Tic ',
            mid: 'Tac',
            midHtml: '<i>Tac</i>',
            post: ' Toe',
            imgPath: 'bar.jpg'
        };
        const ctx = TestContext.create();
        const host = PLATFORM.document.createElement('app');
        const au = new Aurelia(ctx.container).register(I18nConfiguration.customize((config) => {
            config.initOptions = {
                resources: { en: { translation }, de: { translation: deTranslation } },
                skipTranslationOnMissingKey
            };
            config.translationAttributeAliases = aliases;
        }));
        const i18n = au.container.get(I18N);
        let error = null;
        try {
            await au
                .register(CustomMessage, CeWithCamelCaseBindable, FooBar)
                .app({ host, component })
                .start();
            await i18n.setLocale('en');
        }
        catch (e) {
            error = e;
        }
        const testContext = new I18nIntegrationTestContext(translation, deTranslation, ctx, au, i18n, host, error);
        await testFunction(testContext);
        await testContext.teardown();
    }
    const $it = createSpecFunction(runTest);
    function assertTextContent(host, selector, translation, message) {
        assert.equal(host.querySelector(selector).textContent, translation, message);
    }
    {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span t='simple.text'></span>` })
        ], App);
        $it('works for simple string literal key', function ({ host, en: translation }) {
            assertTextContent(host, 'span', translation.simple.text);
        }, { component: App });
    }
    {
        let App = class App {
            constructor() {
                this.nullul = null;
                this.undef = undefined;
                // private readonly zero: 0 = 0;
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                template: `<p t.bind="undef" id="undefined">
        Undefined value
      </p>
      <p t.bind="nullul" id="null">
        Null value
      </p>`,
            })
        ], App);
        $it('works for null/undefined bound values', function ({ host }) {
            assertTextContent(host, '#undefined', '');
            assertTextContent(host, '#null', '');
        }, { component: App });
    }
    {
        let App = class App {
            constructor() {
                this.nullul = null;
                this.undef = undefined;
                // private readonly zero: 0 = 0;
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                template: `<p t.bind="undef" id="undefined" t-params.bind="{defaultValue:'foo'}">
      Undefined value
    </p>
    <p t.bind="nullul" id="null" t-params.bind="{defaultValue:'bar'}">
      Null value
    </p>`,
            })
        ], App);
        $it('works for null/undefined bound values - default value', function ({ host }) {
            assertTextContent(host, '#undefined', 'foo');
            assertTextContent(host, '#null', 'bar');
        }, { component: App });
    }
    {
        let App = class App {
            constructor() {
                this.nullul = 'simple.text';
                this.undef = 'simple.text';
            }
            changeKey() {
                this.nullul = null;
                this.undef = undefined;
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                template: `<p t.bind="undef" id="undefined">
      Undefined value
    </p>
    <p t.bind="nullul" id="null">
      Null value
    </p>`,
            })
        ], App);
        $it('works if the keyExpression is changed to null/undefined', function ({ host, app, ctx }) {
            app.changeKey();
            assertTextContent(host, '#undefined', 'simple text', 'changeKey(), before flush');
            assertTextContent(host, '#null', 'simple text', 'changeKey, before flush');
            ctx.platform.domWriteQueue.flush();
            assertTextContent(host, '#undefined', '', 'changeKey() & flush');
            assertTextContent(host, '#null', '', 'changeKey() & flush');
            ctx.platform.domWriteQueue.flush();
            assertTextContent(host, '#undefined', '', 'changeKey() & 2nd flush');
            assertTextContent(host, '#null', '', 'changeKey() & 2nd flush');
        }, { component: App });
    }
    {
        let App = class App {
            constructor() {
                this.nullul = 'simple.text';
                this.undef = 'simple.text';
            }
            changeKey() {
                this.nullul = null;
                this.undef = undefined;
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                template: `<p t.bind="undef" id="undefined" t-params.bind="{defaultValue:'foo'}">
        Undefined value
      </p>
      <p t.bind="nullul" id="null" t-params.bind="{defaultValue:'bar'}">
        Null value
      </p>`,
            })
        ], App);
        $it('works if the keyExpression is changed to null/undefined - default value', function ({ host, app, ctx }) {
            app.changeKey();
            assertTextContent(host, '#undefined', 'simple text', 'changeKey(), before flush');
            assertTextContent(host, '#null', 'simple text', 'changeKey, before flush');
            ctx.platform.domWriteQueue.flush();
            assertTextContent(host, '#undefined', 'foo');
            assertTextContent(host, '#null', 'bar');
        }, { component: App });
    }
    for (const value of [true, false, 0]) {
        let App = class App {
            constructor() {
                this.key = value;
            }
        };
        App = __decorate([
            customElement({ name: 'app', template: `<p t.bind="key" id="undefined"></p>` })
        ], App);
        $it(`throws error if the key expression is evaluated to ${value}`, function ({ error }) {
            assert.match(error?.message, new RegExp(`Expected the i18n key to be a string, but got ${value} of type (boolean|number)`));
        }, { component: App });
    }
    for (const value of [true, false, 0]) {
        let App = class App {
            constructor() {
                this.key = 'simple.text';
            }
            changeKey() {
                this.key = value;
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                template: `<p t.bind="key" id="undefined"></p>`,
            })
        ], App);
        $it(`throws error if the key expression is changed to ${value}`, function ({ app }) {
            try {
                app.changeKey();
            }
            catch (e) {
                assert.match(e.message, new RegExp(`Expected the i18n key to be a string, but got ${value} of type (boolean|number)`));
            }
        }, { component: App });
    }
    {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span t='simple.text' t='simple.attr'></span>` })
        ], App);
        $it('with multiple `t` attribute only the first one is considered', function ({ host, en: translation }) {
            assertTextContent(host, 'span', translation.simple.text);
        }, { component: App });
    }
    {
        let App = class App {
            constructor() {
                this.key = 'simple.text';
            }
        };
        App = __decorate([
            customElement({
                name: 'app', template: `
    <span id='t' t='simple.text'></span>
    <span id='i18n' i18n='simple.text'></span>
    <span id='i18n-bind' i18n.bind='key'></span>
    `
            })
        ], App);
        $it('works with aliases', function ({ host, en: translation }) {
            assertTextContent(host, 'span#t', translation.simple.text);
            assertTextContent(host, 'span#i18n', translation.simple.text);
            assertTextContent(host, 'span#i18n-bind', translation.simple.text);
        }, { component: App, aliases: ['t', 'i18n'] });
    }
    {
        let App = class App {
            constructor() {
                this.obj = { key: 'simple.text' };
            }
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span t.bind='obj.key'></span>` })
        ], App);
        $it('works for bound key', function ({ host, en: translation }) {
            assertTextContent(host, 'span', translation.simple.text);
        }, { component: App });
    }
    describe('translation can be manipulated by using t-params', function () {
        {
            let App = class App {
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span t-params.bind="{context: 'dispatched'}"></span>` })
            ], App);
            $it('throws error if used without `t` attribute', function ({ error }) {
                assert.equal(error?.message, 'key expression is missing');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dispatchedOn = new Date(2020, 1, 10, 5, 15);
                    this.deliveredOn = new Date(2021, 1, 10, 5, 15);
                    this.tParams = { context: 'dispatched', date: this.dispatchedOn };
                    this.name = 'john';
                    this.nameParams = { name: this.name };
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `
    <span id="i18n-ctx-vm" t="status" t-params.bind="tParams"></span><br>
    <span id="i18n-ctx-dispatched" t="status" t-params.bind="{context: 'dispatched', date: dispatchedOn}"></span><br>
    <span id="i18n-ctx-delivered" t="status" t-params.bind="{context: 'delivered', date: deliveredOn}"></span><br>

    <span id="i18n-interpolation" t="status_delivered" t-params.bind="{date: deliveredOn}"></span>
    <span id="i18n-interpolation-custom" t="custom_interpolation_brace" t-params.bind="{date: deliveredOn, interpolation: { prefix: '{', suffix: '}' }}"></span>
    <span id="i18n-interpolation-es6" t="custom_interpolation_es6_syntax" t-params.bind="{date: deliveredOn, interpolation: { prefix: '\${', suffix: '}' }}"></span>
    <span id="i18n-interpolation-string-direct" t="interpolation_greeting" t-params.bind="nameParams"></span>
    <span id="i18n-interpolation-string-obj" t="interpolation_greeting" t-params.bind="{name: name}"></span>

    <span id="i18n-items-plural-0"  t="itemWithCount" t-params.bind="{count: 0}"></span>
    <span id="i18n-items-plural-1"  t="itemWithCount" t-params.bind="{count: 1}"></span>
    <span id="i18n-items-plural-10" t="itemWithCount" t-params.bind="{count: 10}"></span>`
                })
            ], App);
            $it('works when a vm property is bound as t-params', function ({ host, en: translation, app }) {
                assertTextContent(host, '#i18n-ctx-vm', translation.status_dispatched.replace('{{date}}', app.dispatchedOn.toString()));
            }, { component: App });
            $it('works when a vm property is bound as t-params and changes', function ({ host, en: translation, app, ctx }) {
                const currDate = app.dispatchedOn;
                assertTextContent(host, '#i18n-ctx-vm', translation.status_dispatched.replace('{{date}}', currDate.toString()), 'before change t-params');
                app.tParams = { context: 'dispatched', date: new Date(2020, 2, 10, 5, 15) };
                assertTextContent(host, '#i18n-ctx-vm', translation.status_dispatched.replace('{{date}}', currDate.toString()), 'after change t-params, before flush');
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, '#i18n-ctx-vm', translation.status_dispatched.replace('{{date}}', app.tParams.date.toString()), 'after change t-params & flush');
            }, { component: App });
            $it('works for context-sensitive translations', function ({ host, en: translation, app }) {
                assertTextContent(host, '#i18n-ctx-dispatched', translation.status_dispatched.replace('{{date}}', app.dispatchedOn.toString()));
                assertTextContent(host, '#i18n-ctx-delivered', translation.status_delivered.replace('{{date}}', app.deliveredOn.toString()));
            }, { component: App });
            $it('works for interpolation, including custom marker for interpolation placeholder', function ({ host, en: translation, app }) {
                assertTextContent(host, '#i18n-interpolation', translation.status_delivered.replace('{{date}}', app.deliveredOn.toString()));
                assertTextContent(host, '#i18n-interpolation-custom', translation.custom_interpolation_brace.replace('{date}', app.deliveredOn.toString()));
                assertTextContent(host, '#i18n-interpolation-es6', translation.custom_interpolation_es6_syntax.replace(`\${date}`, app.deliveredOn.toString()));
            }, { component: App });
            $it('works for interpolation when the interpolation changes', function ({ host, en: translation, app, ctx }) {
                const currDate = app.deliveredOn;
                assertTextContent(host, '#i18n-interpolation', translation.status_delivered.replace('{{date}}', currDate.toString()), 'before change');
                app.deliveredOn = new Date(2022, 1, 10, 5, 15);
                assertTextContent(host, '#i18n-interpolation', translation.status_delivered.replace('{{date}}', currDate.toString()), 'after change, before flush');
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, '#i18n-interpolation', translation.status_delivered.replace('{{date}}', app.deliveredOn.toString()));
            }, { component: App });
            $it('works for interpolation when a string changes', function ({ ctx, host, en: translation, app }) {
                assertTextContent(host, '#i18n-interpolation-string-direct', translation.interpolation_greeting.replace('{{name}}', app.name));
                assertTextContent(host, '#i18n-interpolation-string-obj', translation.interpolation_greeting.replace('{{name}}', app.name));
                const currName = app.name;
                app.name = 'Jane';
                app.nameParams = { name: 'Jane' };
                assertTextContent(host, '#i18n-interpolation-string-direct', translation.interpolation_greeting.replace('{{name}}', currName));
                assertTextContent(host, '#i18n-interpolation-string-obj', translation.interpolation_greeting.replace('{{name}}', currName));
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, '#i18n-interpolation-string-direct', translation.interpolation_greeting.replace('{{name}}', 'Jane'));
                assertTextContent(host, '#i18n-interpolation-string-obj', translation.interpolation_greeting.replace('{{name}}', 'Jane'));
            }, { component: App });
            $it('works for pluralization', function ({ host }) {
                assertTextContent(host, '#i18n-items-plural-0', '0 items');
                assertTextContent(host, '#i18n-items-plural-1', '1 item');
                assertTextContent(host, '#i18n-items-plural-10', '10 items');
            }, { component: App });
        }
    });
    {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<img t='imgPath'></img>` })
        ], App);
        $it('`src` attribute of img element is translated by default', function ({ host, en: translation }) {
            assert.equal(host.querySelector('img').src.endsWith(translation.imgPath), true);
        }, { component: App });
    }
    {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span t='[title]simple.attr'></span>` })
        ], App);
        $it('can translate attributes - t=\'[title]simple.attr\'', function ({ host, en: translation }) {
            assertTextContent(host, `span[title='${translation.simple.attr}']`, '');
        }, { component: App });
    }
    {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span t='[title]simple.attr;[title]simple.text'></span>` })
        ], App);
        $it('value of last key takes effect if multiple keys target same attribute - t=\'[title]simple.attr;[title]simple.text\'', function ({ host, en: translation }) {
            assertTextContent(host, `span[title='${translation.simple.text}']`, '');
        }, { component: App });
    }
    {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span t='[title]simple.attr;simple.text'></span>` })
        ], App);
        $it('works for a mixture of attribute targeted key and textContent targeted key - t=\'[title]simple.attr;simple.text\'', function ({ host, en: translation }) {
            assertTextContent(host, `span[title='${translation.simple.attr}']`, translation.simple.text);
        }, { component: App });
    }
    {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span t='[title,data-foo]simple.attr;simple.text'></span>` })
        ], App);
        $it('works when multiple attributes are targeted by the same key - `t="[title,data-foo]simple.attr;simple.text"`', function ({ host, en: translation }) {
            assertTextContent(host, `span[title='${translation.simple.attr}'][data-foo='${translation.simple.attr}']`, translation.simple.text);
        }, { component: App });
    }
    {
        let App = class App {
            constructor() {
                this.obj = { key1: 'simple.text', key2: 'simple.attr' };
                this.status = 'dispatched';
            }
        };
        App = __decorate([
            customElement({
                name: 'app', template: `
    <span id='a' t='\${obj.key1}'></span>
    <span id='b' t='[title]\${obj.key2};simple.text'></span>
    <span id='c' t='[title]\${obj.key2};\${obj.key1}'></span>
    <span id='d' t='status_\${status}'></span>
    `
            })
        ], App);
        $it(`works for interpolated keys are used - t="\${obj.key1}"`, function ({ host, en: translation }) {
            assertTextContent(host, `span#a`, translation.simple.text);
            assertTextContent(host, `span#b[title='${translation.simple.attr}']`, translation.simple.text);
            assertTextContent(host, `span#c[title='${translation.simple.attr}']`, translation.simple.text);
            assertTextContent(host, `span#d`, 'dispatched on ');
        }, { component: App });
    }
    {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span t="$t(simple.text) $t(simple.attr)"></span>` })
        ], App);
        $it('works nested key - t="$t(simple.text) $t(simple.attr)"', function ({ host, en: translation }) {
            assertTextContent(host, `span`, `${translation.simple.text} ${translation.simple.attr}`);
        }, { component: App });
    }
    {
        let App = class App {
            constructor() {
                this.part = 'text';
            }
        };
        App = __decorate([
            customElement({
                name: 'app', template: `
    <span id='a' t.bind='"simple."+"text"'></span>
    <span id='b' t.bind='"simple."+part'></span>
    `
            })
        ], App);
        $it('works for explicit concatenation expression as key - `t.bind="string+string"`', function ({ host, en: translation }) {
            assertTextContent(host, `span#a`, translation.simple.text);
            assertTextContent(host, `span#b`, translation.simple.text);
        }, { component: App });
    }
    {
        let App = class App {
        };
        App = __decorate([
            customElement({
                name: 'app', template: `<span id='a' t='[text]simple.text'></span>`
            })
        ], App);
        $it('works for textContent replacement with explicit [text] attribute - `t="[text]key"`', function ({ host, en: translation }) {
            assertTextContent(host, 'span', translation.simple.text);
        }, { component: App });
    }
    {
        let App = class App {
        };
        App = __decorate([
            customElement({
                name: 'app', template: `<span id='a' t='[html]html'></span>`
            })
        ], App);
        $it('works for innerHTML replacement - `t="[html]key"`', function ({ host, en: translation }) {
            assert.equal(host.querySelector('span').innerHTML, translation.html);
        }, { component: App });
    }
    describe('prepends/appends the translated value to the element content - `t="[prepend]key1;[append]key2"`', function () {
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[prepend]pre'>tac</span>`
                })
            ], App);
            $it('works for [prepend] only', function ({ host }) {
                assertTextContent(host, 'span', 'tic tac');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[prepend]pre;mid'></span>`
                })
            ], App);
            $it('works for [prepend] + textContent', function ({ host }) {
                assertTextContent(host, 'span', 'tic tac');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[prepend]pre;[html]midHtml'></span>`
                })
            ], App);
            $it('works for [prepend] + html', function ({ host }) {
                assert.equal(host.querySelector('span').innerHTML, 'tic <i>tac</i>');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[prepend]preHtml;[html]mid'></span>`
                })
            ], App);
            $it('works for html content for [prepend] + textContent', function ({ host }) {
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> tac');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[prepend]preHtml;[html]midHtml'></span>`
                })
            ], App);
            $it('works for html content for [prepend] + innerHtml', function ({ host }) {
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> <i>tac</i>');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[append]post'>tac</span>`
                })
            ], App);
            $it('works for [append] only', function ({ host }) {
                assertTextContent(host, 'span', 'tac toe');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[append]post;mid'></span>`
                })
            ], App);
            $it('works for [append] + textContent', function ({ host }) {
                assertTextContent(host, 'span', 'tac toe');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[append]post;[html]midHtml'></span>`
                })
            ], App);
            $it('works for [append] + html', function ({ host }) {
                assert.equal(host.querySelector('span').innerHTML, '<i>tac</i> toe');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[append]postHtml;[html]mid'></span>`
                })
            ], App);
            $it('works for html content for [append] + textContent', function ({ host }) {
                assert.equal(host.querySelector('span').innerHTML, 'tac <b>toe</b><span>bar</span>');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[append]postHtml;[html]midHtml'></span>`
                })
            ], App);
            $it('works for html content for [append]', function ({ host }) {
                assert.equal(host.querySelector('span').innerHTML, '<i>tac</i> <b>toe</b><span>bar</span>');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[prepend]pre;[append]post'>tac</span>`
                })
            ], App);
            $it('works for [prepend] and [append]', function ({ host }) {
                assertTextContent(host, 'span', 'tic tac toe');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[prepend]pre;[append]post;mid'></span>`
                })
            ], App);
            $it('works for [prepend] + [append] + textContent', function ({ host }) {
                assertTextContent(host, 'span', 'tic tac toe');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[prepend]pre;[append]post;[html]midHtml'></span>`
                })
            ], App);
            $it('works for [prepend] + [append] + innerHtml', function ({ host }) {
                assert.equal(host.querySelector('span').innerHTML, 'tic <i>tac</i> toe');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[prepend]preHtml;[append]postHtml;mid'></span>`
                })
            ], App);
            $it('works for html resource for [prepend] and [append] + textContent', function ({ host }) {
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> tac <b>toe</b><span>bar</span>');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='[prepend]preHtml;[append]postHtml;[html]midHtml'></span>`
                })
            ], App);
            $it('works for html resource for [prepend] and [append] + innerHtml', function ({ host }) {
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> <i>tac</i> <b>toe</b><span>bar</span>');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.keyExpr = '[prepend]preHtml;[append]postHtml';
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t.bind='keyExpr'>tac</span>`
                })
            ], App);
            $it('works correctly for html with the change of both [prepend], and [append] - textContent', function ({ host, app, platform }) {
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> tac <b>toe</b><span>bar</span>');
                app.keyExpr = '[prepend]pre;[append]post';
                platform.domWriteQueue.flush();
                assert.equal(host.querySelector('span').innerHTML, 'tic tac toe');
                app.keyExpr = '[prepend]preHtml;[append]postHtml';
                platform.domWriteQueue.flush();
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> tac <b>toe</b><span>bar</span>');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.keyExpr = '[prepend]pre;[append]post';
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t.bind='keyExpr'>tac</span>`
                })
            ], App);
            $it('works correctly with the change of both [prepend], and [append] - textContent', function ({ host, app, platform }) {
                assert.equal(host.querySelector('span').innerHTML, 'tic tac toe');
                app.keyExpr = '[prepend]preHtml;[append]postHtml';
                platform.domWriteQueue.flush();
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> tac <b>toe</b><span>bar</span>');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.keyExpr = '[prepend]preHtml;[append]postHtml';
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t.bind='keyExpr'>tac</span>`
                })
            ], App);
            $it('works correctly with the removal of [append]', function ({ host, app, platform }) {
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> tac <b>toe</b><span>bar</span>');
                app.keyExpr = '[prepend]preHtml';
                platform.domWriteQueue.flush();
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> tac');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.keyExpr = '[prepend]preHtml;[append]postHtml';
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t.bind='keyExpr'>tac</span>`
                })
            ], App);
            $it('works correctly with the removal of [prepend]', function ({ host, app, platform }) {
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> tac <b>toe</b><span>bar</span>');
                app.keyExpr = '[append]postHtml';
                platform.domWriteQueue.flush();
                assert.equal(host.querySelector('span').innerHTML, 'tac <b>toe</b><span>bar</span>');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.keyExpr = '[prepend]preHtml;[append]postHtml';
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t.bind='keyExpr'>tac</span>`
                })
            ], App);
            $it('works correctly with the removal of both [prepend] and [append]', function ({ host, app, platform }) {
                assert.equal(host.querySelector('span').innerHTML, '<b>tic</b><span>foo</span> tac <b>toe</b><span>bar</span>');
                app.keyExpr = '[html]midHtml';
                platform.domWriteQueue.flush();
                assert.equal(host.querySelector('span').innerHTML, '<i>tac</i>');
            }, { component: App });
        }
    });
    describe('updates translation', function () {
        {
            let App = class App {
                constructor() {
                    this.obj = { key: 'simple.text' };
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='\${obj.key}'></span>`
                })
            ], App);
            $it('when the key expression changed - interpolation', function ({ host, en: translation, app, ctx }) {
                app.obj.key = 'simple.attr';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `span`, translation.simple.attr);
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.obj = { base: 'simple.', key: 'text' };
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t='\${obj.base}\${obj.key}'></span>`
                })
            ], App);
            $it('when the key expression changed - multi-interpolation', function ({ ctx, host, en: translation, app }) {
                const currText = translation.simple.text;
                assertTextContent(host, `span`, currText);
                app.obj.base = 'simple';
                app.obj.key = '.attr';
                assertTextContent(host, `span`, currText);
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `span`, translation.simple.attr);
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.obj = { key: 'simple.text' };
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t.bind='obj.key'></span>`
                })
            ], App);
            $it('when the key expression changed - access-member', function ({ ctx, host, en: translation, app }) {
                app.obj.key = 'simple.attr';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `span`, translation.simple.attr);
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.key = 'simple.text';
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t.bind='key'></span>`
                })
            ], App);
            $it('when the key expression changed - property', function ({ ctx, host, en: translation, app }) {
                app.key = 'simple.attr';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `span`, translation.simple.attr);
                app.key = 'simple.text';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `span`, translation.simple.text);
                app.key = 'simple.attr';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `span`, translation.simple.attr);
            }, { component: App });
        }
        {
            let MyCe = class MyCe {
            };
            __decorate([
                bindable,
                __metadata("design:type", String)
            ], MyCe.prototype, "value", void 0);
            MyCe = __decorate([
                customElement({ name: 'my-ce', template: '${value}' })
            ], MyCe);
            let App = class App {
                constructor() {
                    this.key = 'simple.text';
                }
            };
            App = __decorate([
                customElement({
                    name: 'app',
                    template: `<my-ce t.bind='"[value]"+key'></my-ce>`,
                    dependencies: [MyCe]
                })
            ], App);
            $it('when the key expression changed - property - custom element', function ({ ctx, host, en: translation, app }) {
                app.key = 'simple.attr';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `my-ce`, translation.simple.attr);
                app.key = 'simple.text';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `my-ce`, translation.simple.text);
                app.key = 'simple.attr';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `my-ce`, translation.simple.attr);
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.key = 'simple.text';
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t.bind='"[data-foo]"+key'></span>`
                })
            ], App);
            $it('when the key expression changed - property - DOM Element attribute', function ({ ctx, host, en: translation, app }) {
                const span = host.querySelector('span');
                assert.strictEqual(span.dataset.foo, translation.simple.text);
                app.key = 'simple.attr';
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(span.dataset.foo, translation.simple.attr);
                app.key = 'simple.text';
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(span.dataset.foo, translation.simple.text);
                app.key = 'simple.attr';
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(span.dataset.foo, translation.simple.attr);
            }, { component: App });
        }
        {
            let MyCe = class MyCe {
            };
            __decorate([
                bindable,
                __metadata("design:type", String)
            ], MyCe.prototype, "foo", void 0);
            __decorate([
                bindable,
                __metadata("design:type", String)
            ], MyCe.prototype, "bar", void 0);
            MyCe = __decorate([
                customElement({ name: 'my-ce', template: '${foo} ${bar}' })
            ], MyCe);
            let App = class App {
                constructor() {
                    this.key1 = 'simple.text';
                    this.key2 = 'simple.attr';
                }
            };
            App = __decorate([
                customElement({
                    name: 'app',
                    template: `<my-ce t.bind='"[foo]"+key1+";[bar]"+key2'></my-ce>`,
                    dependencies: [MyCe]
                })
            ], App);
            $it('when the key expression changed - property - custom element - multiple bindables', function ({ ctx, host, en: translation, app }) {
                const r = translation.simple;
                assertTextContent(host, `my-ce`, `${r.text} ${r.attr}`);
                app.key1 = 'simple.attr';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `my-ce`, `${r.attr} ${r.attr}`);
                app.key2 = 'simple.text';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `my-ce`, `${r.attr} ${r.text}`);
                app.key1 = 'simple.text';
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `my-ce`, `${r.text} ${r.text}`);
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.key1 = 'simple.text';
                    this.key2 = 'simple.attr';
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t.bind='"[data-foo]"+key1+";[bar]"+key2'></span>`
                })
            ], App);
            $it('when the key expression changed - property - multiple DOM Element attributes', function ({ ctx, host, en: translation, app }) {
                const r = translation.simple;
                const span = host.querySelector('span');
                assert.strictEqual(span.dataset.foo, r.text);
                assert.strictEqual(span.bar, r.attr);
                app.key1 = 'simple.attr';
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(span.dataset.foo, r.attr);
                assert.strictEqual(span.bar, r.attr);
                app.key2 = 'simple.text';
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(span.dataset.foo, r.attr);
                assert.strictEqual(span.bar, r.text);
                app.key1 = 'simple.text';
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(span.dataset.foo, translation.simple.text);
                assert.strictEqual(span.bar, r.text);
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.deliveredOn = new Date(2021, 1, 10, 5, 15);
                    this.params = { context: 'delivered', date: this.deliveredOn };
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span t="status" t-params.bind="params"></span>`
                })
            ], App);
            $it('when the translation parameters changed', function ({ ctx, host, en: translation, app }) {
                app.params = { ...app.params, context: 'dispatched' };
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, `span`, translation.status_dispatched.replace('{{date}}', app.deliveredOn.toString()));
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<span id='a' t='simple.text'></span>`
                })
            ], App);
            $it('when the locale is changed', async function ({ ctx, host, de, i18n }) {
                await i18n.setLocale('de');
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, 'span', de.simple.text);
            }, { component: App });
        }
    });
    describe('works with custom elements', function () {
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<custom-message t="[message]simple.text"></custom-message>`
                })
            ], App);
            $it('can bind to custom elements attributes', function ({ host, en }) {
                assertTextContent(host, 'custom-message div', en.simple.text);
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.count = 0;
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<custom-message component.ref="cm" t="[message]itemWithCount" t-params.bind="{count}">`
                })
            ], App);
            $it('should support params', function ({ app, host, en, ctx }) {
                assertTextContent(host, 'custom-message div', en.itemWithCount_plural.replace('{{count}}', '0'));
                app.count = 10;
                assert.strictEqual(app.cm.message, en.itemWithCount_plural.replace('{{count}}', '10'), '<CustomMessage/> message prop should have been updated immediately');
                assertTextContent(host, 'custom-message div', en.itemWithCount_plural.replace('{{count}}', '0'));
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, 'custom-message div', en.itemWithCount_plural.replace('{{count}}', '10'));
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<custom-message t="[message]simple.text"></custom-message>`
                })
            ], App);
            $it('should support locale changes', async function ({ host, de, i18n, platform }) {
                await i18n.setLocale('de');
                platform.domWriteQueue.flush();
                assertTextContent(host, 'custom-message div', de.simple.text);
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<camel-ce some-message="ignored" t="[some-message]simple.text"></camel-ce>`
                })
            ], App);
            $it('can bind to custom elements attributes with camelCased bindable', function ({ host, en }) {
                assertTextContent(host, 'camel-ce div', en.simple.text);
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.count = 0;
                }
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<camel-ce component.ref="cm" t="[some-message]itemWithCount" t-params.bind="{count}">`
                })
            ], App);
            $it('should support params', function ({ app, host, en, ctx }) {
                assertTextContent(host, 'camel-ce div', en.itemWithCount_plural.replace('{{count}}', '0'));
                app.count = 10;
                assert.strictEqual(app.cm.someMessage, en.itemWithCount_plural.replace('{{count}}', '10'), '<camel-ce/> message prop should have been updated immediately');
                assertTextContent(host, 'camel-ce div', en.itemWithCount_plural.replace('{{count}}', '0'));
                ctx.platform.domWriteQueue.flush();
                assertTextContent(host, 'camel-ce div', en.itemWithCount_plural.replace('{{count}}', '10'));
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `<camel-ce some-message="ignored" t="[some-message]simple.text"></camel-ce>`
                })
            ], App);
            $it('should support locale changes with camelCased bindable', async function ({ host, de, i18n, platform }) {
                await i18n.setLocale('de');
                platform.domWriteQueue.flush();
                assertTextContent(host, 'camel-ce div', de.simple.text);
            }, { component: App });
        }
    });
    describe('`t` value-converter works for', function () {
        {
            let App = class App {
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${'simple.text' | t}</span>` })
            ], App);
            $it('key as string literal', function ({ host, en: translation }) {
                assertTextContent(host, 'span', translation.simple.text);
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.key = 'simple.text';
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${key | t}</span>` })
            ], App);
            $it('key bound from vm property', function ({ host, en: translation }) {
                assertTextContent(host, 'span', translation.simple.text);
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${'itemWithCount' | t: {count:10}}</span>` })
            ], App);
            $it('with `t-params`', function ({ host, en: translation }) {
                assertTextContent(host, 'span', translation.itemWithCount_plural.replace('{{count}}', '10'));
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `
      <span id="a" title.bind="'simple.text' | t">t-vc-attr-target</span>
      <span id="b" title="\${'simple.text' | t}">t-vc-attr-target</span>
      <span id="c" title.bind="'itemWithCount' | t : {count:10}">t-vc-attr-target</span>
      `
                })
            ], App);
            $it('attribute translation', function ({ host, en: translation }) {
                assertTextContent(host, `span#a[title='${translation.simple.text}']`, 't-vc-attr-target');
                assertTextContent(host, `span#b[title='${translation.simple.text}']`, 't-vc-attr-target');
                assertTextContent(host, `span#c[title='${translation.itemWithCount_plural.replace('{{count}}', '10')}']`, 't-vc-attr-target');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${'simple.text' | t}</span>` })
            ], App);
            $it('change of locale', async function ({ host, de, platform, i18n }) {
                await i18n.setLocale('de');
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', de.simple.text);
            }, { component: App });
        }
    });
    describe('`t` binding-behavior works for', function () {
        {
            let App = class App {
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${'simple.text' & t}</span>` })
            ], App);
            $it('key as string literal', function ({ host, en: translation }) {
                assertTextContent(host, 'span', translation.simple.text);
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.key = 'simple.text';
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${key & t}</span>` })
            ], App);
            $it('key bound from vm property', function ({ host, en: translation }) {
                assertTextContent(host, 'span', translation.simple.text);
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${'itemWithCount' & t : {count:10}}</span>` })
            ], App);
            $it('with `t-params`', function ({ host, en: translation }) {
                assertTextContent(host, 'span', translation.itemWithCount_plural.replace('{{count}}', '10'));
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({
                    name: 'app', template: `
      <span id="a" title.bind="'simple.text' & t">t-vc-attr-target</span>
      <span id="b" title="\${'simple.text' & t}">t-vc-attr-target</span>
      <span id="c" title.bind="'itemWithCount' & t : {count:10}">t-vc-attr-target</span>
      `
                })
            ], App);
            $it('attribute translation', function ({ host, en: translation }) {
                assertTextContent(host, `span#a[title='${translation.simple.text}']`, 't-vc-attr-target');
                assertTextContent(host, `span#b[title='${translation.simple.text}']`, 't-vc-attr-target');
                assertTextContent(host, `span#c[title='${translation.itemWithCount_plural.replace('{{count}}', '10')}']`, 't-vc-attr-target');
            }, { component: App });
        }
        {
            let App = class App {
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${'simple.text' & t}</span>` })
            ], App);
            $it('change of locale', async function ({ host, de, platform, i18n }) {
                await i18n.setLocale('de');
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', de.simple.text);
            }, { component: App });
        }
    });
    describe('`df` value-converter', function () {
        const cases = [
            { name: 'works for date object', input: new Date(2019, 7, 20), output: new Date('8/20/2019').toLocaleDateString('en') },
            { name: 'works for ISO 8601 date string', input: new Date(2019, 7, 20).toISOString(), output: new Date('8/20/2019').toLocaleDateString('en') },
            { name: 'works for integer', input: 0, output: new Date(0).toLocaleDateString('en') },
            { name: 'works for integer string', input: '0', output: new Date(0).toLocaleDateString('en') },
            { name: 'returns undefined for undefined', input: undefined, output: undefined },
            { name: 'returns null for null', input: null, output: null },
            { name: 'returns empty string for empty string', input: '', output: '' },
            { name: 'returns whitespace for whitespace', input: '  ', output: '  ' },
            { name: 'returns `invalidValueForDate` for `invalidValueForDate`', input: 'invalidValueForDate', output: 'invalidValueForDate' },
        ];
        for (const { name, input, output } of cases) {
            const baseDef = { name: `app`, template: `<span>\${ dt | df }</span>` };
            let App = class App {
                constructor() {
                    this.dt = input;
                }
            };
            App = __decorate([
                customElement(baseDef)
            ], App);
            $it(`${name} STRICT`, function ({ host }) {
                assertTextContent(host, 'span', `${output ?? ''}`);
            }, { component: App });
            let App1 = class App1 {
                constructor() {
                    this.dt = input;
                }
            };
            App1 = __decorate([
                customElement({ ...baseDef })
            ], App1);
            $it(name, function ({ host }) {
                assertTextContent(host, 'span', (output ?? '').toString());
            }, { component: App1 });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date(2019, 7, 20);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt | df : {year:'2-digit', month:'2-digit', day:'2-digit'} : 'de' }</span>` })
            ], App);
            $it('respects provided locale and formatting options', function ({ host }) {
                assertTextContent(host, 'span', '20.08.19');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date(2019, 7, 20);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt | df }</span>` })
            ], App);
            $it('works for change of locale', async function ({ host, i18n, platform }) {
                await i18n.setLocale('de');
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', '20.8.2019');
            }, { component: App });
            $it('works for change of source value', function ({ host, platform, app }) {
                app.dt = new Date(2019, 7, 21);
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', '8/21/2019');
            }, { component: App });
        }
    });
    describe('`df` binding-behavior', function () {
        const cases = [
            { name: 'works for date object', input: new Date(2019, 7, 20), output: new Date('8/20/2019').toLocaleDateString('en') },
            { name: 'works for ISO 8601 date string', input: new Date(2019, 7, 20).toISOString(), output: new Date('8/20/2019').toLocaleDateString('en') },
            { name: 'works for integer', input: 0, output: new Date(0).toLocaleDateString('en') },
            { name: 'works for integer string', input: '0', output: new Date(0).toLocaleDateString('en') },
            { name: 'returns undefined for undefined', input: undefined, output: undefined },
            { name: 'returns null for null', input: null, output: null },
            { name: 'returns empty string for empty string', input: '', output: '' },
            { name: 'returns whitespace for whitespace', input: '  ', output: '  ' },
            { name: 'returns `invalidValueForDate` for `invalidValueForDate`', input: 'invalidValueForDate', output: 'invalidValueForDate' },
        ];
        for (const { name, input, output } of cases) {
            const baseDef = { name: 'app', template: `<span>\${ dt & df }</span>` };
            let App = class App {
                constructor() {
                    this.dt = input;
                }
            };
            App = __decorate([
                customElement(baseDef)
            ], App);
            $it(`${name} STRICT`, function ({ host }) {
                assertTextContent(host, 'span', `${output ?? ''}`);
            }, { component: App });
            let App1 = class App1 {
                constructor() {
                    this.dt = input;
                }
            };
            App1 = __decorate([
                customElement({ ...baseDef })
            ], App1);
            $it(name, function ({ host }) {
                assertTextContent(host, 'span', (output ?? '').toString());
            }, { component: App1 });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date(2019, 7, 20);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt & df : {year:'2-digit', month:'2-digit', day:'2-digit'} : 'de' }</span>` })
            ], App);
            $it('respects provided locale and formatting options', function ({ host }) {
                assertTextContent(host, 'span', '20.08.19');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date(2019, 7, 20);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt & df }</span>` })
            ], App);
            $it('works for change of locale', async function ({ host, i18n, platform }) {
                await i18n.setLocale('de');
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', '20.8.2019');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date(2019, 7, 20);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt & df }</span>` })
            ], App);
            $it('works for change of source value', function ({ host, platform, app }) {
                app.dt = new Date(2019, 7, 21);
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', '8/21/2019');
            }, { component: App });
        }
    });
    describe('`nf` value-converter', function () {
        const def = { name: 'app', template: `<span>\${ num | nf }</span>` };
        const strictDef = { ...def };
        for (const value of [undefined, null, 'chaos', new Date(), true]) {
            let App = class App {
                constructor() {
                    this.num = value;
                }
            };
            App = __decorate([
                customElement(strictDef)
            ], App);
            $it(`returns the value itself if the value is not a number STRICT binding, for example: ${value}`, function ({ host }) {
                assertTextContent(host, 'span', `${value ?? ''}`);
            }, { component: App });
            let App1 = class App1 {
                constructor() {
                    this.num = value;
                }
            };
            App1 = __decorate([
                customElement(def)
            ], App1);
            $it(`returns the value itself if the value is not a number, for example: ${value}`, function ({ host }) {
                assertTextContent(host, 'span', `${value ?? ''}`);
            }, { component: App1 });
        }
        {
            let App = class App {
                constructor() {
                    this.num = 123456789.12;
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ num | nf }</span>` })
            ], App);
            $it('formats number by default as per current locale and default formatting options', function ({ host }) {
                assertTextContent(host, 'span', '123,456,789.12');
            }, { component: App });
            $it('works for change of locale', async function ({ host, i18n, platform }) {
                await i18n.setLocale('de');
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', '123.456.789,12');
            }, { component: App });
            $it('works for change of source value', function ({ host, platform, app }) {
                app.num = 123456789.21;
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', '123,456,789.21');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.num = 123456789.12;
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ num | nf : { style: 'currency', currency: 'EUR' } }</span>` })
            ], App);
            $it('formats a given number as per given formatting options', function ({ host }) {
                assertTextContent(host, 'span', '€123,456,789.12');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.num = 123456789.12;
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ num | nf : undefined : 'de' }</span>` })
            ], App);
            $it('formats a given number as per given locale', function ({ host }) {
                assertTextContent(host, 'span', '123.456.789,12');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.num = 123456789.12;
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ num | nf : { style: 'currency', currency: 'EUR' } : 'de' }</span>` })
            ], App);
            $it('formats a given number as per given locale and formatting options', function ({ host }) {
                assertTextContent(host, 'span', '123.456.789,12\u00A0€');
            }, { component: App });
        }
    });
    describe('`nf` binding-behavior', function () {
        const def = { name: 'app', template: `<span>\${ num & nf }</span>` };
        const strictDef = { ...def };
        for (const value of [undefined, null, 'chaos', new Date(), true]) {
            let App = class App {
                constructor() {
                    this.num = value;
                }
            };
            App = __decorate([
                customElement(strictDef)
            ], App);
            $it(`returns the value itself if the value is not a number STRICT binding, for example: ${value}`, function ({ host }) {
                assertTextContent(host, 'span', `${value ?? ''}`);
            }, { component: App });
            let App1 = class App1 {
                constructor() {
                    this.num = value;
                }
            };
            App1 = __decorate([
                customElement(def)
            ], App1);
            $it(`returns the value itself if the value is not a number, for example: ${value}`, function ({ host }) {
                assertTextContent(host, 'span', `${value ?? ''}`);
            }, { component: App1 });
        }
        {
            let App = class App {
                constructor() {
                    this.num = 123456789.12;
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ num & nf }</span>` })
            ], App);
            $it('formats number by default as per current locale and default formatting options', function ({ host }) {
                assertTextContent(host, 'span', '123,456,789.12');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.num = 123456789.12;
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ num & nf : { style: 'currency', currency: 'EUR' } }</span>` })
            ], App);
            $it('formats a given number as per given formatting options', function ({ host }) {
                assertTextContent(host, 'span', '€123,456,789.12');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.num = 123456789.12;
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ num & nf : undefined : 'de' }</span>` })
            ], App);
            $it('formats a given number as per given locale', function ({ host }) {
                assertTextContent(host, 'span', '123.456.789,12');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.num = 123456789.12;
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ num & nf : { style: 'currency', currency: 'EUR' } : 'de' }</span>` })
            ], App);
            $it('formats a given number as per given locale and formating options', function ({ host }) {
                assertTextContent(host, 'span', '123.456.789,12\u00A0€');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.num = 123456789.12;
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ num & nf }</span>` })
            ], App);
            $it('works for change of locale', async function ({ host, i18n, platform }) {
                await i18n.setLocale('de');
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', '123.456.789,12');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.num = 123456789.12;
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ num & nf }</span>` })
            ], App);
            $it('works for change of source value', function ({ host, app, platform }) {
                app.num = 123456789.21;
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', '123,456,789.21');
            }, { component: App });
        }
    });
    describe('`rt` value-converter', function () {
        for (const value of [undefined, null, 'chaos', 123, true]) {
            const def = { name: 'app', template: `<span>\${ dt | rt }</span>` };
            const strictDef = { ...def };
            let App = class App {
                constructor() {
                    this.dt = value;
                }
            };
            App = __decorate([
                customElement(strictDef)
            ], App);
            $it(`returns the value itself if the value is not a number STRICT, for example: ${value}`, function ({ host }) {
                assertTextContent(host, 'span', `${value ?? ''}`);
            }, { component: App });
            let App1 = class App1 {
                constructor() {
                    this.dt = value;
                }
            };
            App1 = __decorate([
                customElement(def)
            ], App1);
            $it(`returns the value itself if the value is not a number, for example: ${value}`, function ({ host }) {
                assertTextContent(host, 'span', `${value ?? ''}`);
            }, { component: App1 });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date();
                    this.dt.setHours(this.dt.getHours() - 2);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt | rt }</span>` }),
                __metadata("design:paramtypes", [])
            ], App);
            $it('formats date by default as per current locale and default formatting options', function ({ host }) {
                assertTextContent(host, 'span', '2 hours ago');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date();
                    this.dt.setHours(this.dt.getHours() - 2);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt | rt : undefined : 'de' }</span>` }),
                __metadata("design:paramtypes", [])
            ], App);
            $it('formats a given number as per given locale', function ({ host }) {
                assertTextContent(host, 'span', 'vor 2 Stunden');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date();
                    this.dt.setHours(this.dt.getHours() - 2);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt | rt : { style: 'short' } : 'de' }</span>` }),
                __metadata("design:paramtypes", [])
            ], App);
            $it('formats a given number as per given locale and formating options', function ({ host }) {
                assertTextContent(host, 'span', 'vor 2 Std.');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date();
                    this.dt.setHours(this.dt.getHours() - 2);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt | rt }</span>` }),
                __metadata("design:paramtypes", [])
            ], App);
            $it('works for change of locale', async function ({ host, i18n, platform }) {
                await i18n.setLocale('de');
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', 'vor 2 Stunden');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date();
                    this.dt.setHours(this.dt.getHours() - 2);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt | rt }</span>` }),
                __metadata("design:paramtypes", [])
            ], App);
            $it('works for change of source value', function ({ host, platform, app }) {
                app.dt = new Date(app.dt.setHours(app.dt.getHours() - 3));
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', '5 hours ago');
            }, { component: App });
        }
        it('updates formatted value if rt_signal', async function () {
            this.timeout(10000);
            const offset = 2000; // reduce the amount of time the test takes to run
            let App = class App {
                constructor() {
                    this.dt = new Date(Date.now() - offset);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt | rt }</span>` })
            ], App);
            await runTest(async function ({ platform, host, container }) {
                await platform.taskQueue.queueTask(delta => {
                    container.get(ISignaler).dispatchSignal(Signals.RT_SIGNAL);
                    platform.domWriteQueue.flush();
                    assertTextContent(host, 'span', `${Math.round((delta + offset) / 1000)} seconds ago`);
                }, { delay: 1000 }).result;
            }, { component: App });
        });
    });
    describe('`rt` binding-behavior', function () {
        const def = { name: 'app', template: `<span>\${ dt & rt }</span>` };
        const strictDef = { ...def };
        for (const value of [undefined, null, 'chaos', 123, true]) {
            let App = class App {
                constructor() {
                    this.dt = value;
                }
            };
            App = __decorate([
                customElement(strictDef)
            ], App);
            $it(`returns the value itself if the value is not a number STRICT binding, for example: ${value}`, function ({ host }) {
                assertTextContent(host, 'span', `${value ?? ''}`);
            }, { component: App });
            let App1 = class App1 {
                constructor() {
                    this.dt = value;
                }
            };
            App1 = __decorate([
                customElement(def)
            ], App1);
            $it(`returns the value itself if the value is not a number, for example: ${value}`, function ({ host }) {
                assertTextContent(host, 'span', `${value ?? ''}`);
            }, { component: App1 });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date();
                    this.dt.setHours(this.dt.getHours() - 2);
                }
            };
            App = __decorate([
                customElement(def),
                __metadata("design:paramtypes", [])
            ], App);
            $it('formats date by default as per current locale and default formatting options', function ({ host }) {
                assertTextContent(host, 'span', '2 hours ago');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date();
                    this.dt.setHours(this.dt.getHours() - 2);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt & rt : undefined : 'de' }</span>` }),
                __metadata("design:paramtypes", [])
            ], App);
            $it('formats a given number as per given locale', function ({ host }) {
                assertTextContent(host, 'span', 'vor 2 Stunden');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date();
                    this.dt.setHours(this.dt.getHours() - 2);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt & rt : { style: 'short' } : 'de' }</span>` }),
                __metadata("design:paramtypes", [])
            ], App);
            $it('formats a given number as per given locale and formating options', function ({ host }) {
                assertTextContent(host, 'span', 'vor 2 Std.');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date();
                    this.dt.setHours(this.dt.getHours() - 2);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt & rt }</span>` }),
                __metadata("design:paramtypes", [])
            ], App);
            $it('works for change of locale', async function ({ host, i18n, platform }) {
                await i18n.setLocale('de');
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', 'vor 2 Stunden');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.dt = new Date();
                    this.dt.setHours(this.dt.getHours() - 2);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt & rt }</span>` }),
                __metadata("design:paramtypes", [])
            ], App);
            $it('works for change of source value', function ({ host, platform, app }) {
                app.dt = new Date(app.dt.setHours(app.dt.getHours() - 3));
                platform.domWriteQueue.flush();
                assertTextContent(host, 'span', '5 hours ago');
            }, { component: App });
        }
        it('updates formatted value if rt_signal', async function () {
            this.timeout(10000);
            const offset = 2000; // reduce the amount of time the test takes to run
            let App = class App {
                constructor() {
                    this.dt = new Date(Date.now() - offset);
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span>\${ dt & rt }</span>` })
            ], App);
            await runTest(async function ({ host, platform, container }) {
                await platform.taskQueue.queueTask(delta => {
                    container.get(ISignaler).dispatchSignal(Signals.RT_SIGNAL);
                    platform.domWriteQueue.flush();
                    assertTextContent(host, 'span', `${Math.round((delta + offset) / 1000)} seconds ago`);
                }, { delay: 1000 }).result;
            }, { component: App });
        });
    });
    describe('`skipTranslationOnMissingKey`', function () {
        {
            const key = 'lost-in-translation';
            let App = class App {
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span t='${key}'></span>` })
            ], App);
            $it('is disabled by default, and the given key is rendered if the key is missing from i18next resource', function ({ host }) {
                assertTextContent(host, 'span', key);
            }, { component: App });
        }
        {
            const key = 'lost-in-translation', text = 'untranslated text';
            let App = class App {
            };
            App = __decorate([
                customElement({ name: 'app', template: `<span t='${key}'>${text}</span>` })
            ], App);
            $it('enables skipping translation when set', function ({ host }) {
                assertTextContent(host, 'span', text);
            }, { component: App, skipTranslationOnMissingKey: true });
        }
    });
    describe('works with au-slot', function () {
        {
            let App = class App {
            };
            App = __decorate([
                customElement({ name: 'app', template: `<foo-bar status="delivered" date="1971-12-25"></foo-bar>` })
            ], App);
            $it('w/o projection', function ({ host }) {
                assertTextContent(host, 'span', 'delivered on 1971-12-25');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.status = 'dispatched';
                    this.date = '1972-12-26';
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<foo-bar status="delivered" date="1971-12-25"><div au-slot t="status" t-params.bind="{context: status, date: date}"></div></foo-bar>` })
            ], App);
            $it('with projection', function ({ host }) {
                assertTextContent(host, 'div', 'dispatched on 1972-12-26');
            }, { component: App });
        }
        {
            let App = class App {
                constructor() {
                    this.status = 'dispatched';
                    this.date = '1972-12-26';
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: `<foo-bar status="delivered" date="1971-12-25"><div au-slot t="status" t-params.bind="{context: status, date: $host.date}"></div></foo-bar>` })
            ], App);
            $it('with projection - mixed', function ({ host }) {
                assertTextContent(host, 'div', 'dispatched on 1971-12-25');
            }, { component: App });
        }
    });
});
//# sourceMappingURL=translation-integration.spec.js.map