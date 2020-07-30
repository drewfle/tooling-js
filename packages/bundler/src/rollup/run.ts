import { calcInputOptions } from "./calc-input-options";
import { calcOutputOptions } from "./calc-output-options";
import { checkOptions, readLocalRollupConfig } from "../utils";
import { BundlerCliOptions } from "../types";
import { build } from "./build";
import { watch } from "./watch";

export async function run(cliOptions: BundlerCliOptions) {
  checkOptions(cliOptions);

  const localOptions = readLocalRollupConfig();
  const {
    output: localConfigOutput,
    plugins: localConfigPlugins,
    ...localConfigWithoutPlugins
  } = localOptions || {};

  if (Array.isArray(localConfigOutput)) {
    throw new Error(
      "Setting output to array in local Rollup config is not supported."
    );
  }

  const inputOptions = calcInputOptions(
    cliOptions,
    localConfigPlugins,
    localConfigWithoutPlugins
  );
  const outputOptions = calcOutputOptions(cliOptions, localConfigOutput);

  if (!cliOptions.watch) {
    await build(inputOptions, outputOptions);
  } else {
    watch(inputOptions, outputOptions);
  }
}
