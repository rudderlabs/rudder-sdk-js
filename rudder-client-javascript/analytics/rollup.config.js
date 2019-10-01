import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";

export default {
  input: "analytics.js",
  external: ["Xmlhttprequest"],
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
    replace({
      "process.browser": process.env.NODE_ENV == "true" ? false : true
    }),
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**"
    }),
    process.env.uglify === "true" && terser()
    //process.env.uglify === "true" && uglify()
  ]
};
