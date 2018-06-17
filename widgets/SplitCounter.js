const contrib = require("blessed-contrib");
const ConfigChecks = require("../utils/configChecks");
const MAX_WIDTH = 30;

/**
 * This widget draw a table how how many time one event has been seen.
 * It use 1 regular expression with 1 capture to identify the element to look for
 *
 * @type {module.SplitCounter}
 */
class SplitCounter {
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
        columnWidth: [MAX_WIDTH, 5, 4]
      }
    );
    this.matcher = config.matcher;
    this.tableMatch = {};
  }

  newLine(line) {
    const tableMatch = this.tableMatch;
    const ret = this.matcher.exec(line);

    if (!ret) {
      return;
    }
    const token = ret[1];
    if (!tableMatch[token]) {
      tableMatch[token] = 0;
    }
    tableMatch[token]++;
    this.updateTable();
  }
  updateTable() {
    const tableMatch = this.tableMatch;
    let total = 0;
    Object.keys(tableMatch).forEach(key => {
      total += tableMatch[key];
    });
    const keys = Object.keys(tableMatch);
    keys.sort();
    this.table.setData({
      headers: ["What", "count", "%"],
      data: keys.map(key => {
        return [
          key.substr(0, MAX_WIDTH),
          tableMatch[key],
          Math.floor((tableMatch[key] / total) * 100)
        ];
      })
    });
  }
  reset() {
    this.tableMatch = {};
    this.updateTable();
  }
}

SplitCounter.CONFIG_TYPE = "splitCounter";
module.exports = SplitCounter;
