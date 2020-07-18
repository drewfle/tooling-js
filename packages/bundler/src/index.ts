import { Command } from "commander";
import { BundlerCliOptions } from "./types";
import { checkOptions, readLocalPackageJson } from "./utils";
import { build } from "./run";

const pkg = readLocalPackageJson();

const bundler = new Command() as BundlerCliOptions;
bundler
  .description(
    "Drewfle Bundler is a CLI tool for building and bundling packages. It laverages Rollup API and abstract away common dev dependencies."
  )
  .version(pkg.version)
  .option(
    "-o, --output <type>",
    `Build output. Available values are lib-es, lib-cjs, and browser.
  lib-es: equivalent to passing -f es -es.
  lib-cjs: equivalent to passing -f cjs -es.
  browser: equivalent to passing -f iife -sb.`
  )
  .option(
    "-f, --format <type>",
    "Output module format. Available values are amd, cjs, es, iife, system, and umd"
  )
  .option("-b, --babel", "Enable babel", false)
  .option(
    "-e, --external",
    "Enable external to exclude specified dependencies. By default it excludes all dependencies.",
    false
  )
  .option("-s, --source-map", "Enable source map", false)
  .option("-t, --terser", "Enable terser", false);

bundler.parse(process.argv);
checkOptions(bundler);

build(bundler);
