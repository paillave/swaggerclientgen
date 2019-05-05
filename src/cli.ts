#!/usr/bin/env node

import fetch from "node-fetch";
import * as program from "commander";
import * as nunjucks from "nunjucks";
import * as fs from "fs";
import { Agent } from "https";
//import * as pack from "../package.json";

interface IConfig {
    inputUri: string;
    transformations: {
        [key: string]: string;
    };
}

interface IArgs {
    config?: string;
    input?: string;
    template?: string;
    output?: string;
}

program
    .usage("[options]")
    .description("Generate any text file from a web or local json file using a template.")
    .option("-c, --config <file>", "configuration file path")
    .option("-t, --template <file>", "template file path")
    .option("-o, --output <file>", "output file path")
    .option("-i, --input <file>", "input json file path or url")
    .parse(process.argv);

const commandLineArguments = program as unknown as IArgs;

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

function executionFailed(reason: any) {
    console.error(reason);
}

function getConfig(args: IArgs): IConfig {
    if (args.config) {
        return JSON.parse(fs.readFileSync(args.config as string).toString()) as IConfig;
    }
    else {
        return {
            inputUri: args.input as string,
            transformations: {
                [args.template as string]: args.output as string
            }
        };
    }
}

async function readFileContent<T>(uri: string): Promise<T> {
    if (uri.startsWith("http")) {
        return (await fetch(uri, { agent: new Agent({ rejectUnauthorized: false }) })).json();
    }
    else {
        return new Promise<any>(function (fulfill, reject) {
            fs.readFile(uri, function (err, res) {
                if (err) {
                    reject(err);
                }
                else {
                    fulfill(JSON.parse(res.toString()) as T);
                }
            });
        });
    }
}

async function execute(config: IConfig) {
    const swaggerContent = await (readFileContent(config.inputUri));
    const env = nunjucks.configure({ autoescape: false, trimBlocks: true });
    env.addFilter("toarray", toArray);
    env.addFilter("selectmany", selectMany);
    env.addFilter("groupby2", groupBy)
    for (let templateFile in config.transformations) {
        const apisContent = nunjucks.render(templateFile as string, swaggerContent);
        fs.writeFileSync(config.transformations[templateFile], apisContent);
    }
}

function groupBy(node: any, pathToKey: string): { [key: string]: any[] } {
    const outputValue: { [key: string]: any[] } = {};
    for (const keyTarget in node) {
        const key = getSubValue(node[keyTarget], pathToKey);
        if (!outputValue[key]) {
            outputValue[key] = [];
        }
        outputValue[key].push(node[keyTarget]);
    }
    return outputValue;
}

function selectMany(node: any, parentTargetName: string, subItemToSelect: string, keyTargetName: string, valueTargetName: string): any[] {
    const outputList: any[] = [];
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

function getSubValue(value: any, path: string): any {
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

function toArray(node: any, keyTargetName: string, valueTargetName: string): any[] {
    const outputList: any[] = [];
    for (const keyTarget in node) {
        outputList.push({
            [keyTargetName]: keyTarget,
            [valueTargetName]: node[keyTarget]
        });
    }
    return outputList;
}
