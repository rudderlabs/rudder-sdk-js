import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "test.js",
  output: [
    {
      file: "dist/browser.js",
      format: "iife",
      name: "analytics"
    },
    {
      file: "dist/node.js",
      format: "cjs"
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**"
    })
  ]
};
