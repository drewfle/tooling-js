import { InputOptions, Plugin } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
// Requiring modules without types
const postcss = require("rollup-plugin-postcss");
const { getBabelOutputPlugin } = require("@rollup/plugin-babel");

import { BundlerCliOptions } from "../types";
import { readLocalPackageJson } from "../utils";
import {
  babelConfigDefault,
  postcssConfigDefault,
  typescriptConfigDefault,
} from "../config";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export type InputOptionsDefault = {
  plugins: Plugin[];
} & InputOptions;

export const inputOptionsDefault: InputOptionsDefault = {
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
      tsconfigDefaults: typescriptConfigDefault,
    }),
    commonjs(),
    nodeResolve({ extensions }),
    replace({
      "process.env.NODE_ENV": process.env.NODE_ENV,
    }),
  ],
};

export function calcInputOptions(
  cliOptions: BundlerCliOptions,
  localConfigPlugins?: Plugin[],
  localConfigWithoutPlugins?: Omit<InputOptions, "plugins" | "output">
) {
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

  configuredOptions.input = !src.includes("/") ? `${src}/index.ts` : src;
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
