import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "analytics.js",
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
    replace({ "process.browser": true }),
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**"
    })
    //process.env.BUILD_ENV === "uglify" && uglify()
  ]
};
