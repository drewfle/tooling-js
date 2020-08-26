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

type BabelOption = string | any[];
type BabelConfig = {
  presets?: BabelOption[];
  plugins?: BabelOption[];
};
export function patchBabelConfigModulePaths(babelConfig: BabelConfig) {
  const modulePath = "./node_modules/@drewfle/bundler/node_modules";
  const result: BabelConfig = {};
  const patch = (options: BabelOption[]) =>
    options.map((option) =>
      Array.isArray(option)
        ? [`${modulePath}/${option[0]}`, option[1]]
        : `${modulePath}/${option}`
    );
  if (babelConfig.presets) {
    result.presets = patch(babelConfig.presets);
  }
  if (babelConfig.plugins) {
    result.plugins = patch(babelConfig.plugins);
  }
  return result;
}
