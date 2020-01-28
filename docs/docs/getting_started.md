---
id: getting_started
title: Quick Start
sidebar_label: Quick Start
---

# Introduction

Cantara is a **zero-config** tool for developing Fullstack Applications using React, Serverless, NodeJS and TypeScript.

Cantara stands for: **C**reate **A** **N**ode, **T**ypeScript **A**nd **R**eact **A**pplication

It aims to cover _all_ needs of such a project, including (but not only):

- Developing client side React Apps (like you can do with Create React App)
- Developing and deploying serverless APIs using TypeScript
- Developing NodeJS applications (e.g. an express based REST API) using TypeScript
- Developing and publishing React Components/JS packages on NPM

...without _ever_ dealing with Webpack, TSConfig, Jest or whatever tool is needed in that complex workflow again.

But Cantara isn't only _exclusively_ for Full Stack TypeScript apps, it's also very useful if only need one feature, e.g. developing and publishing React Components (never touching that sketchy webpack config again, huh 😅)

Despite it's **zero-config** nature, Cantara aims to be highly customizable, it shouldn't be in your way but adapt to the very specific needs of your project which may arise over time.

So, if you are developing Micro Frontends, a React-based dashboard, a UI library for your company, a scalable serverless API for your SaaS or all of that combined, Cantara _may_ be right for you.

# Getting started

## Installation

Install Cantara globally with npm (or the package manager of your choice):

```bash
npm i -g cantara
```

You can then access Cantara in the CLI using either **cantara** or the shorter alias **ctra**

```bash
cantara init # OR
ctra init
```

## Initializing a new project

```
ctra init [path] [template]
```

`path` and `template` are optional. If no template is specified, the [cantara-simple-starter](https://github.com/scriptify/cantara-simple-starter) template is used. You can specify either the name of an offical template or a link to a git repository. If you want to create your own templates, have a look at [Authoring Templates](authoring_templates).

## Developing React Apps / Serverless Endpoints / NodeJS Apps

Starting the development of a React App, a serverless endpoint or a NodeJS app is done using the same command:

```bash
ctra dev <appname>
```

After executing this command, you can start developing.

## Building React Apps / NodeJS apps / Packages

```bash
ctra build <appname|package-name>
```

## Deploying a serverless endpoint

```bash
ctra deploy <endpoint-name>
```

## Execute tests

```bash
ctra test <appname|package-name> [jestArgs...]
```

## Publish a package to npm

```bash
ctra publish <package-name>
```

## Create a new serverless endpoint/React app/NodeJS app/package

```bash
ctr new <react-app|node-app|serverless|js-package|react-component> <new-name>
```

## Only create production builds of apps that changed

```bash
ctra build-changed
```
