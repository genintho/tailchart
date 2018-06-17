const _ = require("lodash");
const ConfigChecks = require("../utils/configChecks");
const contrib = require("blessed-contrib");

module.exports = class RawLog {
  static sanitizeConfig(config) {
    const cleanConfig = {
      name: config.name,
      row: config.row,
      col: config.col,
      rowspan: config.rowspan,
      colspan: config.colspan,
      prefixTrimIndex: ConfigChecks.sanitizeNumber(config, "prefixTrimIndex", 0)
    };

    return cleanConfig;
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
};
