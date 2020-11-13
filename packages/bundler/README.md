# @drewfle/bundler

![](https://raw.githubusercontent.com/drewfle/tooling/master/packages/bundler/files/bundler-watch.gif)

Drewfle Bundler is a building and bundling tool for Typescript. It leverages Rollup API and abstracts away common dependencies. It offers out of box Typescript support for building libraries. It also supports bundling front end web apps with PostCSS and additional Babel options.

Under the hood Drewfle Bundler uses [rollup-plugin-typescript2](https://www.npmjs.com/package/rollup-plugin-typescript2) by default. When the `--compiler` option is set to `esbuild`, it uses [esbuild](https://github.com/evanw/esbuild) and disables Babel regardless of other options.

## Options

```
$ drewfle-bundler rollup -h

Usage: cli rollup [options]

Options:
  -c, --compiler <type>  Compiler. Available values are rtp2 and esbuild.
                         rtp2: stands for rollup-plugin-typescript2.
                         esbuild: when enabled, disables babel. (default: "rtp2")
  -o, --output <type>    Build output. Available values are lib-es, lib-cjs, and browser.
    lib-es: equivalent to passing -f es -es.
    lib-cjs: equivalent to passing -f cjs -es.
    browser: equivalent to passing -f iife -s -b browser. By default uses babel to output cross-browser compatible code. Uses esbuild when compiler is set to esbuild. (default: "lib-es")
  -f, --format <type>    Output module format. Available values are amd, cjs, es, iife, system, and umd
  --src <path>           Source file path (default: "src/index.ts")
  --dist <path>          Dist file path (default: "dist/bundle.js")
  --watch                Enable watch mode (default: false)
  --serve                Enable server (default: false)
  -p, --port <port>      Specify dev server port (default: "8080")
  -b, --babel <mode>     Enable babel. Available options are node and browser. Ignored when compiler is set to esbuild.
  -e, --external         Enable external to exclude specified dependencies. By default it excludes all dependencies. (default: false)
  -s, --source-map       Enable source map (default: false)
  -t, --terser           Enable terser (default: false)
  --init <type>          Initialize minimal project files. Available option is ts-react
  -h, --help             display help for command
```

### Minimal React Project Setup

See [example React project](https://github.com/drewfle/tooling/tree/master/packages/templates/bundler/rollup/ts-react). Or in an empty folder:

- Run `npx @drewfle/bundler rollup --init ts-react`
- Install dependencies, e.g. run `npm i`
- Run `npm start`
- In a browser, load the build at default port 8080.

## Development

Test run initializing project, in an empty folder, run `npx <path-to>/tooling/packages/bundler/cli.js rollup --init ts-react`
