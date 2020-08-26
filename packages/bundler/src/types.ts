import commander from "commander";
import { InternalModuleFormat } from "rollup";

export interface BundlerCliOptions extends commander.Command {
  output: "lib-es" | "lib-cjs" | "browser";
  format?: InternalModuleFormat;
  src: string;
  dist: string;
  watch: boolean;
  serve: boolean;
  babel: boolean;
  external: boolean;
  sourceMap: boolean;
  terser: boolean;
}
