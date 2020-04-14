---
id: introduction
title: Introduction
sidebar_label: Introduction
---

# What is Cantara?

Cantara stands for: **C**reate **A** **N**ode, **T**ypeScript **A**nd **R**eact **A**pplication

It is a **zero-config** tool for developing (one or more) React Applications with one or more Serverless endpoints **or** NodeJS APIs, organized in a Monorepository, using TypeScript on all layers of the stack.

It also makes it easy to share code between layers or to external consumers as packages, which can be used internally or from the outside using NPM.

**So essentially a tool to make Fullstack TypeScript app development a joy. Stop configuring, start coding.**

Cantara is **not** a framework like Next.js, RedwoodJS or GatsbyJS. It is a CLI tool which doesn't make further assumptions about which tech stack you are going to use. Think of it like Create React App but for fullstack development.

## With Cantara you can:

- Develop client side rendered React Apps (like you can do with Create React App)
- Develop and deploy serverless APIs
- Develop NodeJS applications (e.g. an express based REST API)
- Develop React Components/JS packages, use them in your application and publish them to NPM
- Write unit/integration/e2e tests

...all of it using TypeScript in every part of the stack without _ever_ dealing with Webpack, TS-configs, Jest or whatever tool is needed in that complex workflow again.

But Cantara isn't only _exclusively_ for Fullstack TypeScript apps, it's also very useful if only need one feature it, e.g. developing and publishing React Components.

Despite it's **zero-config** nature, Cantara aims to be highly customizable, it shouldn't be in your way but adapt to the very specific needs of your project which may arise over time. There is no such thing as _ejecting_, if you want to change the internal behaviour of Cantara, you can do that through special hooks (**\***). Like that, you don't loose the many advantages of re-using the same configurations across multiple repositories.

**\*** Note: This is yet to be implemented, as it is better to implement such a rather complex interface with as much community feedback as possible, to serve the different needs best. In the mean time, please open an issue with the feature you are missing. That would be a great help!

## Next steps

Enough talking, let's get started:

- [Go to the Quick Start guide to see how can get up and running with a Fullstack TypeScript project within 5 minutes](quick_start).
- [You can also directly dive deeper and head over to the **Guides**, which aim cover every aspect of Cantara](docs_intro)
