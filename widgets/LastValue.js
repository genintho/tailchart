const contrib = require("blessed-contrib");
const ConfigChecks = require("../utils/configChecks");

class LastValue {
  static sanitizeConfig(config) {
    return Object.assign(ConfigChecks.global(config), {
      matcher: ConfigChecks.sanitizeRegExp(config, "match")
    });
  }
  constructor(grid, config) {
    this.table = grid.set(
      config.row,
      config.col,
      config.rowspan,
      config.colspan,
      contrib.table,
      {
        keys: true,
        fg: "white",
        selectedFg: "white",
        selectedBg: "blue",
        interactive: false,
        label: config.name,
        width: "90%",
        height: "100%",
        border: { type: "line", fg: "cyan" },
        columnSpacing: 5,
        columnWidth: [40, 10]
      }
    );
    this.matcher = config.matcher;
    this.tableMatch = new Map();
  }

  newLine(line) {
    const ret = this.matcher.exec(line);

    if (!ret) {
      return;
    }
    this.tableMatch.set(ret[1], [ret[2]]);

    this.updateTable();
  }
  updateTable() {
    const tableMatch = this.tableMatch;
    const keys = Array.from(tableMatch.keys());
    keys.sort();
    this.table.setData({
      headers: ["What", "Value"],
      data: keys.map(key => {
        return [key, tableMatch.get(key)];
      })
    });
  }
  reset() {
    this.tableMatch = new Map();
    this.updateTable();
  }
}

LastValue.CONFIG_TYPE = "lastValue";
module.exports = LastValue;
