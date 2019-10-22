import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import strip from "rollup-plugin-strip";

export default {
  input: "analytics.js",
  external: ["Xmlhttprequest", "universal-analytics"],
  output: [
    /* {
      file: "dist/browser.min.js",
      format: "iife",
      name: "analytics"
    }, */
    {
      file: "dist/node.js",
      format: "cjs"
    }
  ],
  plugins: [
    replace({
      "process.browser": process.env.NODE_ENV == "true" ? false : true,
      "process.prod": process.env.ENV == "prod" ? true : false
    }),
    process.env.ENV == "prod" && strip(),
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**"
    }),
    process.env.uglify === "true" && terser()
    //process.env.uglify === "true" && uglify()
  ]
};
