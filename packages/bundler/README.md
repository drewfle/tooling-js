# @drewfle/bundler

Drewfle Bundler is a CLI tool for building and bundling packages that laverages Rollup API and abstract away common dev dependencies. bundler offers:

1. Outof box Typescript and PostCSS support for building libraries and web apps.
1. Options for Babel and Terser support for bundling web apps.

## Usages

### React Project

```json
  "scripts": {
    "build": "drewfle-bundler rollup --src src/index.tsx --dist dist/bundle.js -o browser",
    "watch": "drewfle-bundler rollup --src src/index.tsx --dist dist/bundle.js -o browser --watch --serve",
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "react": "16.13.1",
    "react-dom": "16.13.1"
  },
  "devDependencies": {
    "@drewfle/bundler": "file:../../github/tooling/packages/bundler",
    "@drewfle/config": "file:../../github/tooling/packages/config",
    "@types/react": "16.8.24",
    "@types/react-dom": "16.9.8",
    "typescript": "3.9.6"
  }
```

## Options

```
$ drewfle-bundler -h

Usage: drewfle-bundler [options] [command]

Drewfle Bundler is a CLI tool for building and bundling packages. It laverages Rollup API and abstract away common dev dependencies.

Options:
  -h, --help        display help for command

Commands:
  rollup [options]
  help [command]    display help for command

> drewfle-bundler rollup -h

Usage: drewfle-bundler rollup [options]

Options:
  -o, --output <type>  Build output. Available values are lib-es, lib-cjs, and browser.
    lib-es: equivalent to passing -f es -es.
    lib-cjs: equivalent to passing -f cjs -es.
    browser: equivalent to passing -f iife -s -b browser. (default: "lib-es")
  -f, --format <type>  Output module format. Available values are amd, cjs, es, iife, system, and umd
  --src <path>         Source file path (default: "src/index.ts")
  --dist <path>        Dist file path (default: "dist/bundle.js")
  --watch              Enable watch mode (default: false)
  --serve              Enable server (default: false)
  -p, --port <port>    Specify dev server port (default: "8080")
  -b, --babel <mode>   Enable babel. Available options are node and browser
  -e, --external       Enable external to exclude specified dependencies. By default it excludes all dependencies. (default: false)
  -s, --source-map     Enable source map (default: false)
  -t, --terser         Enable terser (default: false)
  -h, --help           display help for command
```
