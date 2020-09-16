import { InputOptions, Plugin } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import path from "path";
const postcss = require("rollup-plugin-postcss");
const servePlugin = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");
const { getBabelOutputPlugin } = require("@rollup/plugin-babel");
const baseTsConfig = require("@drewfle/config/typescript/tsconfig-base.json");
const basePostCssConfig = require("@drewfle/config/postcss/postcss.config-base.js");
const baseBabelConfig = require("@drewfle/config/babel/babel.config-base.js");

import { BundlerCliOptions } from "../cli";
import {
  patchBabelConfigModulePaths,
  readLocalPackageJson,
  getLocalIp,
} from "../utils";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export type InputOptionsDefault = {
  plugins: Plugin[];
} & InputOptions;

export const getInputOptionsDefault = (tsconfig: any): InputOptionsDefault => ({
  plugins: [
    postcss({
      extract: true,
      modules: true,
      options: {
        config: {
          ctx: basePostCssConfig,
        },
      },
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigDefaults: tsconfig,
    }),
    commonjs(),
    nodeResolve({ extensions }),
    replace({
      "process.env.NODE_ENV": process.env.NODE_ENV,
    }),
  ],
});

export function calcInputOptions(
  cliOptions: BundlerCliOptions,
  localConfigPlugins?: Plugin[],
  localConfigWithoutPlugins?: Omit<InputOptions, "plugins" | "output">
) {
  const srcDir = path.dirname(cliOptions.src);
  const distDir = path.dirname(cliOptions.dist);
  const {
    compilerOptions: baseCompilerOptions,
    ...restBaseTsConfig
  } = baseTsConfig;
  const tsconfig = {
    compilerOptions: {
      ...baseCompilerOptions,
      declarationDir: path.join(distDir, "types"),
    },
    ...restBaseTsConfig,
    include: [`${srcDir}/**/*`],
    exclude: ["node_modules", distDir],
  };

  const inputOptionsDefault = getInputOptionsDefault(tsconfig);
  let calculatedOptions = configureInputOptions(
    inputOptionsDefault,
    cliOptions
  );
  calculatedOptions = mergeWithLocalInputConfig(
    calculatedOptions,
    localConfigPlugins,
    localConfigWithoutPlugins
  );

  return calculatedOptions;
}

function configureInputOptions(
  optionsToBeConfigured: InputOptionsDefault,
  cliOptions: BundlerCliOptions
) {
  const pkg = readLocalPackageJson();
  const configuredOptions = optionsToBeConfigured;
  const { dist, output, src, serve, port, babel, external } = cliOptions;

  configuredOptions.input = src;
  if (output === "browser" || babel) {
    const patchedBabelConfig = patchBabelConfigModulePaths(baseBabelConfig);
    configuredOptions.plugins = [
      ...configuredOptions.plugins,
      getBabelOutputPlugin({
        allowAllFormats: true,
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

function mergeWithLocalInputConfig(
  optionsToBeMerged: InputOptionsDefault,
  localConfigPlugins?: Plugin[],
  localConfigWithoutPlugins?: Omit<InputOptions, "plugins" | "output">
) {
  if (!localConfigPlugins && !localConfigWithoutPlugins) {
    return optionsToBeMerged;
  }

  const mergedOptions = {
    ...optionsToBeMerged,
    ...localConfigWithoutPlugins,
  };
  if (localConfigPlugins) {
    mergedOptions.plugins = [...mergedOptions.plugins, ...localConfigPlugins];
  }

  return mergedOptions;
}
