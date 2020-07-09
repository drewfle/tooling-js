import { RollupOptions, OutputOptions, ModuleFormat } from "rollup";
import { terser } from "rollup-plugin-terser";
// Requiring modules without types
const { getBabelOutputPlugin } = require("@rollup/plugin-babel");

import { RollupperCliOptions } from "../types";
import { babelConfigDefault } from "../config";

export interface OutputOptionsDefault extends OutputOptions {
  file: string;
  format: ModuleFormat;
}

export const calcOutputOptionsDefault = (
  cliOptions: RollupperCliOptions
): OutputOptionsDefault => ({
  file: `dist/index.${cliOptions.format}.js`,
  format: cliOptions.format,
});

export function calcOutputOptions(
  cliOptions: RollupperCliOptions,
  localOptons: RollupOptions | undefined
) {
  const outputOptionsDefault = calcOutputOptionsDefault(cliOptions);
  let calculatedOptions = configureOutputOptions(
    outputOptionsDefault,
    cliOptions
  );
  // Merge local at last to override existing config
  calculatedOptions = mergeWithLocalOutputConfig(
    calculatedOptions,
    localOptons
  );

  return calculatedOptions;
}

function mergeWithLocalOutputConfig(
  optionsToBeMerged: OutputOptionsDefault,
  localConfigOutput: OutputOptions | undefined
) {
  if (!localConfigOutput) {
    return optionsToBeMerged;
  }
  const mergedOptions = { ...optionsToBeMerged, ...localConfigOutput };
  return mergedOptions;
}

function configureOutputOptions(
  optionsToBeConfigured: OutputOptionsDefault,
  cliOptions: RollupperCliOptions
) {
  const configuredOptions = optionsToBeConfigured;
  if (cliOptions.format === "iife") {
    configuredOptions.name = "rollupper";
  }
  if (cliOptions.buildType === "lib") {
    configuredOptions.sourcemap = true;
  } else if (cliOptions.buildType === "bundle") {
    configuredOptions.plugins = [
      getBabelOutputPlugin({
        allowAllFormats: true,
        ...babelConfigDefault,
      }),
    ];
    configuredOptions.sourcemap = false;
  }
  if (cliOptions.terser) {
    configuredOptions.plugins!.push(terser());
  }
  return configuredOptions;
}
