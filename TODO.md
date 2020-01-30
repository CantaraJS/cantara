# TODO

## Required

- Make testing work (including cypress, implement Cantara command to start all needed servers)
- Make building/deploying/publishing work
  - Implement command "exec-changed <appname> [cmd...]" which executes a command only if the specified app changed
  - Make sure react-component production build works as expected
- Write somewhat complete docs
  - Good getting started guide. Simple -> Advanced
  - Documentation of all commands
  - Documentation of crana.config.js
  - Documentation on "how to do X"
    - ...
- Write integration tests for CLI

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
