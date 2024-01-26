juicy-run
=================

Easily manage and execute package.json scripts with your choice of package manager.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g juicy-run
$ jr COMMAND
running command...
$ jr (--version)
juicy-run/1.0.1 darwin-arm64 node-v20.10.0
$ jr --help [COMMAND]
USAGE
  $ jr COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`jr`](#jr)
* [`jr get`](#jr-get)
* [`jr set PACKAGEMANAGER`](#jr-set-packagemanager)

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
  $ jr --packageManager npm
  # Run a script with a specified package manager (yarn)
  $ jr --packageManager yarn
  # Run a script with a specified package manager (pnpm)
  $ jr --packageManager pnpm
  # Run a script with a specified package manager (bun)
  $ jr --packageManager bun
```

_See code: [dist/index.ts](https://github.com/juicyjusung/juicy-run/blob/v1.0.1/dist/index.ts)_

## `jr get`

Retrieve the package manager from the configuration

```
USAGE
  $ jr get [-g]

FLAGS
  -g, --global  Retrieve the package manager from the global configuration

DESCRIPTION
  Retrieve the package manager from the configuration

EXAMPLES
  # Retrieve the package manager for the current project
  $ jr get
  # Example output if npm is configured as the package manager
  npm (./path/to/your/package.json)
```

_See code: [dist/get.ts](https://github.com/juicyjusung/juicy-run/blob/v1.0.1/dist/get.ts)_

## `jr set PACKAGEMANAGER`

Set the package manager for the current project

```
USAGE
  $ jr set PACKAGEMANAGER [-g]

ARGUMENTS
  PACKAGEMANAGER  (bun|npm|pnpm|yarn) Specify the package manager to be set for the project. Valid options are "bun",
                  "npm", "pnpm", and "yarn".

FLAGS
  -g, --global  Set the package manager globally if the local project configuration is not present. This flag also
                determines whether to use the global configuration as a fallback when the local project configuration is
                missing.

DESCRIPTION
  Set the package manager for the current project

EXAMPLES
  # Set npm as the package manager
  $ jr set npm
  # Set yarn as the package manager
  $ jr set yarn
  # Set pnpm as the package manager
  $ jr set pnpm
```

_See code: [dist/set.ts](https://github.com/juicyjusung/juicy-run/blob/v1.0.1/dist/set.ts)_
<!-- commandsstop -->
