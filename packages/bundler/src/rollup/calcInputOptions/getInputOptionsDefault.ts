import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
const postcss = require("rollup-plugin-postcss");
// @ts-ignore
import babelPlugin from "@rollup/plugin-babel";
const basePostCssConfig = require("@drewfle/config/postcss/postcss.config-base.js");
import { InputOptionsDefault } from "./types";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default function getInputOptionsDefault(
  tsconfig: any
): InputOptionsDefault {
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
  };
}
