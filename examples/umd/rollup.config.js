import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import json from "rollup-plugin-json";
import gzipPlugin from "rollup-plugin-gzip";
import brotli from "rollup-plugin-brotli";

export default {
  input: "index.js",
  external: ["Xmlhttprequest", "universal-analytics"],
  output: [{ file: "dist/browser.js", format: "iife", name: "test" }],
  plugins: [
    resolve({
      jsnext: true,
      browser: true,
    }),

    commonjs({
      include: "node_modules/**",
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
