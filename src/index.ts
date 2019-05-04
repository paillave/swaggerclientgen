import fetch from "node-fetch";
import { argv } from "yargs";
import * as nunjucks from "nunjucks";
import * as fs from "fs";
import { Agent } from "https";
import IConfig from "./IConfig";

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
    nunjucks.configure({ autoescape: false, trimBlocks: true });
    for (let templateFile in config.transformations) {
        const apisContent = nunjucks.render(templateFile as string, swaggerContent);
        fs.writeFileSync(config.transformations[templateFile], apisContent);
    }
}