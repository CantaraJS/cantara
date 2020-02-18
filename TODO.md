# TODO

## Required

- support org packages
- Ask for feedback / Talk to CD try to integrate Cantara into their current workflow
  - Find out if tool is good enough for deployment needs
  - Customization needs? e.g. extending wepback/babel/TS config etc
- Implement Novitas Auth with Cantara and use it in Photogram
  - Write good docs for other developers
- Implement version pinning like cra did with "react-scripts"
- Improve UI/UX of CLI
  - Switch back to commander
  - Use enquirer for autocompletion
  - Better error messages
- Write integration tests for CLI
- First public release
  - Issue template
  - Code of Conduct
  - Contribution guidelines
  - Write articles about Cantara, cross post on dev.to
  - But use Docusaurus for original blog posts
- Port Photogram Codebase to Cantara
- After first release: Use commitizen
  - https://github.com/commitizen/cz-cli

## Nice to have

- Faster installing
  - One possible idea: Dependency Lazy installing
    - Only install a dependecy when it is first used
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
