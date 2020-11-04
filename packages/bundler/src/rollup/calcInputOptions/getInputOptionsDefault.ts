import { nodeResolve } from "@rollup/plugin-node-resolve";
import esbuild from 'rollup-plugin-esbuild'
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
const postcss = require("rollup-plugin-postcss");
// @ts-ignore
import babelPlugin from "@rollup/plugin-babel";
const basePostCssConfig = require("@drewfle/config/postcss/postcss.config-base.js");
import { BundlerCliOptions } from "../../cli";
import { InputOptionsDefault } from "./types";


const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default function getInputOptionsDefault(
  cliOptions: BundlerCliOptions,
  tsconfig: any
): InputOptionsDefault {
  const {compiler, output} = cliOptions
  const compilerPlugins: Record<BundlerCliOptions['compiler'], any> = {
    'rtp2': () => typescript({
      useTsconfigDeclarationDir: true,
      tsconfigDefaults: tsconfig,
    }),
    'esbuild': () => esbuild({
      exclude: output === "browser"? undefined : /node_modules/
    })
  }
  return {
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
      compilerPlugins[compiler](),
      commonjs(),
      nodeResolve({ extensions }),
      replace({
        "process.env.NODE_ENV": process.env.NODE_ENV,
      }),
    ],
  };
}
