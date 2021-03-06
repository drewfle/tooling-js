import path from "path";
import fs from "fs-extra";
import os from "os";
import { RollupOptions } from "rollup";
import { BundlerCliOptions } from "./cli";
import { TemplateDirName } from "./cli";

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
  env?: any;
  presets?: BabelOption[];
  plugins?: BabelOption[];
};
/**
 * Use this for reading local config.
 */
export function patchBabelConfigModulePaths(babelConfig: BabelConfig) {
  const result: BabelConfig = {};
  const patch = (options: BabelOption[]) =>
    options.map((option) =>
      Array.isArray(option)
        ? [require.resolve(option[0]), option[1]]
        : require.resolve(option)
    );
  if (babelConfig.presets) {
    result.presets = patch(babelConfig.presets);
  }
  if (babelConfig.plugins) {
    result.plugins = patch(babelConfig.plugins);
  }
  return result;
}

export function getLocalIp() {
  const networkInterfaces = os.networkInterfaces();
  const ifaces = Object.values(networkInterfaces).reduce((acc, iface) =>
    iface && acc ? [...acc, ...iface] : acc
  );
  const localIp =
    ifaces &&
    ifaces.reduce(
      (ip, { family, internal, address }) =>
        ip === undefined && family === "IPv4" && internal === false
          ? address
          : ip,
      undefined as string | undefined
    );

  return localIp;
}

export function copyTemplate(templateDirName: TemplateDirName) {
  const templatePath = path.dirname(require.resolve("@drewfle/templates"));
  const src = path.join(templatePath, "bundler/rollup", templateDirName);
  fs.copySync(src, ".");
  console.log(
    "Initialized drewfle bundler boilerplate, please install dependencies, e.g. run `npm i`"
  );
}
