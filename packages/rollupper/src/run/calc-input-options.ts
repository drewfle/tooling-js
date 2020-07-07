import { RollupOptions, InputOptions, InputOption, Plugin } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
// Requiring modules without types
const postcss = require("rollup-plugin-postcss");

import { RollupperCliOptions } from "../types";
import { readLocalPackageJson } from "../utils";
import { postcssConfigDefault, typescriptConfigDefault } from "../config";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export interface InputOptionsDefault extends InputOptions {
  input: InputOption;
  plugins: Plugin[];
}

export const inputOptionsDefault: InputOptionsDefault = {
  input: "src/index.ts",
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
  ],
};

export function calcInputOptions(
  cliOptions: RollupperCliOptions,
  localConfigPlugins?: Plugin[],
  localConfigWithoutPlugins?: Omit<InputOptions, "plugins" | "output">
) {
  let calculatedOptions = mergeWithLocalInputConfig(
    inputOptionsDefault,
    localConfigPlugins,
    localConfigWithoutPlugins
  );
  calculatedOptions = configureInputOptions(calculatedOptions, cliOptions);
  return calculatedOptions;
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

function configureInputOptions(
  optionsToBeConfigured: InputOptionsDefault,
  cliOptions: RollupperCliOptions
) {
  const pkg = readLocalPackageJson();
  const configuredOptions = optionsToBeConfigured;

  if (cliOptions.buildType === "lib") {
    configuredOptions.external = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ];
  }
  if (cliOptions.buildType === "bundle") {
    configuredOptions.plugins.push(
      replace({
        "process.env.NODE_ENV": process.env.NODE_ENV,
      })
    );
  }

  return configuredOptions;
}
