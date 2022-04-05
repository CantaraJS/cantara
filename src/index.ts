#!/usr/bin/env node
import 'array-flat-polyfill';
import setupCliInterface from './cli';

console.log('USING ESBUILD! 💥💥💥');

function main() {
  setupCliInterface();
}

main();
