const config = require("./config.json");
const TailLib = require("tail").Tail;

const blessed = require("blessed");
const contrib = require("blessed-contrib");

const RawLogWidget = require("./widgets/RawLog");
const FilterLogWidget = require("./widgets/FilterLog");
const SplitCounterWidget = require("./widgets/SplitCounter");
const LastValueWidget = require("./widgets/LastValue");

const colNb = config.screens.reduce((accumulator, current) => {
  if (!accumulator) {
    accumulator = 0;
  }
  return Math.max(accumulator, current.col + 1);
});

const rowNb = config.screens.reduce((accumulator, current) => {
  if (!accumulator) {
    accumulator = 0;
  }
  return Math.max(accumulator, current.row + 1);
});

const screen = blessed.screen();
const grid = new contrib.grid({ rows: rowNb, cols: colNb, screen: screen });

const widgets = config.screens.map((screenConfig, index) => {
  switch (screenConfig.type) {
    case "raw":
      return new RawLogWidget(grid, screenConfig);
      break;
    case "filteredLog":
      return new FilterLogWidget(grid, screenConfig);
      break;
    case "splitCounter":
      return new SplitCounterWidget(grid, screenConfig);
      break;
    case "lastValue":
      return new LastValueWidget(grid, screenConfig);
      break;
    default:
      throw new Error(
        `Unknown widget type ${screenConfig.type} at index ${index}`
      );
      break;
  }
});

const tail = new TailLib(config.source);

tail.on("line", function(data) {
  widgets.forEach(widget => {
    widget.newLine(data);
  });
});
tail.on("error", function(error) {
  console.log("ERROR: ", error);
});

screen.key(["escape", "q", "C-c"], function(ch, key) {
  return process.exit(0);
});

screen.key(["r"], function(ch, key) {
  widgets.forEach(widget => {
    widget.reset();
  });
});

screen.render();
