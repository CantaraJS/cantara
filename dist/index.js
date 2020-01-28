#!/usr/bin/env node
"use strict";
function parseCliCommand(command) { }
function main() {
    var TEST_CMD = 'deploy greeting-api --stage staging'.split(' ');
    var cmdToUse = process.env.NODE_ENV === 'development' ? TEST_CMD : process.argv.slice(2);
    console.log('argv', process.argv);
}
main();
