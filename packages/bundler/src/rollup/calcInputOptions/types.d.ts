import { InputOptions, Plugin } from "rollup";

export type InputOptionsDefault = {
  plugins: Plugin[];
} & InputOptions;
