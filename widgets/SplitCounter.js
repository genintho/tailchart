const contrib = require("blessed-contrib");

module.exports = class SplitCounter {
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
        columnWidth: [20, 5, 4]
      }
    );
    this.regExp = new RegExp(config.match, "g");
    this.tableMatch = {};
  }

  newLine(line) {
    const tableMatch = this.tableMatch;
    const ret = this.regExp.exec(line);

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
          key,
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
};
