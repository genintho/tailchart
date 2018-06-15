const contrib = require("blessed-contrib");
const RawLogWidget = require("./RawLog");

module.exports = class FilterLog extends RawLogWidget {
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
};
