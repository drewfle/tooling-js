import { rollup } from "rollup";
import { calcInputOptions } from "./calc-input-options";
import { calcOutputOptions } from "./calc-output-options";
import { readLocalRollupConfig } from "../utils";
import { RollupperCliOptions } from "../types";

export async function build(cliOptions: RollupperCliOptions) {
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
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions!);
}
