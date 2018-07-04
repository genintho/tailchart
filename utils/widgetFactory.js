const _ = require("lodash");
const widgetLoader = require("./widgetLoader");

const configTypeConstructor = widgetLoader();
const uniqueScreenName = new Set();

module.exports = function widgetFactory(grid, config) {
  return config.widgets.map((screenConfig, index) => {
    if (!_.isString(screenConfig.name)) {
      throw new Error(
        `Screen ${index + 1} is missing the required attribute 'name'`
      );
    }
    if (uniqueScreenName.has(screenConfig.name)) {
      throw new Error(`Multiple screen with name ${screenConfig.name}`);
    }
    uniqueScreenName.add(screenConfig.name);

    if (!configTypeConstructor.has(screenConfig.type)) {
      console.error(
        `Unknown widget type ${screenConfig.type} at index ${index}`
      );
      process.exit(1);
    }

    const cls = configTypeConstructor.get(screenConfig.type);
    const cleanConfig = cls.sanitizeConfig(screenConfig);
    return new cls(grid, cleanConfig);
  });
};
