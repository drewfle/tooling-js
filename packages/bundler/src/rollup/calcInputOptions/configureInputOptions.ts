import path from "path";
const servePlugin = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");
// @ts-ignore
import babelPlugin from "@rollup/plugin-babel";
const babelConfigBrowser = require("@drewfle/config/babel/babel.config-browser.js");
const babelConfigNode = require("@drewfle/config/babel/babel.config-node.js");
import { BundlerCliOptions } from "../../cli";
import {
  patchBabelConfigModulePaths,
  readLocalPackageJson,
  getLocalIp,
} from "../../utils";
import { InputOptionsDefault } from "./types";

export default function configureInputOptions(
  optionsToBeConfigured: InputOptionsDefault,
  cliOptions: BundlerCliOptions
) {
  const pkg = readLocalPackageJson();
  const configuredOptions = optionsToBeConfigured;
  const {
    dist,
    output,
    src,
    serve,
    port,
    terser,
    babel,
    external,
  } = cliOptions;

  configuredOptions.input = src;
  if (output === "browser" || babel) {
    const babelConfigs = {
      browser: babelConfigBrowser,
      node: babelConfigNode,
    } as const;
    const babelConfig =
      output === "browser" ? babelConfigBrowser : babelConfigs[babel!];
    const patchedBabelConfig = patchBabelConfigModulePaths(babelConfig);

    if (!terser) {
      patchedBabelConfig.env = { development: { compact: false } };
    }

    configuredOptions.plugins = [
      ...configuredOptions.plugins,
      babelPlugin({
        babelHelpers: output === "browser" ? "bundled" : "runtime",
        ...patchedBabelConfig,
      }),
    ];
  }
  if (external || output === "lib-es" || output === "lib-cjs") {
    configuredOptions.external = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ];
  }
  if (serve) {
    const contentBase = path.dirname(dist);
    const host = getLocalIp();
    configuredOptions.plugins = [
      ...configuredOptions.plugins,
      servePlugin({
        open: false,
        contentBase,
        host,
        port,
      }),
      livereload("dist"),
    ];
  }

  return configuredOptions;
}
