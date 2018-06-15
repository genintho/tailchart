const config = require("./config.json");
const TailLib = require("tail").Tail;
// const clearScreen = require("clear");
// const clui = require("clui");
// const chalk = require("chalk");

const blessed = require("blessed");
const contrib = require("blessed-contrib");
const screen = blessed.screen();

const grid = new contrib.grid({ rows: 1, cols: 2, screen: screen });

// screen.append(line); //must append before setting data
// line.setData([data]);
const rollingLog = grid.set(0, 0, 1, 1, contrib.log, {
  // fg: "green",
  // selectedFg: "green",
  label: "Raw Log"
});

const table = grid.set(0, 1, 1, 1, contrib.table, {
  keys: true,
  fg: "white",
  selectedFg: "white",
  selectedBg: "blue",
  interactive: false,
  // label: "Active Processes",
  width: "80%",
  height: "30%",
  border: { type: "line", fg: "cyan" },
  columnSpacing: 10,
  columnWidth: [7, 12, 15]
});

const tail = new TailLib(config.source);

let numberOfLines = 0;
const regExp = new RegExp(config.screens[0].match, "g");
let tableMatch = {};
tail.on("line", function(data) {
  numberOfLines++;
  rollingLog.log(data);
  const ret = regExp.exec(data);

  if (ret) {
    const token = ret[0];
    if (!tableMatch[token]) {
      tableMatch[token] = 0;
    }
    tableMatch[token]++;
    updateTableData();
  }
});
function updateTableData() {
  let total = 0;
  Object.keys(tableMatch).forEach(key => {
    total += tableMatch[key];
  });
  const keys = Object.keys(tableMatch);
  keys.sort();
  table.setData({
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
tail.on("error", function(error) {
  console.log("ERROR: ", error);
});

screen.key(["escape", "q", "C-c"], function(ch, key) {
  return process.exit(0);
});

screen.key(["r"], function(ch, key) {
  numberOfLines = 0;
  tableMatch = {};
  updateTableData();
});

screen.render();
