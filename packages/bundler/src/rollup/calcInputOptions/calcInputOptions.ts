import { InputOptions, Plugin } from "rollup";
import path from "path";
// @ts-ignore
import babelPlugin from "@rollup/plugin-babel";
const baseTsConfig = require("@drewfle/config/typescript/tsconfig-base.json");
import { BundlerCliOptions } from "../../cli";
import configureInputOptions from "./configureInputOptions";
import mergeWithLocalInputConfig from "./mergeWithLocalInputConfig";
import getInputOptionsDefault from "./getInputOptionsDefault";

export default function calcInputOptions(
  cliOptions: BundlerCliOptions,
  localConfigPlugins?: Plugin[],
  localConfigWithoutPlugins?: Omit<InputOptions, "plugins" | "output">
) {
  const srcDir = path.dirname(cliOptions.src);
  const distDir = path.dirname(cliOptions.dist);
  const {
    compilerOptions: baseCompilerOptions,
    ...restBaseTsConfig
  } = baseTsConfig;
  const tsconfig = {
    compilerOptions: {
      ...baseCompilerOptions,
      declarationDir: path.join(distDir, "types"),
    },
    include: [`${srcDir}/**/*`],
    exclude: ["node_modules", distDir],
    ...restBaseTsConfig,
  };

  const inputOptionsDefault = getInputOptionsDefault(cliOptions, tsconfig);
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
