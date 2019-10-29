let Parser = require("acorn-loose");
let ParserWalk = require("acorn-walk");

const parseImportFromExport = require("./parseImportFromExport");
const parseJsx = require("./parseJsx");
const injectImportUsingExportWalk = require("./walk");

Parser = Parser.LooseParser.extend(parseImportFromExport);
ParserWalk = injectImportUsingExportWalk(ParserWalk);

const ParserWithJsx = entry => Parser.parse(parseJsx(entry));

module.exports = { Parser: ParserWithJsx, ParserWalk };
