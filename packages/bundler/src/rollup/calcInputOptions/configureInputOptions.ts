import path from "path";
// @ts-ignore
import babelPlugin from "@rollup/plugin-babel";
const servePlugin = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");
const babelConfigBrowser = require("@drewfle/config/babel/babel.config-browser.js");
const babelConfigNode = require("@drewfle/config/babel/babel.config-node.js");
import { url } from "./plugins";
import { BundlerCliOptions } from "../../cli";
import { readLocalPackageJson, getLocalIp } from "../../utils";
import { InputOptionsDefault } from "./types";

export default function configureInputOptions(
  optionsToBeConfigured: InputOptionsDefault,
  cliOptions: BundlerCliOptions
) {
  const pkg = readLocalPackageJson();
  const configuredOptions = optionsToBeConfigured;
  const {
    compiler,
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
  if ((compiler === "rtp2" && output === "browser") || babel) {
    const babelConfigs = {
      browser: babelConfigBrowser,
      node: babelConfigNode,
    } as const;
    const babelConfig =
      output === "browser" ? babelConfigBrowser : babelConfigs[babel!];

    if (!terser) {
      babelConfig.env = { development: { compact: false } };
    }

    configuredOptions.plugins = [
      ...configuredOptions.plugins,
      babelPlugin({
        babelHelpers: output === "browser" ? "bundled" : "runtime",
        ...babelConfig,
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

  // TODO: use Set.add(..), Set.delete(undefined), and [...set]
  configuredOptions.plugins = [
    ...configuredOptions.plugins,
    url(cliOptions),
  ].filter((v) => v);

  return configuredOptions;
}
