/* eslint-disable import/no-extraneous-dependencies */
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import json from "@rollup/plugin-json";
import gzipPlugin from "rollup-plugin-gzip";
import brotli from "rollup-plugin-brotli";
import visualizer from "rollup-plugin-visualizer";
import filesize from "rollup-plugin-filesize";
import * as webPackage from "./package.json";
// eslint-disable-next-line import/no-relative-packages
import * as npmPackage from "./dist/rudder-sdk-js/package.json";
import { INTG_SUFFIX } from "./utils/constants";

let distFileName = "";
let { version } = webPackage;
let moduleType = "cdn";

switch (process.env.ENV) {
  case "prod":
    switch (process.env.ENC) {
      case "gzip":
        if (process.env.PROD_DEBUG_INLINE === "true") {
          distFileName = `dist/integrations/${process.env.INTG_NAME}-map.min.gzip.js`;
        } else {
          distFileName = `dist/integrations/${process.env.INTG_NAME}.min.gzip.js`;
        }
        break;
      case "br":
        if (process.env.PROD_DEBUG_INLINE === "true") {
          distFileName = `dist/integrations/${process.env.INTG_NAME}-map.min.br.js`;
        } else {
          distFileName = `dist/integrations/${process.env.INTG_NAME}.min.br.js`;
        }
        break;
      default:
        if (process.env.PROD_DEBUG_INLINE === "true") {
          distFileName = `dist/integrations/${process.env.INTG_NAME}-map.min.js`;
        } else {
          distFileName = `dist/integrations/${process.env.INTG_NAME}.min.js`;
        }
        break;
    }
    break;
  default:
    distFileName = `dist/integrations/${process.env.INTG_NAME}.js`;
    break;
}

const outputFiles = [];
if (process.env.NPM === "true") {
  outputFiles.push({
    file: `dist/integrations/${process.env.INTG_NAME}/index.js`,
    format: "umd",
    name: `${process.env.INTG_NAME}`,
  });
  version = npmPackage.version;
  moduleType = "npm";
} else {
  outputFiles.push({
    file: distFileName,
    format: "iife",
    name: `${process.env.INTG_NAME}${INTG_SUFFIX}`,
    sourcemap:
      process.env.PROD_DEBUG_INLINE === "true"
        ? "inline"
        : !!process.env.PROD_DEBUG,
  });
}

export default {
  input: `integrations/${process.env.INTG_NAME}/index.js`,
  external: [],
  output: outputFiles,
  plugins: [
    replace({
      preventAssignment: true,
      "process.browser": process.env.NODE_ENV !== "true",
      "process.prod": process.env.ENV === "prod",
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
    }),

    json(),
    globals(),
    builtins(),

    babel({
      inputSourceMap: true,
      babelHelpers: "bundled",
      exclude: ["node_modules/@babel/**", "node_modules/core-js/**"],
      presets: [
        [
          "@babel/env",
          {
            corejs: "3.6",
            useBuiltIns: "entry",
            targets: {
              edge: "15",
              firefox: "40",
              ie: "10",
              chrome: "37",
              safari: "7",
              opera: "23",
            },
          },
        ],
      ],
      plugins: [
        [
          "@babel/plugin-proposal-class-properties",
          {
            loose: true,
          },
        ],
        [
          "@babel/plugin-proposal-private-property-in-object",
          {
            loose: true,
          },
        ],
        [
          "@babel/plugin-proposal-private-methods",
          {
            loose: true,
          },
        ],
        ["@babel/plugin-transform-arrow-functions"],
        ["@babel/plugin-transform-object-assign"],
      ],
    }),
    process.env.uglify === "true" && terser({
        // remove all comments
        format: {
          comments: false,
        },
      }),
    process.env.ENC === "gzip" && gzipPlugin(),
    process.env.ENC === "br" && brotli(),
    process.env.visualizer === "true" &&
      process.env.uglify === "true" &&
      visualizer({
        filename: `./stats/${process.env.INTG_NAME}.html`,
        title: `Rollup Visualizer - ${process.env.INTG_NAME}`,
        sourcemap: true,
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    filesize({
      showBeforeSizes: "build",
      showBrotliSize: true,
    }),
  ],
};
