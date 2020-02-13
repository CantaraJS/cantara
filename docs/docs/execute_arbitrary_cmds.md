---
id: execute_arbitrary_cmds
title: Executing arbitrary commands for apps/packages
---

Instead of `cd`-ing every time into the direcory of an app or package, you can just use the `run` command. This executes the specified command in the directory of the specified app/package.

**Example**: List the directory content of your express-api

```bash
ctra run express-api ls
```

**Note**: For NPM commands, `npm` can be left away. So when you for example want to install a new package, execute

```bash
ctra run express-api install cors
```

This installs the package `cors` from NPM.
