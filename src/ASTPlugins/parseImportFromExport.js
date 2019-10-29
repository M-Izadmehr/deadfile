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
  var node = this.startNode();

  while (this.tok.value !== "from") {
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
        return parseImportUsingExport.call(this);
      }

      return super.parseStatement(context, topLevel, exports);
    }
  };
}

module.exports = ParserExtension;
