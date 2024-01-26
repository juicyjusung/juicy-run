import { Command, Flags } from '@oclif/core'
import Conf from 'conf'
import { default as inquirer } from 'inquirer'
import { spawn } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import * as path from 'node:path'

export const PROJECT_NAME = 'juicy-run'
export const PACKAGEMANAGER_KEY = 'packageManager'


export type Configs = {
  packageManager: PackageManager;
}

const schema = {
  packageManager: {
    default: 'npm',
    description: 'package manager to use',
    enum: ['bun', 'npm', 'pnpm', 'yarn'],
    type: 'string',
  }
}

export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';

export type PackageJson = {
  data: {
    name?: string;
    scripts?: { [key: string]: string };
    version?: string;
  },
  path: string;
}


export const getConf = (configName: string) => new Conf<Configs>({configName, projectName: PROJECT_NAME, schema})

export const getRunCommand = (packageManager: PackageManager, script: string) => {
  switch (packageManager) {
    case 'npm': {
      return `npm run ${script}`
    }

    case 'pnpm': {
      return `pnpm run ${script}`
    }

    case 'yarn': {
      return `yarn run ${script}`
    }

    case 'bun': {
      return `bun run ${script}`
    }

    default: {
      throw new Error(`Unknown package manager: ${packageManager}`)
    }
  }
}

export async function findPackageJson(): Promise<PackageJson | null> {
  const currentDir = process.cwd()
  return searchPackageJsonUpward(currentDir)
}


async function searchPackageJsonUpward(directory: string): Promise<PackageJson | null> {
  const packagePath = path.join(directory, 'package.json')
  if (await fileExists(packagePath)) {
    try {
      const packageJson = await readPackageJson(packagePath)
      return {
        data: packageJson,
        path: directory,
      } as PackageJson
    } catch (error) {
      console.error('Error reading package.json:', error)
      return null
    }
  }

  const parentDir = path.dirname(directory)
  if (parentDir === directory) {
    return null
  }

  return searchPackageJsonUpward(parentDir)
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}


async function readPackageJson(filePath: string): Promise<PackageJson['data']> {
  const fileContent = await readFile(filePath, 'utf8')
  return JSON.parse(fileContent) as PackageJson['data']
}


export default class Main extends Command {

  static description = 'Run a script from package.json using a specified package manager'

  static examples = [
    `# Run a script with the default package manager
$ <%= config.bin %>

# Run a script with a specified package manager (npm)
$ <%= config.bin %> --packageManager npm

# Run a script with a specified package manager (yarn)
$ <%= config.bin %> --packageManager yarn

# Run a script with a specified package manager (pnpm)
$ <%= config.bin %> --packageManager pnpm

# Run a script with a specified package manager (bun)
$ <%= config.bin %> --packageManager bun
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
      const config = getConf(path)

      const packageManager: PackageManager = (flags.packageManager as PackageManager) || config.get(PACKAGEMANAGER_KEY)

      const {data: packageJsonData, path: packageJsonPath} = packageJson

      if (!packageJsonData) {
        this.error('package.json not found')
      }

      if (!packageJsonData.scripts) {
        this.error('Scripts not found in package.json')
      }

      const scripts = Object.keys(packageJsonData.scripts).map((key) => ({
        name: key,
      }))

      const responses = await inquirer.prompt([{
        choices: scripts,
        message: `Select a script to run with ${packageManager}`,
        name: 'script',
        type: 'list',
      }])

      const selectedScript = responses.script

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

