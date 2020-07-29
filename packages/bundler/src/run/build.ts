import { rollup, watch } from "rollup";
import { calcInputOptions } from "./calc-input-options";
import { calcOutputOptions } from "./calc-output-options";
import { readLocalRollupConfig } from "../utils";
import { BundlerCliOptions } from "../types";
import { logEvents } from "./watch";

export async function build(cliOptions: BundlerCliOptions) {
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
    const bundle = await rollup(inputOptions);
    await bundle.write(outputOptions!);
  } else {
    const watchOptions = {
      ...inputOptions,
      output: [outputOptions],
    };
    const watcher = watch(watchOptions);
    watcher.on("event", (event) => {
      logEvents(event);
    });
  }
}
