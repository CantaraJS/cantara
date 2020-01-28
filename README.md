## General

In this document, the word `App` can refer to React Apps or Node-Apps.

### Naming your apps

The name of your app is derived from the folder name it lives in. App names must be unique within the same repository.

## Commands

```bash
ctr dev <appname>
```

```bash
ctr build <appname>
```

```bash
# Runs an arbitrary command within the scope of the specified package. This can be a globally valid CLI command (e.g. 'npm', 'cd', 'echo'), a tool you installed via NPM or a tool which is used internally by Cantara (e.g. serverless).
ctr run <appname|package-name> <command> [...args]
```

--> Implement this by adding all of the above mentioned folders to the PATH of the current session

```bash
ctr test [appname|package-name] [...jestArgs]
```

```bash
ctr new <react-app|node-app|serverless|js-package|react-component> <new-name>
```

```bash
ctr init [template-name]
```

# Things to keep in mind

## Required

- Write docs
  - As Readme + as web version
- Port a project to Cantara (DA)
- Custom e2e testing command can be provided. Cantara takes care of starting all the neccessary servers.
- Scripts for DB migrations
- Make type checking optional via flag
- Webpack, Babel, TSconfig ecc. can be modified externally
- Write integration tests for CLI
- Create a few useful starter templates
- Good UI/UX with ink and enquirer
  - --help and --version
- Deployment should work out of the box for all parts an application can have
  - Defaults can be overriden

## Nice to have

- "Mission Control": Intuitive Web Interface
  - Interface to manage all available Cantara Commands
- Optional Chaining
- I18n / Intl
- Add bundleanalyzer option to build cmd
- Replace Nodemon with custom Chokidar implementation
- When new version is available, show message.
- corejs?
- Add greenkeeper
- Add bundle analyzer (react apps and packages only)
- Faster build times
  - https://github.com/amireh/happypack

## Cool libs

- https://www.npmjs.com/package/figlet
- https://github.com/vadimdemedes/ink
- chalk
- commander
- program
- Inquirer
