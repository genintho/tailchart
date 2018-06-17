const ConfigChecks = require("../utils/configChecks");
const RawLogWidget = require("./RawLog");

class FilterLog extends RawLogWidget {
  static sanitizeConfig(config) {
    const cleanConfig = super.sanitizeConfig(config);
    cleanConfig.matcher = ConfigChecks.sanitizeRegExp(config, "match");
    return cleanConfig;
  }
  constructor(grid, config) {
    super(grid, config);
    this.matcher = config.matcher;
  }

  newLine(line) {
    if (this.matcher.test(line)) {
      super.newLine(line);
    }
  }
  reset() {
    // no-op
  }
}

FilterLog.CONFIG_TYPE = "filteredLog";
module.exports = FilterLog;
