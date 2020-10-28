import { terser as terserPlugin } from "rollup-plugin-terser";
const html = require("@rollup/plugin-html");
import path from "path";
import fs from "fs";
import { BundlerCliOptions } from "../../cli";
import { OutputOptionsDefault } from "./types";
import { outputFormatMap } from "./constants";

export default function configureOutputOptions(
  optionsToBeConfigured: OutputOptionsDefault,
  cliOptions: BundlerCliOptions
) {
  const configuredOptions = optionsToBeConfigured;
  const { dist, output, format, sourceMap, terser, serve } = cliOptions;

  if (output) {
    configuredOptions.sourcemap = true;
    configuredOptions.format = outputFormatMap[output];
  }
  if (output === "browser" || format === "iife") {
    configuredOptions.name = "whatever";
  }
  if (sourceMap) {
    configuredOptions.sourcemap = true;
  }
  if (terser) {
    configuredOptions.plugins.push(terserPlugin());
  }
  if (serve) {
    if (
      output === "browser" ||
      (format && ["iife", "es", "umd"].includes(format))
    ) {
      const bundleJsFilename = path.basename(dist);
      const bundleCssPath = dist.replace(/\.js$/, ".css");
      const bundleCssFilename = path.basename(bundleCssPath);
      const link = fs.existsSync(bundleCssPath)
        ? `<link href="${bundleCssFilename}" rel="stylesheet">`
        : "";
      const script = `<script src="${bundleJsFilename}"></script>`;
      configuredOptions.plugins.push(
        html({
          template: () => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Rollup Bundle</title>
    ${link}
  </head>
  <body>
    <div id="root"></div>
    ${script}
  </body>
</html>
`,
        })
      );
    }
  }

  return configuredOptions;
}
