<p align="center">
  <a href="https://m-izadmehr.github.io/deadfile">
    <img src="https://github.com/M-Izadmehr/deadfile/raw/master/docs/images/logo.png" height="128">
    <h1 align="center">deadfile</h1>
  </a>
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/deadfile">
    <img alt="" src="https://img.shields.io/npm/v/deadfile.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="License" href="https://github.com/vercel/next.js/blob/canary/license.md">
    <img alt="" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000">
  </a>
</p>


Simple util to find deadcode and unused files in any JavaScript project (ES5, ES6, React, Vue, ...).

* **Easy to use**:
Out of box support for ES5, ES6, React, Vue, ESM, CommonJs.
* **Error tolerant:** deadfile uses loose parsing of your code, so if there are errors in your code, it still works. 
Even if you use a very specific babel config, it will still parse your code and find imports.
* **Syntax support:** it supports import/require and even dynamic import.
* Shows you a warning for the node_modules you import, but do not appearin your package.json


![deadfile result](https://github.com/M-Izadmehr/deadfile/raw/master/docs/images/analyzeresult.png "Code Analysis")
![deadfile result](https://github.com/M-Izadmehr/deadfile/raw/master/docs/images/screenshot.png "Code Analysis")

## Supported Node Versions
This project uses optional chaining, so you need to use **Node v14.0 +** to be able to use it.


## Installation
Install deadfile cli with the following command:

**npm**
```bash
$ npm install -g deadfile
```
**yarn**
```bash
$ yarn global add deadfile
```
**npx**
```bash
$ npx deadfile <file>
```

## Usage and Examples
simple:               
 ```bash
 deadfile ./src/index.js
 ```

multiple entry:        
```bash
deadfile ./src/index.js ./src/entry2.js
```

with custom directory: 
```bash
deadfile ./src/index.js --dir /path/to/other/folder
```

with  exclude:         
```bash
deadfile ./src/index.js --exclude tests  utils/webpack
```

## What it does
### Supported Syntaxes
All major ES Module imports are supported (including dynamic import):
![Import Syntax](https://github.com/M-Izadmehr/deadfile/raw/master/docs/images/supportedImports.png "Import Syntax")

Also the following export (aggregation) syntaxes are also supported:
![Export Aggregation Syntax](https://github.com/M-Izadmehr/deadfile/raw/master/docs/images/supportedExports.png "Export Aggregation Syntax")

### Development Environment
You can use `deadfile` for any JavaScript project, and go crazy with you code, use the latest features and it still works. Here are some examples:

#### JSX
![React Example](https://github.com/M-Izadmehr/deadfile/raw/master/docs/images/React.png "React Example")

### Vue
![Vue Example](https://github.com/M-Izadmehr/deadfile/raw/master/docs/images/Vue.png "Vue Example")

#### Reassigned requires

`deadfile` look for import declarations and calls of the `require` function. As a result, if you assign `require` to another var and use it to load a dependency, it will not handle it.


### Options
- **entry**: all arguments directly after `deadfile` are considered as entries (yes, deadfile supports multiple entries)        
```bash
deadfile ./src/index.js ./src/entry2.js
```
- **--dir**: set search in another folder:
```bash
deadfile <file> --dir /path/to/other/folder
```
- **--exclude**: list of paths to ignore:

Paths or files to exclude from search. It supports any valid RegExp expression to exclude:
``` bash
deadfile <file> --exclude ^(\w)png$
deadfile <file> --exclude webpack utils docs
```

-**--output**: used to write report results in `.json` file

You can specify the file to write, a json file including file lists:
``` bash
deadfile <file> --output report.json
```


## Supported Import Aliases
### Babel
### Webpack Import Alias 
### Typescript Import Alias (`tsconfig.json`)

## Todo
* IF local webpack config uses `process.cwd`, if you run the script in any other folder, it fill process.cwd to wrong value
* Handle package.json aliases
* refactor Deadfile class to async functions (easier to test)
* Refactor parser/fileResolver into async functions or thread workers
* Create interactive dependency graph of uses assets
* Move project to TS
* Unit test coverage on the pipeline
* be able to include/exclude paths/extentions based on relPath/regex
* allow file extensions for parsing, should default to (.js/.jsx/.ts/.tsx/.vue)
* Add SASS import
* 
