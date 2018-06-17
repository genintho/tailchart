const ConfigChecks = require("../utils/configChecks");
const contrib = require("blessed-contrib");

class RawLog {
  static sanitizeConfig(config) {
    return Object.assign(ConfigChecks.global(config), {
      prefixTrimIndex: ConfigChecks.sanitizeInteger(
        config,
        "prefixTrimIndex",
        0
      )
    });
  }
  constructor(grid, config) {
    this.rollingLog = grid.set(
      config.row,
      config.col,
      config.rowspan,
      config.colspan,
      contrib.log,
      {
        width: "90%",
        height: "100%",
        // fg: "green",
        // selectedFg: "green",
        label: config.name
      }
    );
    this.prefixTrimIndex = config.prefixTrimIndex;
  }

  newLine(line) {
    line = line.substr(this.prefixTrimIndex);
    this.rollingLog.log(line);
  }
  reset() {
    // no-op
  }
}

RawLog.CONFIG_TYPE = "raw";
module.exports = RawLog;
