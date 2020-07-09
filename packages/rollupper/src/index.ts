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
    "-o, --output <type>",
    `Build output. Available values are lib-es, lib-cjs, and browser.
  - lib-es: equivalent to passing -f es -es.
  - lib-cjs: equivalent to passing -f cjs -es.
  - browser: equivalent to passing -f iife -sb.`,
    "browser"
  )
  .option(
    "-f, --format <type>",
    "Output module format. Available values are amd, cjs, es, iife, system, and umd"
  )
  .option("-e, --external-all", "Enable externalizing all dependencies.")
  .option("-b, --babel", "Enable babel")
  .option("-t, --terser", "Enable terser")
  .option("-s, --source-map", "Enable source map");

rollupper.parse(process.argv);
checkOptions(rollupper);

build(rollupper);
