import { RollupWatcherEvent, RollupError, watch as rollupWatch } from "rollup";
import chalk from "chalk";
import { InputOptionsDefault } from "./calcInputOptions/types";
import { OutputOptionsDefault } from "./calcOutputOptions/types";
const path = require("path");

export const watch = (
  inputOptions: InputOptionsDefault,
  outputOptions: OutputOptionsDefault
) => {
  const watchOptions = {
    ...inputOptions,
    output: [outputOptions],
  };
  const watcher = rollupWatch(watchOptions);
  watcher.on("event", (event) => {
    logEvents(event);
  });
};

export const logEvents = (event: RollupWatcherEvent) => {
  const { code } = event;

  const format = (filePaths: string | string[]) => {
    if (Array.isArray(filePaths)) {
      if (filePaths.length === 1) {
        return path.relative(process.cwd(), filePaths[0]);
      }
      return `\n${filePaths
        .map((p) => `  ${path.relative(process.cwd(), p)}`)
        .join("\n")}`;
    }
    return path.relative(process.cwd(), filePaths);
  };

  const plural = (mightBeArray: string | string[]) =>
    Array.isArray(mightBeArray) && mightBeArray.length > 1 ? "s" : "";

  const actions = {
    START() {
      console.info(
        chalk`{cyanBright.bgMagenta  {yellow ⚡} Bundler is starting on top of Rollup {yellow ⚡}}`
      );
    },
    BUNDLE_START() {
      console.clear();
      console.info(
        chalk`{cyanBright.bgMagenta  Bun {yellow ⚡} d {yellow ⚡} l {yellow ⚡} er}`
      );
      // @ts-ignore
      const { input, output } = event;
      const formatedInput = format(input);
      const fileString = `file${plural(input)}`;
      console.info(
        chalk`{green Building from entry ${fileString}: ${formatedInput}}`
      );
    },
    BUNDLE_END() {
      // @ts-ignore
      const { duration, output } = event;
      const fileString = `bundle${plural(output)}`;
      const formatedOutput = format(output);
      console.info(
        chalk`{blueBright Built ${fileString} in ${duration}ms: ${formatedOutput}}`
      );
    },
    END() {
      console.info("Bundler is 👁 watching👁 ...");
    },
    ERROR() {
      // @ts-ignore
      const error = event.error as RollupError;
      console.error("Error");
      const { handleError } = require("rollup/dist/shared/loadConfigFile");
      handleError(error, true);
    },
  };
  actions[code]();
};
