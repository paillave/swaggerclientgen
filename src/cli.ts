import fetch from "node-fetch";
import { argv } from "yargs";
import * as nunjucks from "nunjucks";
import * as fs from "fs";
import { Agent } from "https";

interface IConfig {
    inputUri: string;
    transformations: {
        [key: string]: string;
    };
}

console.info("Generation...");
execute(getConfig())
    .then(executionSuccessful)
    .catch(executionFailed);

function executionSuccessful() {
    console.info("Generation done");
}

function executionFailed(reason: any) {
    console.info(reason);
}

function getConfig(): IConfig {
    if (argv.config) {
        return JSON.parse(fs.readFileSync(argv.config as string).toString()) as IConfig;
    }
    else {
        return {
            inputUri: argv.source as string,
            transformations: {
                [argv.templateFile as string]: argv.targetFile as string
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
