(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@aurelia/debug", "fs", "path", "./au-configuration-options", "./dev-server"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuConfigurationOptions = void 0;
    const debug_1 = require("@aurelia/debug");
    const fs_1 = require("fs");
    const path_1 = require("path");
    const au_configuration_options_1 = require("./au-configuration-options");
    Object.defineProperty(exports, "AuConfigurationOptions", { enumerable: true, get: function () { return au_configuration_options_1.AuConfigurationOptions; } });
    const dev_server_1 = require("./dev-server");
    class ParsedArgs {
        constructor(cmd, configuration, unknownCommand = undefined, unconsumedArgs = []) {
            this.cmd = cmd;
            this.configuration = configuration;
            this.unknownCommand = unknownCommand;
            this.unconsumedArgs = unconsumedArgs;
        }
    }
    const cwd = process.cwd();
    function parseArgs(args) {
        const cmd = args[0];
        args = args.slice(1);
        const configuration = new au_configuration_options_1.AuConfigurationOptions();
        if (args.length % 2 === 1) {
            // check for configuration file
            const configurationFile = path_1.resolve(cwd, args[0]);
            if (!fs_1.existsSync(configurationFile)) {
                throw new Error(`Configuration file is missing or uneven amount of args: ${args}. Args must come in pairs of --key value`);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
                configuration.applyConfig(require(configurationFile));
                args = args.slice(1);
            }
        }
        let parsed;
        switch (cmd) {
            case 'help':
                parsed = new ParsedArgs(cmd, new au_configuration_options_1.AuConfigurationOptions());
                break;
            case 'dev': {
                parsed = new ParsedArgs(cmd, configuration);
                configuration.server.applyOptionsFromCli(cwd, args, 'server.');
                break;
            }
            default:
                parsed = new ParsedArgs('help', new au_configuration_options_1.AuConfigurationOptions(), cmd);
                break;
        }
        const unconsumed = parsed.unconsumedArgs;
        if (unconsumed.length > 0) {
            console.warn(`Following arguments are not consumed ${unconsumed.join(',')}`);
        }
        return parsed;
    }
    (async function () {
        debug_1.DebugConfiguration.register();
        const args = parseArgs(process.argv.slice(2));
        switch (args.cmd) {
            case 'dev': {
                const server = dev_server_1.DevServer.create();
                await server.run(args.configuration.server);
                break;
            }
            case 'help': {
                const unknownCommand = args.unknownCommand;
                if (unknownCommand !== void 0) {
                    console.error(`Unknown command: ${unknownCommand}; Refer the valid options below.`);
                }
                console.log(args.configuration.toString());
                break;
            }
        }
    })().catch(err => {
        console.error(err);
        process.exit(1);
    });
});
//# sourceMappingURL=index.js.map