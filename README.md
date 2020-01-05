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

- InjectManifest plugin only in production
- How to handle React/ReactDOM dependecies?
- Handle env vars professionally
- CSS Modules (xyz.module.css)
- Use plugins same as Facebook does:
  - https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js

## Nice to have

- Interactive mode, "Cockpit", where multiple Cantara commands can be started and monitored
- Maybe install actual scripts as own package?
- When new version is available, show message.
- corejs?
- Warn when required files (e.g. index.js/index.tsx) are missing
- Add greenkeeper
- Add bundle analyzer (react apps and packages only)
