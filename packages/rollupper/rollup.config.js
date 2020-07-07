import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json'

const extensions = [
  '.ts', '.js'
];

export default {
  input: 'src/index.ts',
  output: {
    file: pkg.main,
    format: 'cjs',
  },
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    resolve({ extensions })
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
};