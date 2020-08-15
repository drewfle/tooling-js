import { InputOptions, Plugin } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
const postcss = require("rollup-plugin-postcss");
const { getBabelOutputPlugin } = require("@rollup/plugin-babel");
const baseTsConfig = require("@drewfle/config/typescript/tsconfig-base.json");
const basePostCssConfig = require("@drewfle/config/postcss/postcss.config-base.js");
const baseBabelConfig = require("@drewfle/config/babel/babel.config-base.json");

import { BundlerCliOptions } from "../types";
import { readLocalPackageJson } from "../utils";

const babelConfigDefault = { ...baseBabelConfig };
const postcssConfigDefault = {
  ...basePostCssConfig,
};
const typescriptConfigDefault = {
  ...baseTsConfig,
  include: ["src-ts-node/**/*"],
  exclude: ["node_modules", "dist-ts-node"],
};

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export type InputOptionsDefault = {
  plugins: Plugin[];
} & InputOptions;

export const getInputOptionsDefault = (tsconfig: any): InputOptionsDefault => ({
  plugins: [
    postcss({
      extract: true,
      options: {
        config: {
          ctx: postcssConfigDefault,
        },
      },
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigDefaults: tsconfig,
    }),
    commonjs(),
    nodeResolve({ extensions }),
    replace({
      "process.env.NODE_ENV": process.env.NODE_ENV,
    }),
  ],
});

export function calcInputOptions(
  cliOptions: BundlerCliOptions,
  localConfigPlugins?: Plugin[],
  localConfigWithoutPlugins?: Omit<InputOptions, "plugins" | "output">
) {
  const tsconfig = { ...typescriptConfigDefault };
  const inputOptionsDefault = getInputOptionsDefault(tsconfig);
  let calculatedOptions = configureInputOptions(
    inputOptionsDefault,
    cliOptions
  );
  calculatedOptions = mergeWithLocalInputConfig(
    calculatedOptions,
    localConfigPlugins,
    localConfigWithoutPlugins
  );

  return calculatedOptions;
}

function configureInputOptions(
  optionsToBeConfigured: InputOptionsDefault,
  cliOptions: BundlerCliOptions
) {
  const pkg = readLocalPackageJson();
  const configuredOptions = optionsToBeConfigured;
  const { output, src, babel, external } = cliOptions;

  configuredOptions.input = calcSrc(src);
  if (output === "browser" || babel) {
    configuredOptions.plugins = [
      getBabelOutputPlugin({
        allowAllFormats: true,
        ...babelConfigDefault,
      }),
    ];
  }
  if (external || output === "lib-es" || output === "lib-cjs") {
    configuredOptions.external = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ];
  }

  return configuredOptions;
}

function mergeWithLocalInputConfig(
  optionsToBeMerged: InputOptionsDefault,
  localConfigPlugins?: Plugin[],
  localConfigWithoutPlugins?: Omit<InputOptions, "plugins" | "output">
) {
  if (!localConfigPlugins && !localConfigWithoutPlugins) {
    return optionsToBeMerged;
  }

  const mergedOptions = {
    ...optionsToBeMerged,
    ...localConfigWithoutPlugins,
  };
  if (localConfigPlugins) {
    mergedOptions.plugins = [...mergedOptions.plugins, ...localConfigPlugins];
  }

  return mergedOptions;
}

function calcSrc(src: string) {
  return !src.includes("/") ? `${src}/index.ts` : src;
}
