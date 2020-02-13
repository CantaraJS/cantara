---
id: continous_integration
title: Continous Integration
---

One very useful command for CI is the `build-changed` command.

```bash
ctra build-changed
```

This will only rebuild the parts of your repository which changed since the last commit and can therfore save precious CI execution time.

The counterpart for testing is:

```bash
ctra test-changed
```

Like this, you can re-build and test only the parts of your repository which actually changed.

Currently, you need to integrate those commands with your CI system yourself. Contributions in that area are very welcome!

To execute arbitrary commands when parts of the repository changed, you can use the `exec-changed` command. **Example**:

```bash
ctra exec-changed express-api ./upload-to-server.sh
```

If you execute this command in your CI system, the `upload-to-server.sh` script will only be executed if the code in `node-apps/express-api` changed since the last commit. This command can be useful to do stuff like uploading newly generated assets to a CDN or a server.
