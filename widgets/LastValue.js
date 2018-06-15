const contrib = require("blessed-contrib");

module.exports = class AvgCounter {
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
    this.regExp = new RegExp(config.match, "g");
    this.tableMatch = new Map();
  }

  newLine(line) {
    const tableMatch = this.tableMatch;
    const ret = this.regExp.exec(line);

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
};
