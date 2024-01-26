import { Command, Flags } from '@oclif/core'

import { PACKAGEMANAGER_KEY, findPackageJson, getConf } from './index.js'

export default class GetPackageManager extends Command {
  static description = 'Retrieve the package manager from the configuration'

  static examples = [
    `# Retrieve the package manager for the current project
$ <%= config.bin %> <%= command.id %>

# Example output if npm is configured as the package manager
npm (./path/to/your/package.json)
`,
  ]

  static flags = {
    global: Flags.boolean({
      char: 'g',
      default: false,
      description: 'Retrieve the package manager from the global configuration',
    })
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(GetPackageManager)

    if (flags.global) {
      const config = getConf('global')
      const packageManagerFromConfig = config.get(PACKAGEMANAGER_KEY)
      this.log(packageManagerFromConfig)
      return
    }

    const packageJson = await findPackageJson()
    if (!packageJson) {
      this.error('No package.json found')
    }

    const {path} = packageJson

    const config = getConf(path)

    const packageManagerFromConfig = config.get(PACKAGEMANAGER_KEY)

    this.log(packageManagerFromConfig)
  }
}
