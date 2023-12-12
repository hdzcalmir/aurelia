import { CustomElement, Aurelia } from '@aurelia/runtime-html';
import { TestContext, hJsx, assert } from '@aurelia/testing';
// IMPORTANT:
//      JSX is used to eliminate space between tags so test result can be easier to manually constructed
//      if template string can be used to achieve the same effect, it could be converted back
describe('3-runtime-html/repeat_weird.spec.tsx', function () {
    const testCases = [
        [
            [
                '[repeat {item}]',
                '  [repeat {item}]',
                '---',
                '[foo]'
            ].join('\n'),
            hJsx("div", { "repeat$for": "item of items" },
                hJsx("div", { "repeat$for": "item of items" },
                    '${item.idx}',
                    ".")),
            hJsx("foo", null),
            createItems(2),
            `0.1.`.repeat(2)
        ],
        // Same with previous, though [repeat] + [replaceable] are on same element
        [
            [
                '[repeat {item}] [repeat {item}]'
            ].join('\n'),
            hJsx("div", { "repeat$0$for": "item of items", "repeat$1$for": "item of items" },
                '${item.idx}',
                "."),
            hJsx("foo", null),
            createItems(2),
            `0.1.`.repeat(2)
        ],
        [
            [
                '[repeat {item}]',
                '  [repeat {item}]',
                '    [repeat {item}]',
                '---',
                '[foo]'
            ].join('\n'),
            hJsx("div", { "repeat$for": "item of items" },
                hJsx("div", { "repeat$for": "item of items" },
                    hJsx("div", { "repeat$for": "item of items" },
                        '${item.idx}',
                        "."))),
            hJsx("foo", null),
            createItems(2),
            `0.1.`.repeat(4)
        ],
        [
            [
                '[repeat {item}] [repeat {item}] [repeat {item}]'
            ].join('\n'),
            hJsx("div", { "repeat$0$for": "item of items", "repeat$1$for": "item of items", "repeat$2$for": "item of items" },
                '${item.idx}',
                "."),
            hJsx("foo", null),
            createItems(2),
            `0.1.`.repeat(4)
        ]
    ];
    for (const [testTitle, fooContentTemplate, appContentTemplate, fooItems, expectedTextContent, customAssertion] of testCases) {
        // eslint-disable-next-line mocha/no-skipped-tests
        it.skip(`\n----\n${testTitle}`, async function () {
            const Foo = CustomElement.define({ name: 'foo', template: hJsx("template", null, fooContentTemplate) }, class Foo {
                constructor() {
                    this.items = fooItems;
                }
            });
            const App = CustomElement.define({ name: 'app', template: hJsx("template", null, appContentTemplate) }, class App {
                constructor() {
                    this.message = 'Aurelia';
                }
            });
            const ctx = TestContext.create();
            ctx.container.register(Foo);
            const au = new Aurelia(ctx.container);
            const host = ctx.createElement('div');
            const component = new App();
            au.app({ host, component });
            await au.start();
            assert.strictEqual(host.textContent, expectedTextContent, `host.textContent`);
            if (customAssertion) {
                customAssertion(host, component, component.$controller.children[0]);
            }
            await tearDown(au);
        });
    }
    async function tearDown(au) {
        await au.stop();
        au.root.host.remove();
        au.dispose();
    }
    function createItems(count, baseName = 'item') {
        return Array.from({ length: count }, (_, idx) => {
            return { idx, name: `${baseName}-${idx}` };
        });
    }
});
//# sourceMappingURL=repeat_weird.spec.js.map