const findBabelConfig = require("find-babel-config");
const path = require("path");
let babelAliasList = null;
let babelRoot = "";

function babelModuleResolver(relPath, { packageJson } = {}) {
  let resolvedBabelModuleAlias = null;
  let isBabelAlias = false;

  /**
   * if it's not an absolute import, return early
   */
  if (relPath[0] === ".") {
    return { resolvedBabelModuleAlias, isBabelAlias };
  }

  // if babel file is not already retrieved, retrieve it
  if (!babelAliasList) {
    const loadedConfig = findBabelConfig.sync(packageJson);

    // find module-resolver configuration
    const moduleResolverConfig = loadedConfig?.config?.plugins?.find?.(
      (element) => {
        if (Array.isArray(element)) {
          if (
            // TODO: support https://www.npmjs.com/package/babel-plugin-module-alias
            element[0] === "module-resolver" ||
            element[0] === "babel-plugin-module-resolver"
          ) {
            return element;
          }
        }
      }
    );

    // if no proper babel config with alias is found, return the relPath
    if (!moduleResolverConfig) {
      return { resolvedBabelModuleAlias, isBabelAlias };
    }

    // first key is the name, and second key is the alias list
    const opts = moduleResolverConfig?.[1];
    babelAliasList = opts?.alias || {};
    babelRoot = opts?.root?.[0] || "";
  }

  const matchedAlias = Object.entries(babelAliasList).find(([key]) =>
    relPath.startsWith(key)
  );
  isBabelAlias = !!matchedAlias;

  // if it is a babel alias, replace the beginning of relPath with the matchedAlias
  if (isBabelAlias) {
    resolvedBabelModuleAlias = relPath.replace(
      matchedAlias[0],
      matchedAlias[1]
    );
    // if new path is relative, add babel root
    if (resolvedBabelModuleAlias[0] === ".") {
      resolvedBabelModuleAlias = path.resolve(
        babelRoot,
        resolvedBabelModuleAlias
      );
    }
  }

  return { resolvedBabelModuleAlias, isBabelAlias };
}

module.exports = babelModuleResolver;
