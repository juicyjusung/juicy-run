juicy-run
=================
<div align="center">
  <img src="https://github.com/juicyjusung/juicy-run/assets/46892438/66af1e2d-fb19-4862-99cf-a9c0a1433f8d" width="250">
  <p>Easily manage and execute package.json scripts with your choice of package manager.</p>
</div>

<div align="center">
  <img src="https://github.com/juicyjusung/juicy-run/assets/46892438/ea850a87-39a2-4851-9d8f-d7fb187f6266" width="500">
</div>

[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Install
```sh-session
$ npm install -g juicy-run
```


# Usage
<!-- usage -->
```sh-session
$ jr config -g bun

$ jr
running command...

$ jr --version
juicy-run/1.1.0 darwin-arm64 node-v20.10.0

$ jr --help [COMMAND]
USAGE
  $ jr COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`jr`](#jr)
* [`jr config`](#jr-config)

## `jr`

Run a script from package.json using a specified package manager

```
USAGE
  $ jr  [-p bun|npm|pnpm|yarn]

FLAGS
  -p, --packageManager=<option>  package manager to use
                                 <options: bun|npm|pnpm|yarn>

DESCRIPTION
  Run a script from package.json using a specified package manager

EXAMPLES
  # Run a script with the default package manager
  $ jr
  # Run a script with a specified package manager (npm)
  $ jr --pm npm
  # Run a script with a specified package manager (yarn)
  $ jr --pm yarn
  # Run a script with a specified package manager (pnpm)
  $ jr --pm pnpm
  # Run a script with a specified package manager (bun)
  $ jr --pm bun
```

_See code: [src/commands/index.ts](https://github.com/juicyjusung/juicy-run/blob/v1.1.0/src/commands/index.ts)_

## `jr config`

This command configures the global & project-specific package manager for your project. If no project-specific package manager is set, this global will be used as a fallback.

```
USAGE
  $ jr config [--set-global-pm bun|npm|pnpm|yarn]

FLAGS
  --set-global-pm=<option>  Set your gloabl package manager for the project. This serves as a fallback when a
                            project-specific package manager is not defined. Choose from "bun", "npm", "pnpm", or
                            "yarn".
                            <options: bun|npm|pnpm|yarn>

DESCRIPTION
  This command configures the global & project-specific package manager for your project. If no project-specific package
  manager is set, this global will be used as a fallback.
```

_See code: [src/commands/config/index.ts](https://github.com/juicyjusung/juicy-run/blob/v1.1.0/src/commands/config/index.ts)_
<!-- commandsstop -->
