# TODO

## Required

- Make nice landing page
  - Possible slogans
    - A CLI tool to create FullStack React apps in minutes
    - Like Create React App, but Fullstack!
  - Subtitle: Stop configuring, start coding.
  - Tech Stack: TypeScript, NodeJS, Serverless, React
  - Features
    - Develop modern React webapps with TypeScript
    - Develop NodeJS APIs using TypeScript
    - Develop and deploy servereess endpoints using TypeScript
    - Publish packages to NPM with auto-generated TypeScript typing with one command
  - Make clear it's alpha version
- Publish docs site
- Write README for Cantara itself
- Implement "help" and "version" command
- Talk to CD try to integrate Cantara into their current workflow
  - Find out if tool is good enough for deployment needs
  - Customization needs? e.g. extending wepback/babel/TS config etc
- Implement Novitas Auth with Cantara and use it in Photogram
  - Write good docs for other developers
- Improve UI/UX of CLI
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
