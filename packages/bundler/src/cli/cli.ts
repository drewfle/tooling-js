import commander, { Command } from "commander";
import { InternalModuleFormat } from "rollup";
import * as rollup from "../rollup";

export type TemplateDirName = "ts-react" | "ts-node";

export interface BundlerCliOptions extends commander.Command {
  compiler: "rtp2" | "esbuild";
  output: "lib-es" | "lib-cjs" | "browser";
  format?: InternalModuleFormat;
  src: string;
  dist: string;
  watch: boolean;
  serve: boolean;
  port: string;
  babel?: "node" | "browser";
  external: boolean;
  sourceMap: boolean;
  terser: boolean;
  init?: TemplateDirName;
}

export const bundler = () => {
  const bundler = new Command();
  bundler.description(
    "Drewfle Bundler laverages Rollup API and abstract away common dev dependencies."
  );
  rollup.cli(bundler);

  bundler.parse(process.argv);

  const [rollupCommand] = bundler.commands;
  rollup.run(rollupCommand as BundlerCliOptions);
};
