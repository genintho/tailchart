#!/usr/bin/env node

const blessed = require("blessed");
const calculateScreenSize = require("./utils/calculateScreenSize");
const ConfigError = require("./exceptions/ConfigError");
const configChecker = require("./utils/configChecker");
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
try {
  configChecker(config);
} catch (e) {
  if (e instanceof ConfigError) {
    console.error(e.message);
    process.exit(1);
  }
}
const screen = blessed.screen({
  smartCSR: true,
  autoPadding: true
});

const grid = new contrib.grid({
  ...calculateScreenSize(config),
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
