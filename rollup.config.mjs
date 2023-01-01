import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import commonJS from '@rollup/plugin-commonjs'
import polyfillNode from 'rollup-plugin-polyfill-node'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)

const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}
const name = packageOptions.filename || path.basename(packageDir)

// 定义输出类型对应的编译项
const outputConfigs = {
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    name: name,
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  }
}

const defaultFormats = ['esm-bundler', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats
const packageConfigs = packageFormats.map(format => createConfig(format, outputConfigs[format]))


export default packageConfigs

function createConfig(format, output, plugins = []) {
  // 是否输出声明文件
  const shouldEmitDeclarations = !!pkg.types

  const tsPlugin = ts({
    target: format === 'cjs' ? 'es2019' : 'es2015',
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    tsconfigOverride: {
      compilerOptions: {
        target: format === 'cjs' ? 'es2019' : 'es2015',
        sourceMap: true,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations
      }
    }
    
  })
  const nodePlugins =
  (format === 'cjs' && Object.keys(pkg.devDependencies || {}).length) ? [
        commonJS({
          sourceMap: false
        }),
        ...(format === 'cjs' ? [] : [polyfillNode()]),
        nodeResolve()
      ]
          : []
  const minifyPlugin = format === 'global' && format === 'esm-browser' ? [terser()] : []
  return {
      input: resolve('src/index.ts'),
  // Global and Browser ESM builds inlines everything so that they can be
  // used alone.
  external: [
      ...['path', 'fs', 'os', 'http'],
      ...Object.keys(pkg.dependencies||{}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.devDependencies||{}),
    ],
  plugins: [
    json({
      namedExports: false
    }),
    tsPlugin,
    ...nodePlugins,
    ...minifyPlugin,
    ...plugins
  ],
  output,
  onwarn: (msg, warn) => {
    if (!/Circular/.test(msg)) {
      warn(msg)
    }
  },
  treeshake: {
    moduleSideEffects: false
  }
  }
}