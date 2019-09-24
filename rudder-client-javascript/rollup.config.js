import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "RudderClient.js",
  output: [
    {
      file: "dist/bundle_iife.js",
      format: "iife",
      name: "analytics"
    },
    {
      file: "dist/bundle_cjs.js",
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
