import path from "path";
import fs from "fs";
import { RollupOptions } from "rollup";
import { RollupperCliOptions } from "./types";

export const checkOptions = ({ buildType, format }: RollupperCliOptions) => {
  const isOutputFormatSupported = [
    "amd",
    "cjs",
    "es",
    "iife",
    "system",
    "umd",
  ].includes(format);
  if (!isOutputFormatSupported) {
    throw new Error(`Output format ${format} is not supported.`);
  }

  const isOutputBuildTypeSupported = ["lib", "bundle"].includes(buildType);
  if (!isOutputBuildTypeSupported) {
    throw new Error(`Output build type ${buildType} is not supported.`);
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
