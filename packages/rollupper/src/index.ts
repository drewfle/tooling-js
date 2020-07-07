import path from "path";
import { Command } from "commander";
import { RollupperCliOptions } from "./types";
import { checkOptions, readLocalPackageJson } from "./utils";
import { build } from "./run";

const pkg = readLocalPackageJson();

const rollupper = new Command() as RollupperCliOptions;
rollupper
  .description(
    "Rollupper is a CLI tool for building and bundling packages. It laverages Rollup API and abstract away common dev dependencies."
  )
  .version(pkg.version)
  .option(
    "-f, --format <type>",
    "Output module format, available values are amd, cjs, es, iife, system, and umd",
    "es"
  )
  .option(
    "-b, --build-type <type>",
    "Output build type, available values are lib and bundle",
    "lib"
  );
rollupper.parse(process.argv);
checkOptions(rollupper);

build(rollupper);
