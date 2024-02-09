function packageVersion() {
  const packagePath = require("../../package.json");
  const version = packagePath.version;

  return version;
}

function packageAuthor() {
  const packagePath = require("../../package.json");
  const author = packagePath.author;

  return author;
}

function packageName() {
  const packagePath = require("../../package.json");
  const name = packagePath.name;

  return name;
}

module.exports = { packageAuthor, packageVersion, packageName }