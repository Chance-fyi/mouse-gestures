import type {ConfigInterface} from "~config/default-config";
import {DefaultConfig} from "~config/default-config";
import {Storage} from "@plasmohq/storage"

export class Config {
  private static instance: Config;
  private static configData: ConfigInterface;

  public static async loadConfig() {
    if (!Config.instance) {
      Config.instance = new Config();
      const storage = new Storage();
      let cfg: ConfigInterface = await storage.get("config") || DefaultConfig;
      const _ = require('lodash');
      this.configData = _.merge(DefaultConfig, cfg);
    }
  }

  public static get(): ConfigInterface {
    return this.configData;
  }
}