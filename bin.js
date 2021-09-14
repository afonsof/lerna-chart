#!/usr/bin/env node

const {ArgumentParser} = require('argparse');
const fs = require('fs');
const path = require('path');
const {generateGraphBufferLernaPath} = require("./graph-generator");
const pkg = require('./package.json');

const parser = new ArgumentParser({
  version: pkg.version,
  addHelp: true,
  description: 'Lerna Chart',
  // argumentDefault: {
  //   OUTFILE: 'lerna-chart',
  //   inputDir: process.cwd(),
  //   type: 'png',
  // }
});

parser.addArgument(['-o', '--outFile'], {
  help: 'Output file name',
  defaultValue: 'lerna-chart'
});
parser.addArgument(['-i', '--inputDir'], {
  help: 'Input directory',
  defaultValue: process.cwd(),
});
parser.addArgument(['-t', '--type'], {
  help: 'Type',
  defaultValue: 'png',
  choices: ['png', 'tgf', 'puml']
});

const args = parser.parseArgs();

(async () => {
  const ext = path.extname(args.outFile);
  if(!ext) {
    args.outFile += `.${args.type}`;
  }
  const buffer = await generateGraphBufferLernaPath(args.inputDir, args.type);
  await fs.writeFileSync(args.outFile, buffer);
  console.log(`Chart saved at ${args.outFile}`);
  process.exit(0)
})();
