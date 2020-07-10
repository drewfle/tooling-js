# @drewfle/rollupper

Rollupper is a CLI tool for building and bundling packages that laverages Rollup API and abstract away common dev dependencies. Rollupper offers:

1. Out-of-box Typescript and PostCSS support for building libraries and web apps.
1. Options for Babel and Terser support for bundling web apps.

## Usages

```
$ rollupper -h
Usage: index [options]

Rollupper is a CLI tool for building and bundling packages. It laverages Rollup API and abstract away common dev dependencies.

Options:
  -V, --version        output the version number
  -o, --output <type>  Build output. Available values are lib-es, lib-cjs, and browser.
    - lib-es: equivalent to passing -f es -es.
    - lib-cjs: equivalent to passing -f cjs -es.
    - browser: equivalent to passing -f iife -sb. (default: "browser")
  -f, --format <type>  Output module format. Available values are amd, cjs, es, iife, system, and umd
  -e, --external-all   Enable externalizing all dependencies.
  -b, --babel          Enable babel
  -t, --terser         Enable terser
  -s, --source-map     Enable source map
  -h, --help           display help for command
```
