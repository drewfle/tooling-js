import { RollupWatcherEvent } from "rollup";
// import { logger } from "../utils";
const chalk = require("chalk");
const path = require("path");
export const logEvents = (event: RollupWatcherEvent) => {
  const { code } = event;

  // const format = (filePaths: string | string[]) => {
  //   if (Array.isArray(filePaths)) {
  //     if (filePaths.length === 1) {
  //       return path.relative(process.cwd(), filePaths);
  //     }
  //     return `\n${filePaths
  //       .map((p) => `  ${path.relative(process.cwd(), p)}`)
  //       .join("/n")}`;
  //   } else {
  //     return path.relative(process.cwd(), filePaths);
  //   }
  // };

  const format = (file: string | string[]) =>
    Array.isArray(file)
      ? `\n${file
          .map((p) => `  ${path.relative(process.cwd(), p)}`)
          .join("/n")}`
      : path.relative(process.cwd(), file);
  const plural = (isPlural: boolean) => (isPlural ? "s" : "");

  const actions = {
    START() {
      console.info(
        chalk`{cyanBright.bgMagenta  {yellow ⚡}Drewfle bundler is starting on top of Rollup {yellow ⚡}}`
      );
    },
    BUNDLE_START() {
      // @ts-ignore
      const { input, output } = event;
      const formatedInput = format(input);
      const fileString = `file${plural(Array.isArray(input))}`;
      console.info(`Building from entry ${fileString}: ${formatedInput}`);
    },
    BUNDLE_END: () => {
      // @ts-ignore
      const { duration, output } = event;
      const fileString = `bundle${plural(Array.isArray(output))}`;
      const formatedOutput = format(output);
      console.info(`Built ${fileString} in ${duration}ms: ${formatedOutput}`);
    },
    END: () => {
      console.log("#".repeat(40));
      console.info("End");
    },
    ERROR: () => {
      console.log("#".repeat(40));
      console.info("Error");
    },
  };
  actions[code]();
};
