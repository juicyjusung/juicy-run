import { Command, Flags } from '@oclif/core'
import { search } from 'fast-fuzzy';
import autocomplete from 'inquirer-autocomplete-standalone';
import { spawn } from 'node:child_process'

import { PACKAGE_MANAGER_KEY, getConfigStore } from '../libs/config-store.js'
import { PackageManager } from '../libs/types.js'
import { findPackageJson, getRunCommand } from '../libs/utils.js'


export default class Main extends Command {

  static description = 'Run a script from package.json using a specified package manager'

  static examples = [
    `# Run a script with the default package manager
$ <%= config.bin %>

# Run a script with a specified package manager (npm)
$ <%= config.bin %> --pm npm

# Run a script with a specified package manager (yarn)
$ <%= config.bin %> --pm yarn

# Run a script with a specified package manager (pnpm)
$ <%= config.bin %> --pm pnpm

# Run a script with a specified package manager (bun)
$ <%= config.bin %> --pm bun
`,
  ]

  static flags = {
    packageManager: Flags.string(
      {
        aliases: ['pm'],
        char: 'p',
        description: 'package manager to use',
        options: ['bun', 'npm', 'pnpm', 'yarn'],
      }
    ),
  }

  static strict = false


  async run(): Promise<void> {
    try {
      const {argv, flags} = await this.parse(Main)

      const packageJson = await findPackageJson()
      if (!packageJson) {
        this.error('package.json not found')
      }

      const {path} = packageJson
      const config = getConfigStore(path)

      const packageManager: PackageManager = (flags.packageManager as PackageManager) || config.get(PACKAGE_MANAGER_KEY)

      const {data: packageJsonData, path: packageJsonPath} = packageJson

      if (!packageJsonData) {
        this.error('package.json not found')
      }

      if (!packageJsonData.scripts) {
        this.error('Scripts not found in package.json')
      }

      const scripts = Object.keys(packageJsonData.scripts).map((key) => ({
        value: key,
      }))

      const answer = await autocomplete({
        message: `Select a script to run with ${packageManager} : `,
        async source(input) {
          if(!input) return scripts
          return search(input, scripts, {keySelector: (s) => s.value, threshold: 0.5})
        }
      })


      const selectedScript = answer

      const scriptCommand = packageJsonData.scripts[selectedScript]
      if (!scriptCommand) {
        this.log(`Script "${selectedScript}" not found in package.json`)
        return
      }

      const command = getRunCommand(packageManager, selectedScript)

      const child = spawn(command, argv.map(String), {
        cwd: packageJsonPath,
        env: {...process.env, PATH: process.env.PATH},
        shell: true,
        stdio: 'inherit',
      })

      child.on('close', (code) => {
        this.log(`exited with code ${code}`)
      })

      child.on('error', (error) => {
        this.error(`error: ${error.message}`)
      })

    } catch (error) {
      if (error instanceof Error) {
        this.error(`${error.message}`)
      }

      this.error(String(error))
    }
  }
}

