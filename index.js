#!/usr/bin/env node

const blessed = require("blessed");
const calculateScreensize = require("./utils/calculateScreenSize");
const configReader = require("./utils/configReader");
const contrib = require("blessed-contrib");
const program = require("commander");
const TailLib = require("tail").Tail;
const widgetFactory = require("./utils/widgetFactory");

program
  .option(
    "-c, --config [path]",
    "Path to the config file to use",
    "./config.json"
  )
  .parse(process.argv);

const config = configReader(program.config);

const screen = blessed.screen({
  smartCSR: true,
  autoPadding: true
});

const grid = new contrib.grid({
  ...calculateScreensize(config),
  screen: screen
});

const widgets = widgetFactory(grid, config);

const tail = new TailLib(config.source);

tail.on("line", function(line) {
  line = line.trim();
  if (!line.length) {
    return;
  }
  widgets.forEach(widget => {
    widget.newLine(line);
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
