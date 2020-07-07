import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
const postcss = require("rollup-plugin-postcss");

export const babelConfigDefault = {
  presets: [
    "@babel/react",
    [
      "@babel/env",
      {
        targets: "> 0.25%, not dead",
      },
    ],
  ],
  plugins: ["@babel/proposal-object-rest-spread"],
};
export const postcssConfigDefault = {
  plugins: [
    require("postcss-preset-env"),
    require("postcss-import"),
    require("postcss-mixins"), // before simple vars and nested
    require("postcss-nested"),
    require("postcss-css-variables"),
    require("postcss-modules"),
  ],
};

export const typescriptConfigDefault = {
  compilerOptions: {
    allowSyntheticDefaultImports: true,
    noFallthroughCasesInSwitch: true,
    noUnusedParameters: false,
    noImplicitReturns: true,
    moduleResolution: "node",
    esModuleInterop: true,
    noUnusedLocals: false,
    noImplicitAny: true,
    declarationDir: "dist/types",
    declaration: true,
    target: "esnext",
    module: "es6",
    strict: true,
    jsx: "react",
    plugins: [{ name: "typescript-plugin-css-modules" }],
  },
  include: ["src/**/*"],
  exclude: ["node_modules", "dist"],
};
