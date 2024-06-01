#!/usr/bin/env node
import { Command } from 'commander';
import { analyze } from '../index';

const program = new Command();

program.name('sdp-analyzer').description('A cli tool for analyzing package stability').version('1.0.0');
program
  .command('analyze')
  .argument('<string>', 'the local package path or a npm package name')
  .action(async target => {
    const result = await analyze(target);
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  });

program.parse();
