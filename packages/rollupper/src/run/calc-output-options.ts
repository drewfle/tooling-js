import { RollupOptions, OutputOptions, ModuleFormat, Plugin } from "rollup";
import { terser as terserPlugin } from "rollup-plugin-terser";
import { RollupperCliOptions } from "../types";

export interface OutputOptionsDefault extends OutputOptions {
  file: string;
  format: ModuleFormat;
  plugins: Plugin[];
}

const outputFormatMap = {
  "lib-es": "es",
  "lib-cjs": "cjs",
  browser: "iife",
} as const;

export const calcOutputOptionsDefault = ({
  output,
  format,
}: RollupperCliOptions): OutputOptionsDefault => {
  const extension = output ? outputFormatMap[output] : format;
  return {
    file: `dist/index.${extension}.js`,
    format: extension!,
    plugins: [],
  };
};

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

function configureOutputOptions(
  optionsToBeConfigured: OutputOptionsDefault,
  cliOptions: RollupperCliOptions
) {
  const configuredOptions = optionsToBeConfigured;
  const { output, format, sourceMap, terser } = cliOptions;

  if (output) {
    configuredOptions.sourcemap = true;
    configuredOptions.format = outputFormatMap[output];
  }
  if (output === "browser" || format === "iife") {
    configuredOptions.name = "tsroll";
  }
  if (sourceMap) {
    configuredOptions.sourcemap = true;
  }
  if (terser) {
    configuredOptions.plugins.push(terserPlugin());
  }

  return configuredOptions;
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
