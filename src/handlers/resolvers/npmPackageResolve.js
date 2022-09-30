let packageJsonFile = null;

function npmPackageResolve(relPath, { packageJson } = {}) {
  let isNodeModule = false;
  let resolvedNpmPack = null;

  /**
   * if packageJson is not provided, return early
   * if it's not an absolute import, return early
   */
  if (!packageJson || relPath[0] === ".") {
    return { resolvedNpmPack, isNodeModule };
  }

  try {
    if (!packageJsonFile) {
      packageJsonFile = require("../../../../../front/ui/package.json"); //packageJson);
    }
    const allDeps = {
      ...(packageJsonFile.dependencies || {}),
      ...(packageJsonFile.devDependencies || {}),
      ...(packageJsonFile.peerDependencies || {}),
    };
    resolvedNpmPack =
      Object.keys(allDeps).find((key) => relPath.startsWith(key)) || null;
    isNodeModule = !!resolvedNpmPack;
  } catch (error) {
    // nothing to do, we can default to checking node_modules folder
    console.log("error while retrieving package.json file: ", error);
  }

  return { resolvedNpmPack, isNodeModule };
}

module.exports = npmPackageResolve;
