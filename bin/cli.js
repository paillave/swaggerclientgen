#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const program = require("commander");
const nunjucks = require("nunjucks");
const fs = require("fs");
const https_1 = require("https");
program
    .usage("[options]")
    .description("Generate any text file from a web or local json file using a template.")
    .option("-c, --config <file>", "configuration file path")
    .option("-t, --template <file>", "template file path")
    .option("-o, --output <file>", "output file path")
    .option("-i, --input <file>", "input json file path or url")
    .parse(process.argv);
const commandLineArguments = program;
if (!commandLineArguments.config && !(commandLineArguments.input && commandLineArguments.output && commandLineArguments.template)) {
    program.outputHelp();
}
else {
    console.info("Generation...");
    execute(getConfig(commandLineArguments))
        .then(executionSuccessful)
        .catch(executionFailed);
}
function executionSuccessful() {
    console.info("Generation done");
}
function executionFailed(reason) {
    console.error(reason);
}
function getConfig(args) {
    if (args.config) {
        return JSON.parse(fs.readFileSync(args.config).toString());
    }
    else {
        return {
            inputUri: args.input,
            transformations: {
                [args.template]: args.output
            }
        };
    }
}
function readFileContent(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (uri.startsWith("http")) {
            return (yield node_fetch_1.default(uri, { agent: new https_1.Agent({ rejectUnauthorized: false }) })).json();
        }
        else {
            return new Promise(function (fulfill, reject) {
                fs.readFile(uri, function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        fulfill(JSON.parse(res.toString()));
                    }
                });
            });
        }
    });
}
function execute(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const swaggerContent = yield (readFileContent(config.inputUri));
        const env = nunjucks.configure({ autoescape: false, trimBlocks: true });
        env.addFilter("toarray", toArray);
        env.addFilter("selectmany", selectMany);
        env.addFilter("groupby2", groupBy);
        for (let templateFile in config.transformations) {
            const apisContent = nunjucks.render(templateFile, swaggerContent);
            fs.writeFileSync(config.transformations[templateFile], apisContent);
        }
    });
}
function groupBy(node, pathToKey) {
    const outputValue = {};
    for (const keyTarget in node) {
        const key = getSubValue(node[keyTarget], pathToKey);
        if (!outputValue[key]) {
            outputValue[key] = [];
        }
        outputValue[key].push(node[keyTarget]);
    }
    return outputValue;
}
function selectMany(node, parentTargetName, subItemToSelect, keyTargetName, valueTargetName) {
    const outputList = [];
    for (const idx in node) {
        const element = node[idx];
        for (const keyTarget in element[subItemToSelect]) {
            const value = getSubValue(element[subItemToSelect], keyTarget);
            outputList.push({
                [parentTargetName]: element,
                [valueTargetName]: value,
                [keyTargetName]: keyTarget
            });
        }
    }
    return outputList;
}
function getSubValue(value, path) {
    const pos = path.indexOf(".");
    if (pos >= 0) {
        const left = path.substr(0, pos);
        const right = path.substring(pos + 1);
        return getSubValue(value[left], right);
    }
    else {
        return value[path];
    }
}
function toArray(node, keyTargetName, valueTargetName) {
    const outputList = [];
    for (const keyTarget in node) {
        outputList.push({
            [keyTargetName]: keyTarget,
            [valueTargetName]: node[keyTarget]
        });
    }
    return outputList;
}
//# sourceMappingURL=cli.js.map