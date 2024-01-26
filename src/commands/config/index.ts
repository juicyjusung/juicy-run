import select from '@inquirer/select';
import { Command, Flags} from '@oclif/core'
import { colorize } from '@oclif/core/lib/cli-ux/index.js'

import { PACKAGE_MANAGER_KEY, getConfigStore } from '../../libs/config-store.js'
import { findPackageJson } from '../../libs/utils.js'

export default class Config extends Command {
  static description = 'This command configures the global & project-specific package manager for your project. If no project-specific package manager is set, this global will be used as a fallback.';

  static examples = [``]

  static flags = {
    'set-global-pm': Flags.string({
      aliases: ['global', 'g'],
      description: 'Set your gloabl package manager for the project. This serves as a fallback when a project-specific package manager is not defined. Choose from "bun", "npm", "pnpm", or "yarn".',
      name: 'set-gloabl-pm',
      options: ['bun', 'npm', 'pnpm', 'yarn'],
      required: false,
    }),
  }

  public info(msg: string): void {
    this.log(colorize(this.config.theme?.info, 'info:'), msg)
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Config)

    const setGlobalPMFlag = flags['set-global-pm'];
    if(setGlobalPMFlag) {
      const config = getConfigStore('global')
      config.set(PACKAGE_MANAGER_KEY, setGlobalPMFlag)
      this.log(`Global package manager set to '${setGlobalPMFlag}'. This will be used as a fallback if no project-specific package manager is set.`);
      return;
    }

    const globalStore = getConfigStore('global')

    if(!globalStore.get(PACKAGE_MANAGER_KEY)) {
      const selectedGlobalPM = await this.selectPackageManager();
      globalStore.set(PACKAGE_MANAGER_KEY, selectedGlobalPM)
      this.log(`Global package manager set to '${selectedGlobalPM}'. This will act as a fallback in the absence of a project-specific package manager.`);
    }

    const packageJson = await findPackageJson()

    if (!packageJson) {
      this.error('No package.json found')
    }

    const { data, path} = packageJson
    const configStore = getConfigStore(path);
    const currentPM = configStore.get(PACKAGE_MANAGER_KEY)
    this.log(`[ ${data.name || ''} ] Current package manager is ${currentPM}  - (${path})`);

    const newProjectPM = await this.selectPackageManager();
    configStore.set(PACKAGE_MANAGER_KEY, newProjectPM);
    this.log(`[ ${data.name || ''} ] Package manager set to ${newProjectPM}  - (${path})`);
  }

  async selectPackageManager(message = 'Select a package manager') {
    return select({
      choices: [
        { description: 'bun', name: 'bun',value: 'bun' },
        { description: 'npm', name: 'npm', value: 'npm',  },
        { description: 'pnpm', name: 'pnpm', value: 'pnpm',  },
        { description: 'yarn', name: 'yarn' ,value: 'yarn',  },
      ],
      message,
    });
  }
}
