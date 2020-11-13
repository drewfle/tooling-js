import { calcInputOptions } from "../calcInputOptions";
import { calcOutputOptions } from "../calcOutputOptions";
import { checkOptions, readLocalRollupConfig, copyTemplate } from "../../utils";
import { BundlerCliOptions } from "../../cli";
import { watch } from "./watch";
import { build } from "./build";

export default async function run(cliOptions: BundlerCliOptions) {
  checkOptions(cliOptions);

  if (cliOptions.init === "ts-react") {
    console.log("Initializing ts-react boilerplate ...");
    copyTemplate("ts-react");
    return;
  } else if (cliOptions.init === "ts-node") {
    console.log("ts-node boilerplate is not supported yet. Abort.");
    return;
  }

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

  if (cliOptions.watch) {
    watch(inputOptions, outputOptions);
  } else {
    await build(inputOptions, outputOptions);
  }
}
