"use strict";
const path = require("path");
const Deadfile = require("../");

const dir = path.join(__dirname, "fixtures", "babel-example", "src");
const entry = [path.join(dir, "path", "to", "main", "main.js")];

const instance = new Deadfile({ _: entry, dir, report: false });
function done() {
  console.log(3 === Object.keys(instance.allAssets).length);
  console.log(3 === instance.usedAssets.size);
}
setTimeout(done, 1000);
