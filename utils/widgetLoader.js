const fs = require("fs");
const path = require("path");

module.exports = function widgetLoader() {
  const configTypeConstructor = new Map();
  const widgetFolder = path.resolve(__dirname, "../widgets");
  fs.readdirSync(widgetFolder).forEach(fileName => {
    const modulePath = path.resolve(widgetFolder, fileName);
    if (fs.lstatSync(modulePath).isDirectory()) {
      return;
    }
    const module = require(modulePath);

    if (!module.hasOwnProperty("CONFIG_TYPE")) {
      console.warn(
        `Widget definition in ${fileName} need to define CONFIG_TYPE`
      );
      return;
    }
    if (!module.hasOwnProperty("sanitizeConfig")) {
      console.warn(
        `Widget definition in ${fileName} need to define sanitizeConfig`
      );
      return;
    }
    configTypeConstructor.set(module.CONFIG_TYPE, module);
  });
  return configTypeConstructor;
};
