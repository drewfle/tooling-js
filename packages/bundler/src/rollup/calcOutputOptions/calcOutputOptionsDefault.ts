import { BundlerCliOptions } from "../../cli";
import { OutputOptionsDefault } from "./types";
import { outputFormatMap } from "./constants";

export default function calcOutputOptionsDefault({
  output,
  format,
  dist,
}: BundlerCliOptions): OutputOptionsDefault {
  const extension = format ? format : outputFormatMap[output];
  const file = dist;

  return {
    file,
    format: extension!,
    plugins: [],
  };
}
