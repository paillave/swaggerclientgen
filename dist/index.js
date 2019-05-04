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
const yargs_1 = require("yargs");
const nunjucks = require("nunjucks");
const fs = require("fs");
const https_1 = require("https");
console.info("Generation...");
execute(getConfig())
    .then(executionSuccessful)
    .catch(executionFailed);
function executionSuccessful() {
    console.info("Generation done");
}
function executionFailed(reason) {
    console.info(reason);
}
function getConfig() {
    if (yargs_1.argv.config) {
        return JSON.parse(fs.readFileSync(yargs_1.argv.config).toString());
    }
    else {
        return {
            inputUri: yargs_1.argv.source,
            transformations: {
                [yargs_1.argv.templateFile]: yargs_1.argv.targetFile
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
        nunjucks.configure({ autoescape: false, trimBlocks: true });
        for (let templateFile in config.transformations) {
            const apisContent = nunjucks.render(templateFile, swaggerContent);
            fs.writeFileSync(config.transformations[templateFile], apisContent);
        }
    });
}
//# sourceMappingURL=index.js.map