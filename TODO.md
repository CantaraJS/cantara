# TODO

## Required

- Test if built React Components can be installed
- Simple Starter: Image of the day app
  - Same API: Serverless and normal Node + Express
    - Powered by the same NodeJS "core-api" library
  - React App that features image of the day
    - Uses re-usable React Component (widget)
  - Deployment
    - Github Actions
    - AWS Lambda
    - Zeit/Surge/...
  - Write tests4
- Create an organization on GitHub
  - Transfer all repositories to it
  - When searching for starter templates, update URL accordingly
- Write somewhat complete docs
- Implement "help" and "version" command
- Talk to CD try to integrate Cantara into their current workflow
  - Find out if tool is good enough for deployment needs
  - Customization needs? e.g. extending wepback/babel/TS config etc
- Implement Novitas Auth with Cantara and use it in Photogram
  - Write good docs for other developers
- Port Photogram Codebase to Cantara
- Write integration tests for CLI
- After first release: Use commitizen
  - https://github.com/commitizen/cz-cli

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
