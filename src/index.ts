import fetch from "node-fetch";
import { argv } from "yargs";
import * as nunjucks from "nunjucks";
import * as fs from "fs";

console.info("Generation...");
execute()
    .then(executionSuccessful)
    .catch(executionFailed);

function executionSuccessful() {
    console.info("Generation done");
}

function executionFailed(reason: any) {
    console.info(reason);
}

async function readFileContent(uri: string): Promise<any> {
    if (uri.startsWith("http")) {
        return (await fetch(uri)).json();
    }
    else {
        return new Promise<any>(function (fulfill, reject) {
            fs.readFile(uri, function (err, res) {
                if (err) {
                    reject(err);
                }
                else {
                    fulfill(JSON.parse(res.toString('utf8')));
                }
            });
        });
    }
}

async function execute() {
    const swaggerContent = await (readFileContent(argv.source as string));
    nunjucks.configure({ autoescape: true, trimBlocks: true });
    if (argv.templateFile && argv.targetFile) {
        const apisContent = nunjucks.render(argv.templateFile as string, swaggerContent);
        fs.writeFileSync(argv.targetFile as string, apisContent);
    }
}