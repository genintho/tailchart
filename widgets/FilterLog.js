const ConfigChecks = require("../utils/configChecks");
const RawLogWidget = require("./RawLog");

class FilterLog extends RawLogWidget {
  static sanitizeConfig(config) {
    return Object.assign(ConfigChecks.global(config), {
      matcher: ConfigChecks.sanitizeRegExp(config, "match")
    });
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
