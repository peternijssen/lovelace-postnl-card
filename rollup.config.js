import resolve from 'rollup-plugin-node-resolve';
import postcss from "rollup-plugin-postcss";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import minify from 'rollup-plugin-babel-minify';

export default {
  input: ['src/main.js'],
  output: {
    file: 'dist/postnl-card.js',
    format: 'umd',
    name: 'PostNLCard',
  },
  plugins: [
    resolve(),
    postcss({
      extensions: [".css"]
    }),
    babel({
      exclude: "node_modules/**",
      babelrc: false
    }),
    terser(),
    //minify(),
  ],
};