import Conf from 'conf'

import { PackageManager } from './types.js'

const PROJECT_NAME = 'juicy-run'
export const PACKAGE_MANAGER_KEY = 'packageManager'

export const schema = {
  packageManager: {
    default: 'npm',
    description: 'package manager to use',
    enum: ['bun', 'npm', 'pnpm', 'yarn'],
    type: 'string',
  }
}

export type Configs = {
  packageManager: PackageManager;
}

export const getConfigStore = (configName: string) => new Conf<Configs>({configName, projectName: PROJECT_NAME, schema})
