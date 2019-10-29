// Example of supported ES Module and Common JS imports
const common = require('path')
var promise = import("path");
import defaultExport from "path";
import * as name from "path";
import { export1 } from "path";
import { export1 as alias1 } from "path";
import { export1 , export2 } from "path";
import { foo , bar } from "path/to/un-exported/file";
import { export1 , export2 as alias2 } from "path";
import defaultExport, { export1 } from "path";
import defaultExport, * as name from "path";
import "path";