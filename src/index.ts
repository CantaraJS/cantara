#!/usr/bin/env node
import 'array-flat-polyfill';
import setupCliInterface from './cli';

console.log('trigger ci');

function main() {
  setupCliInterface();
}

main();
