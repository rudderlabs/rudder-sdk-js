import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import json from "rollup-plugin-json";
import obfuscatorPlugin from "rollup-plugin-javascript-obfuscator";

export default {
  input: "analytics.js",
  external: ["Xmlhttprequest", "universal-analytics"],
  output: [
    {
      file:
        process.env.ENV == "prod" ? "dist/browser.min.js" : "dist/browser.js",
      format: "iife",
      name: "rudderanalytics",
      sourceMap: true,
      sourceMapMode: "inline"
    } /* ,
    {
      file: "dist/node.js",
      format: "cjs"
    } */
  ],
  plugins: [
    replace({
      "process.browser": process.env.NODE_ENV == "true" ? false : true,
      "process.prod": process.env.ENV == "prod" ? true : false,
      "process.package_version": process.env.npm_package_version
    }),
    resolve({
      jsnext: true,
      browser: true
    }),

    commonjs({
      include: "node_modules/**"
      /* namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        Xmlhttprequest: ["Xmlhttprequest"]
      } */
    }),

    json(),
    globals(),
    builtins(),

    babel({
      exclude: "node_modules/**"
    }),
    process.env.uglify === "true" && terser(),
    process.env.ENV == "prod" &&
      obfuscatorPlugin({
        compact: true
      })
    //process.env.uglify === "true" && uglify()
  ]
};
