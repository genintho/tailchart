const config = require("./config.json");
const _ = require("lodash");
const fs = require("fs");
const TailLib = require("tail").Tail;

const blessed = require("blessed");
const contrib = require("blessed-contrib");

const configTypeConstructor = new Map();

fs.readdirSync("./widgets").forEach(fileName => {
  const module = require("./widgets/" + fileName);
  if (!module.hasOwnProperty("CONFIG_TYPE")) {
    console.warn(`Widget definition in ${fileName} need to define CONFIG_TYPE`);
    return;
  }
  configTypeConstructor.set(module.CONFIG_TYPE, module);
});

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

const screen = blessed.screen({
  smartCSR: true,
  autoPadding: true
});
const grid = new contrib.grid({ rows: rowNb, cols: colNb, screen: screen });

const widgetNames = new Set();
const widgets = config.screens.map((screenConfig, index) => {
  if (!_.isString(screenConfig.name)) {
    throw new Error(
      `Screen ${index + 1} is missing the required attribute 'name'`
    );
  }
  if (widgetNames.has(screenConfig.name)) {
    throw new Error(`Multiple screen with name ${screenConfig.name}`);
  }
  widgetNames.add(screenConfig.name);
  if (!_.isNumber(screenConfig.row)) {
    throw new Error(
      `Screen ${screenConfig.name} is missing the required attribute 'row'.`
    );
  }
  if (!_.isNumber(screenConfig.col)) {
    throw new Error(
      `Screen ${screenConfig.name} is missing the required attribute 'col'.`
    );
  }
  if (!_.isNumber(screenConfig.rowspan)) {
    throw new Error(
      `Screen ${screenConfig.name} is missing the required attribute 'rowspan'.`
    );
  }
  if (!_.isNumber(screenConfig.colspan)) {
    throw new Error(
      `Screen ${screenConfig.name} is missing the required attribute 'colspan'.`
    );
  }

  if (!configTypeConstructor.has(screenConfig.type)) {
    throw new Error(
      `Unknown widget type ${screenConfig.type} at index ${index}`
    );
  }
  const cls = configTypeConstructor.get(screenConfig.type);
  const cleanConfig = cls.sanitizeConfig(screenConfig);
  return new cls(grid, cleanConfig);
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
