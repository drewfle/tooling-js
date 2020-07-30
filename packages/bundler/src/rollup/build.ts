import { rollup } from "rollup";
import { InputOptionsDefault } from "./calc-input-options";
import { OutputOptionsDefault } from "./calc-output-options";

export async function build(
  inputOptions: InputOptionsDefault,
  outputOptions: OutputOptionsDefault
) {
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions!);
}
