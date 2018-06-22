const _ = require("lodash");
const ConfigChecks = require("../utils/configChecks");
const contrib = require("blessed-contrib");

const VALID_COLORS = ["red", "yellow"];

class RawLog {
  static sanitizeConfig(config) {
    const cleanConfig = Object.assign(ConfigChecks.global(config), {
      prefixTrimIndex: ConfigChecks.sanitizeInteger(
        config,
        "prefixTrimIndex",
        0
      )
    });
    cleanConfig.highlightLines = [];
    const configHightLightLines = _.get(config, "highlights.lines", []);
    if (!_.isArray(configHightLightLines)) {
      throw new Error(
        `Widget ${config.name} attribute highlights.lines must be an array`
      );
    }
    configHightLightLines.forEach((lineConfig, idx) => {
      const color = _.get(lineConfig, "color", null);
      const token = _.get(lineConfig, "match", null);
      if (!_.isString(color)) {
        throw new Error(
          `Widget ${
            config.name
          } attribute highlights.lines[${idx}].color must be a string`
        );
      }
      if (!VALID_COLORS.includes(color)) {
        throw new Error(
          `Widget ${
            config.name
          } attribute highlights.lines[${idx}].color = "${color}" is invalid. Valid colors are: ${VALID_COLORS.join(
            ","
          )}`
        );
      }
      if (!_.isString(token)) {
        throw new Error(
          `Widget ${
            config.name
          } attribute highlights.lines[${idx}].match must be a string`
        );
      }
      cleanConfig.highlightLines.push({ color, token });
    });
    return cleanConfig;
  }

  constructor(grid, config) {
    this.rollingLog = grid.set(
      config.row,
      config.col,
      config.rowspan,
      config.colspan,
      contrib.log,
      {
        width: "90%",
        height: "100%",
        tags: true,
        style: {
          scrollbar: {
            bg: "red",
            fg: "blue"
          }
        },
        scrollbar: true,
        label: config.name
      }
    );
    this.config = config;
  }

  newLine(line) {
    line = line.substr(this.config.prefixTrimIndex);
    const foundLineMatch = this.config.highlightLines.find(config => {
      return line.indexOf(config.token) !== -1;
    });
    if (foundLineMatch !== undefined) {
      const color = foundLineMatch.color;
      line = `{${color}-fg}${line}{/${color}-fg}`;
    }
    this.rollingLog.log(line);
  }
  reset() {
    // no-op
  }
}

RawLog.CONFIG_TYPE = "raw";
module.exports = RawLog;
