#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var packageJSON = require('../package.json');
var TEST_CMD = 'cantara dev';
console.log('0', process.argv);
var cmdToParse = process.env.NODE_ENV === 'development' ? TEST_CMD.split(' ') : process.argv;
commander_1.default.version(packageJSON.version);
commander_1.default
    .command('dev <appname>')
    .description('Start the specified app in development mode.')
    .action(function (appname) {
    console.log({ appname: appname });
});
commander_1.default.parse(cmdToParse);
