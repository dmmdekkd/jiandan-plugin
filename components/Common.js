import Cfg from "./Cfg.js";
import render from "./Render.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  render,
  cfg: Cfg.get,
  isDisable: Cfg.isDisable,
  sleep,
};
