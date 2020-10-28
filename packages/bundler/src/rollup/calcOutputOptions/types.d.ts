import { OutputOptions, ModuleFormat, Plugin } from "rollup";

export interface OutputOptionsDefault extends OutputOptions {
  format: ModuleFormat;
  plugins: Plugin[];
}
