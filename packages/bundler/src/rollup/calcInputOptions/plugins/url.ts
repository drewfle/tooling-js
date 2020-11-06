const url = require("@rollup/plugin-url");
import { BundlerCliOptions } from "../../../cli";

export default function ({ output, babel }: BundlerCliOptions) {
  return output === "browser" || babel === "browser" ? url() : undefined;
}
