import { rollup } from "rollup";
import { InputOptionsDefault } from "./calcInputOptions/types";
import { OutputOptionsDefault } from "./calcOutputOptions/types";

export async function build(
  inputOptions: InputOptionsDefault,
  outputOptions: OutputOptionsDefault
) {
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions!);
}
