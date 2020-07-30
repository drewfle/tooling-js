import { Command } from "commander";
import { BundlerCliOptions } from "../types";
import * as rollup from "../rollup";

export const bundler = () => {
  const bundler = new Command();
  bundler.description(
    "Drewfle Bundler is a CLI tool for building and bundling packages. It laverages Rollup API and abstract away common dev dependencies."
  );
  rollup.cli(bundler);

  bundler.parse(process.argv);

  const [rollupCommand] = bundler.commands;
  rollup.run(rollupCommand as BundlerCliOptions);
};
