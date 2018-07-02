#!/usr/bin/env node
const _ = require("lodash");
const blessed = require("blessed");
const contrib = require("blessed-contrib");
const fs = require("fs");
const program = require("commander");
const stripJsonComments = require("strip-json-comments");
const TailLib = require("tail").Tail;

program
  .option(
    "-c, --config [path]",
    "Path to the config file to use",
    "./config.json"
  )
  .parse(process.argv);

if (!fs.existsSync(program.config)) {
  throw new Error(`File ${program.config} can not be found`);
}
let config = {};
try {
  config = JSON.parse(
    stripJsonComments(fs.readFileSync(program.config, { encoding: "utf-8" }))
  );
} catch (e) {
  console.error(e);
  process.exit(1);
}
const configTypeConstructor = new Map();

fs.readdirSync("./widgets").forEach(fileName => {
  const modulePath = "./widgets/" + fileName;
  if (fs.lstatSync(modulePath).isDirectory()) {
    return;
  }
  const module = require(modulePath);

  if (!module.hasOwnProperty("CONFIG_TYPE")) {
    console.warn(`Widget definition in ${fileName} need to define CONFIG_TYPE`);
    return;
  }
  if (!module.hasOwnProperty("sanitizeConfig")) {
    console.warn(
      `Widget definition in ${fileName} need to define sanitizeConfig`
    );
    return;
  }
  configTypeConstructor.set(module.CONFIG_TYPE, module);
});

const colNb = config.widgets.reduce((accumulator, current) => {
  if (!accumulator) {
    accumulator = 0;
  }
  return Math.max(accumulator, current.col + 1);
}, 0);

const rowNb = config.widgets.reduce((accumulator, current) => {
  if (!accumulator) {
    accumulator = 0;
  }
  return Math.max(accumulator, current.row + 1);
}, 0);

const screen = blessed.screen({
  smartCSR: true,
  autoPadding: true
});
const grid = new contrib.grid({ rows: rowNb, cols: colNb, screen: screen });

const uniqueScreenName = new Set();
const widgets = config.widgets.map((screenConfig, index) => {
  if (!_.isString(screenConfig.name)) {
    throw new Error(
      `Screen ${index + 1} is missing the required attribute 'name'`
    );
  }
  if (uniqueScreenName.has(screenConfig.name)) {
    throw new Error(`Multiple screen with name ${screenConfig.name}`);
  }
  uniqueScreenName.add(screenConfig.name);

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
