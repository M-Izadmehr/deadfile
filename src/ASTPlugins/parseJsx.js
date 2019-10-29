/**
 * this extension changes all jsx tags such as <div>Hi</div> to <div>{Hi}</div>
 * So it can parse inside
 */

function parseJsx(entry) {
  // Add `{}` to beginning of tag `<div>` => `{<div>}`
  entry = entry.replace(/(\{)?(?=((<)((\w|\s)*)((>))))/g, "{");
  entry = entry.replace(/(?<=((<)((\w|\s)*)((>))))(\})?/g, "}");
  // Add `{}` to end of tag `</div>` => `{</div>}`
  entry = entry.replace(/(\{)?(?=((<\/)(\w*)>))/g, "{");
  entry = entry.replace(/(\})?(?<=((<\/)(\w*)>))/g, "}");
  return entry;
}

module.exports = parseJsx;
