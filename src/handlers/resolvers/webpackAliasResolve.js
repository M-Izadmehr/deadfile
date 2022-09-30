// used to read the file only once
let webpackAliasList = null;

/**
 * resolve webpack alias from webpack config
 * @param relPath
 * @param webpackConfig
 * @returns {{resolvedWebpackAlias: null, isWebpackAlias: boolean}}
 */
const webpackAliasResolve = (relPath, { webpackConfig }) => {
  let resolvedWebpackAlias = null;
  let isWebpackAlias = false;

  /**
   * if webpackConfig is not provided, return early
   * if it's not an absolute import, return early
   */
  if (!webpackConfig || relPath[0] === ".") {
    return { resolvedWebpackAlias, isWebpackAlias };
  }

  try {
    if (!webpackAliasList) {
      const config = require(webpackConfig);
      // webpack config file can be an object or a function
      const configObject =
        typeof config === "function" ? config?.("development") : config;

      webpackAliasList = configObject?.resolve?.alias || {};
    }

    const matchedAlias = Object.entries(webpackAliasList).find(([key]) =>
      relPath.startsWith(key)
    );
    isWebpackAlias = !!matchedAlias;

    // if it is a babel alias, replace the beginning of relPath with the matchedAlias
    if (isWebpackAlias) {
      resolvedWebpackAlias = relPath.replace(matchedAlias[0], matchedAlias[1]);
    }
  } catch (error) {
    console.log("error while retrieving webpack config file: ", error);
  }

  return { resolvedWebpackAlias, isWebpackAlias };
};

module.exports = webpackAliasResolve;
