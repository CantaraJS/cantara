# TODO

## Required

- Make building/deploying/publishing work
  - Implement "test-changed" command
  - Implement "ci" command
    - Executes "test-changed" and then "build-changed"
  - Implement "exec-changed <appname> [cmd...]" command
    - Executes an arbitrary command if the specified app changed
  - Packages
    - Make sure building, publishing and consuming react-components/browser-packages/node-packages works
- Write somewhat complete docs
  - Good getting started guide. Simple -> Advanced
  - Documentation of all commands
  - Documentation of crana.config.js
  - Guides on "how to do X" / Explainations of more complex topics
    - Testing
      - Unit
      - Integration / e2e
    - Deployment/CI using exec-changed
      - Maybe implement an explicit "ci" command which re-builds and runs tests for changed code only
    - ...
- Talk to CD try to integrate Cantara into their current workflow
  - Find out if tool is good enough for deployment needs
  - Customization needs? e.g. extending wepback/babel/TS config etc
- Implement Novitas Auth with Cantara and use it in Photogram
  - Write good docs for other developers
- Port Photogram Codebase to Cantara
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
