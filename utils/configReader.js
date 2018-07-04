const fs = require("fs");
const stripJsonComments = require("strip-json-comments");

module.exports = function configReader(configPath) {
  if (!fs.existsSync(configPath)) {
    console.error(`File ${configPath} can not be found`);
    process.exit(1);
  }

  return JSON.parse(
    stripJsonComments(fs.readFileSync(configPath, { encoding: "utf-8" }))
  );
};
