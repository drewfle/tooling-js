import { RollupOptions } from "rollup";
import { BundlerCliOptions } from "../../cli";
import mergeWithLocalOutputConfig from "./mergeWithLocalOutputConfig";
import configureOutputOptions from "./configureOutputOptions";
import calcOutputOptionsDefault from "./calcOutputOptionsDefault";

export default function calcOutputOptions(
  cliOptions: BundlerCliOptions,
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
