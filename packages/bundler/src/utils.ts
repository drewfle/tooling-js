import path from "path";
import fs from "fs";
import { RollupOptions } from "rollup";
import { BundlerCliOptions } from "./types";

export const checkOptions = ({ format, output }: BundlerCliOptions) => {
  if (format !== undefined) {
    const isFormatSupported = [
      "amd",
      "cjs",
      "es",
      "iife",
      "system",
      "umd",
    ].includes(format);
    if (!isFormatSupported) {
      throw new Error(`Rollup Output format ${format} is not supported.`);
    }
  }
  if (output !== undefined) {
    const isOutputSupported = ["lib-es", "lib-cjs", "browser"].includes(output);
    if (!isOutputSupported) {
      throw new Error(`Output type ${output} is not supported.`);
    }
  }
};

const cwd = process.cwd();

export const readLocalPackageJson = () => {
  const pkg = require(path.resolve(cwd, "package.json"));
  return pkg;
};

export const readLocalRollupConfig = (): RollupOptions | undefined => {
  const rollupConfigPath = path.resolve(cwd, "rollup.config.json");
  return fs.existsSync(rollupConfigPath)
    ? require(rollupConfigPath)
    : undefined;
};
