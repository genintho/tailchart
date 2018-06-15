const contrib = require("blessed-contrib");

module.exports = class RawLog {
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
    this.offset = config.preTrim ? parseInt(config.preTrim, 10) : 0;
  }

  newLine(line) {
    this.rollingLog.log(line.substr(this.offset));
  }
  reset() {
    // no-op
  }
};
