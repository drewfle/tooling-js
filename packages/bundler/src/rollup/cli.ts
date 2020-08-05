import command from "commander";

export const cli = (bundler: command.Command) => {
  bundler
    .command("rollup")
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
};
