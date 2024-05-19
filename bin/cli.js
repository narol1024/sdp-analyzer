#!/usr/bin/env node

const { Command } = require('commander');
const sdpAnalyer = require('../src');
const packageJson = require('../package.json');
const reportServer = require('../src/report-server');

const program = new Command();

program
  .name('sdp-analyzer')
  .description('CLI to analyze SDP for javascript package')
  .version(packageJson.version);
program
  .command('analyze')
  .argument('<string>', 'the local package path or npm package name')
  .option('-o, --outType <string>', 'the type of report output', 'html')
  .action(async (targetPackage, { outType }) => {
    const deps = await sdpAnalyer.analyze(targetPackage);
    if (outType === 'html') {
      reportServer.report(deps);
    } else if (outType === 'json') {
      console.log(JSON.stringify(deps));
    } else {
      // the other types are coming soon..
    }
  });

program.parse();
