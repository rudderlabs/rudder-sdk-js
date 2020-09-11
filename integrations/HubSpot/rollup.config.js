import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import sourcemaps from "rollup-plugin-sourcemaps";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import json from "rollup-plugin-json";
import gzipPlugin from "rollup-plugin-gzip";
import brotli from "rollup-plugin-brotli";
import * as webPackage from "./package.json";

let distFileName = "";
let {version} = webPackage;
let moduleType = "web";
distFileName = "HSPlugin.js";

const outputFiles = [];

outputFiles.push({
  file: distFileName,
  format: "iife",
  name: "HSPlugin",
  sourcemap:
    process.env.PROD_DEBUG_INLINE == "true"
      ? "inline"
      : !!process.env.PROD_DEBUG,
});

export default {
  input: "index.js",
  output: outputFiles,
  plugins: [
    sourcemaps(),
    replace({
      "process.browser": process.env.NODE_ENV != "true",
      "process.prod": process.env.ENV == "prod",
      "process.package_version": version,
      "process.module_type": moduleType,
    }),
    resolve({
      jsnext: true,
      browser: true,
      preferBuiltins: false,
    }),

    commonjs({
      include: "node_modules/**",
      /* namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        Xmlhttprequest: ["Xmlhttprequest"]
      } */
      exclude: "*/node_modules"
    }),

    json(),
    globals(),
    builtins(),

    babel({
      exclude: "node_modules/**",
    }),
    process.env.uglify === "true" && terser(),
    process.env.ENC === "gzip" && gzipPlugin(),
    process.env.ENC === "br" && brotli(),
  ],
};
