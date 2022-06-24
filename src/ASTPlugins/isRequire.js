/**
 * In very rare cases we might face false positive require
 * For example if a method inside an object is called require/import
 * ```js
 *
 * const obj = {
 *   require(input) {},
 *   import(input) {},
 * };
 * ```
 * Although `{require(input) {}}` is not require, when the same syntax is used in JSX it is different
 * ```js
 *  <img src={require('input') {}} />
 * ```
 * The difference between two cases is that,
 * when used as function, the input argument is not an string.
 * when used as require, the input is string.
 */

const callExpressionHandler = (node = {}) => {
  const isRequire =
    node.callee.name === "require" || node.callee.name === "import";

  const path =
    (node.arguments &&
      node.arguments.length === 1 &&
      node.arguments[0] &&
      node.arguments[0].type === "Literal" && // Literal are string values (not variables)
      node.arguments[0].value) ||
    null;

  if (!isRequire || !path) return null;

  return path;
};

/**
 * This is used for the following syntax
 * ```js
 * <img src={require('a')}/>
 * ```
 */
const propertyHandler = (node = {}) => {
  const { key, value } = node;
  const isRequire =
    key &&
    key.type === "Identifier" &&
    (key.name === "require" || key.name === "import");

  const path =
    (value &&
      value.params &&
      value.params.length === 1 &&
      value.params[0].type === "Literal" &&
      value.params[0].value) ||
    null;

  if (!isRequire || !path) return null;

  return path;
};

module.exports = { callExpressionHandler, propertyHandler };
