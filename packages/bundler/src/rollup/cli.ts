import { Command } from "commander";
import { BundlerCliOptions } from "../types";
import { run } from "./run";

export const cli = () => {
  const bundler = new Command() as BundlerCliOptions;
  bundler
    .description(
      "Drewfle Bundler is a CLI tool for building and bundling packages. It laverages Rollup API and abstract away common dev dependencies."
    )
    // .command("rollup")
    .option(
      "-o, --output <type>",
      `Build output. Available values are lib-es, lib-cjs, and browser.
  lib-es: equivalent to passing -f es -es.
  lib-cjs: equivalent to passing -f cjs -es.
  browser: equivalent to passing -f iife -sb.`,
      "lib-es"
    )
    .option(
      "-f, --format <type>",
      "Output module format. Available values are amd, cjs, es, iife, system, and umd"
    )
    .option("--src <type>", "Source file path", "src/index.ts")
    .option("--dist <type>", "Dist file path", "dist/index.<format>.js")
    .option("-w, --watch", "Enable watch mode", false)
    .option("-b, --babel", "Enable babel", false)
    .option(
      "-e, --external",
      "Enable external to exclude specified dependencies. By default it excludes all dependencies.",
      false
    )
    .option("-s, --source-map", "Enable source map", false)
    .option("-t, --terser", "Enable terser", false);

  bundler.parse(process.argv);
  // console.log("!!! bundler.commands", bundler.commands);
  // console.log("!!! bundler.options", bundler.options);

  run(bundler);
};
