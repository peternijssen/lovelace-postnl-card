import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
  input: ['src/main.js'],
  output: {
    file: 'dist/postnl-card.js',
    format: 'umd',
    name: 'PostNLCard',
  },
  plugins: [
    resolve(),
    terser(),
  ],
};