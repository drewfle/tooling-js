import { OutputOptionsDefault } from "./types";
import { OutputOptions } from "rollup";

export default function mergeWithLocalOutputConfig(
  optionsToBeMerged: OutputOptionsDefault,
  localConfigOutput: OutputOptions | undefined
) {
  if (!localConfigOutput) {
    return optionsToBeMerged;
  }
  const mergedOptions = { ...optionsToBeMerged, ...localConfigOutput };
  return mergedOptions;
}
