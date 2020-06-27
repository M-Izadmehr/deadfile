/* eslint-disable no-underscore-dangle */
const { tokTypes } = require("acorn");
const { ImportUsingExportKey } = require("../models/Types");

/**
 * This function is used to parse imports using export
 * ```js
 *  export * from './a';
 *  export * as name1 from './a';
 *  export { name1, name2, nameN } from './a';
 *  export { import1 as name1, import2 as name2, nameN } from './a';
 *  export { default } from './a';
 * ```
 */
function parseImportUsingExport() {
  const node = this.startNode();

  /**
   * If it based on regex it has 'from' in the text, but the 'from' is not used as an import keyword:
   * ```js
   *  export function foo(from){ return from }
   * ```
   * it will fall in an infinite loop (this.tok.value === undefined), and instead of this.next() we should this.finishNode
   * if there are no valid toks (undefined) for `maxRetry` retries, we should stop.
   */
  let previousValue = null;
  let retryCount = 0;
  const maxRetry = 50;

  while (this.tok.value !== "from") {
    if (previousValue === this.tok.value && previousValue === undefined) {
      retryCount++;
      if (retryCount >= maxRetry) {
        return null;
      }
    } else {
      previousValue = this.tok.value;
      retryCount = 0;
    }

    this.next(); // skip `export` to find `from`
  }
  this.next(); // skip `from` to find `path`

  node.source = this.tok;
  node.type = ImportUsingExportKey;
  return this.finishNode(node, ImportUsingExportKey);
}

function isImportUsingExport() {
  const checkInput = /export.*from/.test(this.input);
  const checkType = this.tok.type === tokTypes._export;
  return checkInput && checkType;
}

function ParserExtension(Parser) {
  return class extends Parser {
    parseStatement(context, topLevel, exports) {
      // used to enable features such as dynamic import
      this.options.ecmaVersion = 20;

      // check export from statements
      if (isImportUsingExport.call(this)) {
        const parsed = parseImportUsingExport.call(this);
        // if a proper import expression was found, use it.
        if (parsed && parsed.source && parsed.source.value) {
          return parsed;
        }
      }

      return super.parseStatement(context, topLevel, exports);
    }
  };
}

module.exports = ParserExtension;
