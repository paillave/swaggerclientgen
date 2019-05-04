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
console.info("Generation...");
execute()
    .then(executionSuccessful)
    .catch(executionFailed);
function executionSuccessful() {
    console.info("Generation done");
}
function executionFailed(reason) {
    console.info(reason);
}
function execute() {
    return __awaiter(this, void 0, void 0, function* () {
        const swaggerContent = yield (yield node_fetch_1.default(yargs_1.argv.source)).json();
        nunjucks.configure({ autoescape: true, trimBlocks: true });
        if (yargs_1.argv.templateFile && yargs_1.argv.targetFile) {
            const apisContent = nunjucks.render(yargs_1.argv.templateFile, swaggerContent);
            fs.writeFileSync(yargs_1.argv.targetFile, apisContent);
        }
    });
}
//# sourceMappingURL=index.js.map