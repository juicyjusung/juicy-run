import { Args, Command, Flags} from '@oclif/core'

import { PACKAGEMANAGER_KEY, findPackageJson, getConf } from './index.js'

export default class SetPackageManager extends Command {
  static args = {
    packageManager: Args.string({
      description: 'Specify the package manager to be set for the project. Valid options are "bun", "npm", "pnpm", and "yarn".',
      name: 'packageManager',
      options: ['bun', 'npm', 'pnpm', 'yarn'],
      required: true,
    }),
  }

  static description = 'Set the package manager for the current project'

  static examples = [
    `# Set npm as the package manager
$ <%= config.bin %> <%= command.id %> npm

# Set yarn as the package manager
$ <%= config.bin %> <%= command.id %> yarn

# Set pnpm as the package manager
$ <%= config.bin %> <%= command.id %> pnpm
`,
  ]

  static flags = {
    global: Flags.boolean({
      char: 'g',
      default: false,
      description: 'Set the package manager globally if the local project configuration is not present. This flag also determines whether to use the global configuration as a fallback when the local project configuration is missing.'
    })
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(SetPackageManager)
    const {packageManager} = args

    const packageJson = await findPackageJson()

    if (!packageJson) {
      this.error('No package.json found')
    }

    const {data, path} = packageJson

    if (flags.global) {
      const config = getConf('global')
      config.set(PACKAGEMANAGER_KEY, packageManager)
      this.log(`Global package manager updated to '${packageManager}'`)
      return
    }

    this.log(`Package manager updated to '${packageManager}' for the local project '${data.name || 'unknown'}' at '${path}'`)

    const config = getConf(path)

    config.set(PACKAGEMANAGER_KEY, packageManager)

  }
}
