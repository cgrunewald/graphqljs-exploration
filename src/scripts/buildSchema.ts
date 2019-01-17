import { ArgumentParser } from "argparse";
import { statSync, writeFileSync } from "fs";
import Schema from '../graphql/Schema';
import { printSchema } from "graphql";

const argParse = new ArgumentParser({addHelp: true});
argParse.addArgument(['--out', '-o'], {
    help: "Location of output file",
    required: true,
});

const args = argParse.parseArgs();
const outputFile = args.out;

const schemaStr = printSchema(Schema);
writeFileSync(outputFile, schemaStr);
