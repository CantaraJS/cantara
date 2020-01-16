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
ctr new <new-name> <react|node|serverless|js-package|react-component>
```

```bash
ctr init [template-name]
```

# Things to keep in mind

## Required

- Implement "test" command
  - Env vars
  - Aliases
  - Install testing dependencies in the project's root?
- Fix aliases (look at generated tsconfig.json)
  - Make sure that _only_ package aliases are included (intelli sense also suggests exports from e.g. node-apps folder)
- Provide "publish" command with good UX for publishing a package to NPM
  - Look at "np"
- Implement "new" command
- Implement templates
  - "init" command
- Serverless and different stages
- Webpack, Babel, TSconfig ecc. can be modified externally
- "CI" command
  - Only rebuilds and deploys the parts of the application that changed
- Custom e2e testing command can be provided. Cantara takes care of starting all the neccessary servers.
- Scripts for DB migrations
- Deployment should work out of the box for all parts an application can have
  - Defaults can be overriden
- Create a few useful starter templates
- Perfect UX for all cantara commands
  - Everything is a "wizard"
- Make type checking optional via flag

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
