import { Options } from 'tsup'

const config: Options = {
  entry: ['./index.ts'],
  dts: true,
  cjsInterop: true,
  sourcemap: true,
  format: ['cjs', 'esm', 'iife'],
}

export default config
