const path = require("path");
const enhancedResolve = require("./resolvers/enhancedResolve");
const webpackAliasResolve = require("./resolvers/webpackAliasResolve");
const nodeModulesResolve = require("./resolvers/npmPackageResolve");
const babelModuleResolver = require("./resolvers/babelModuleResolver");
const fs = require("fs");

/**
 * Get `absPath` from `relPath` after handling babel aliases, npm packages, and webpack aliases.
 * @param relPath
 * @param currentFile
 * @param webpackConfig
 * @param packageJson
 * @returns {{
 * isBabelAlias,
 * absPath: *,
 * isNodeModule,
 * notFound: null,
 * isNodeModuleAlias: boolean,
 * isAbsoluteImport: boolean,
 * isWebpackAlias: boolean,
 * }}
 */
function resolve({
  relPath = "",
  currentFile = "",
  webpackConfig,
  packageJson,
} = {}) {
  // initialize the result
  let isNodeModuleAlias = false;
  let isAbsoluteImport = false;
  let notFound = null;
  let resolved = relPath;
  let absPath = null;

  const currentDir = path.dirname(currentFile || resolved);

  // path doesn't start with a '.', it is an absolute import
  if (resolved[0] !== ".") {
    isAbsoluteImport = true;
  }

  // if relPath is absolute, and it can be a babel alias, check it
  const { resolvedBabelModuleAlias, isBabelAlias } = babelModuleResolver(
    resolved,
    {
      webpackConfig,
      packageJson,
    }
  );
  resolved = resolvedBabelModuleAlias || resolved;
  // if babel already found an absolute path, we can stop here
  if (resolvedBabelModuleAlias?.[0] === "/") {
    return {
      isWebpackAlias: false,
      isNodeModule: false,
      isNodeModuleAlias,
      isAbsoluteImport,
      isBabelAlias,
      notFound,
      absPath: resolvedBabelModuleAlias,
    };
  }

  // if relPath is absolute, and it can be a webpack alias, check it
  // path doesn't start with a '.' or with a '/' which should be local dependencies
  const { resolvedWebpackAlias, isWebpackAlias } = webpackAliasResolve(
    resolved,
    {
      webpackConfig,
      packageJson,
    }
  );
  resolved = resolvedWebpackAlias || resolved;

  // if relPath is absolute, and it can be npm package, check it
  const { resolvedNpmPack, isNodeModule } = nodeModulesResolve(resolved, {
    webpackConfig,
    packageJson,
  });

  // if we already found a npm package, we can stop here
  if (resolvedNpmPack) {
    return {
      isWebpackAlias,
      isNodeModuleAlias,
      isNodeModule,
      isAbsoluteImport,
      isBabelAlias,
      notFound,
      absPath: resolvedNpmPack,
    };
  }

  try {
    // absPath = enhancedResolve(currentDir, resolved, {
    //   webpackConfig,
    //   packageJson,
    // });
    const cwd = process.cwd();
    const ful = path.resolve(currentDir, resolved);
    const fu2 = path.resolve(process.cwd(), resolved);
    const fik = path.relative(process.cwd(), resolved);
    const filk = path.relative(currentDir, resolved);
    const fok = path.relative(resolved, process.cwd());

    const path2 =
      resolved?.[0] === "/"
        ? path.relative(process.cwd(), resolved)
        : path.resolve(currentDir, resolved);

    const path3 = fs.existsSync(
      "../../front/ui/app/src/index.js"
      // resolved?.[0] === "/" ? resolved : path.join(currentDir, resolved)
    );
    const path4 = enhancedResolve(currentDir, resolved);
    absPath =
      resolved?.[0] === "/"
        ? resolved
        : // We need to pass in
          // ? path.relative(process.cwd(), resolved)
          path.resolve(currentDir, resolved);
    console.log("===== fik =====");
    if (absPath) {
      //file exists
      console.log("===== wow =====");
    }
  } catch (error) {
    if (!error.missing) {
      throw error;
    }

    // if the error is caused because path is not found, set the notFound flag
    notFound = isAbsoluteImport ? resolved : path.join(currentDir, resolved);
  }

  return {
    isWebpackAlias,
    isNodeModuleAlias,
    isNodeModule,
    isAbsoluteImport,
    isBabelAlias,
    notFound,
    absPath,
  };
}

module.exports = { resolve, nodeModulesResolve };
