/* eslint-env node */

import babel from "@rollup/plugin-babel";
import pkg from "./package.json";

const commonConfig = {
  input: "src/index.js",
  plugins: [
    babel({
      babelHelpers: "bundled"
    })
  ],
  external: [
    "react",
    "react-dom",
    "prop-types"
  ]
};

export default [
  // CommonJS build
  {
    output: {
      file: pkg.main,
      format: "cjs"
    },
    ...commonConfig
  },
  // ESM Build
  {
    output: {
      file: pkg.module,
      format: "esm"
    },
    ...commonConfig
  }
];
