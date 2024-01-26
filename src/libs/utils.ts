import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

import { PackageJson, PackageManager } from './types.js'

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
