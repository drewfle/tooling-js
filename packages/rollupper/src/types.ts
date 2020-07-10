import commander from "commander";
import { InternalModuleFormat } from "rollup";

export interface RollupperCliOptions extends commander.Command {
  output?: "lib-es" | "lib-cjs" | "browser";
  format?: InternalModuleFormat;
  babel: boolean;
  external: boolean;
  sourceMap: boolean;
  terser: boolean;
}
