import commander from "commander";
import { InternalModuleFormat } from "rollup";

export interface RollupperCliOptions extends commander.Command {
  format: InternalModuleFormat;
  buildType: "lib" | "bundle";
}
