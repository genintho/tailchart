const contrib = require("blessed-contrib");
const RawLogWidget = require("./RawLog");

class FilterLog extends RawLogWidget {
  static sanitizeConfig(config) {
    return config;
  }
  constructor(grid, config) {
    super(grid, config);
    this.regExp = new RegExp(config.match, "g");
  }

  newLine(line) {
    if (this.regExp.test(line)) {
      super.newLine(line);
    }
  }
  reset() {
    // no-op
  }
}

FilterLog.CONFIG_TYPE = "filteredLog";
module.exports = FilterLog;
