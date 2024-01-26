
export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';
export type PackageJson = {
  data: {
    name?: string;
    scripts?: { [key: string]: string };
    version?: string;
  },
  path: string;
}
