const DeadFile = require("../../src/index");
const path = require("path");

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

test("babel-module-resolver-babelrc", async () => {
  const argv = {
    _: [path.join(__dirname, "./src/index.js")],
    dir: path.join(__dirname, "./")
  };

  const analysis = new DeadFile(argv);
  // TODO: refactor code for proper await
  await timeout(1000);

  expect(Object.keys(analysis.allAssets).length).toBe(4);
  expect(
    Object.keys(analysis.allAssets).some(item => item.match("directImport"))
  ).toBe(true);
  expect(
    Object.keys(analysis.allAssets).some(item => item.match("index"))
  ).toBe(true);
  expect(
    Object.keys(analysis.allAssets).some(item => item.match("aliasedImport"))
  ).toBe(true);
  expect(
    Object.keys(analysis.allAssets).some(item => item.match("unused"))
  ).toBe(true);

  expect([...analysis.usedAssets].length).toBe(4);
  expect(
    [...analysis.usedAssets].some(item => item[0].match("directImport"))
  ).toBe(true);
  expect([...analysis.usedAssets].some(item => item[0].match("index"))).toBe(
    true
  );
  expect(
    [...analysis.usedAssets].some(item => item[0].match("aliasedImport"))
  ).toBe(true);
  expect([...analysis.usedAssets].some(item => item[0].match("lodash"))).toBe(
    true
  );

  expect([...analysis.notFound].length).toBe(1);
  expect([...analysis.notFound][0]).toBe("react");
});
