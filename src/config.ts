import {Direction, Operations} from "~enum";
import {Storage} from "@plasmohq/storage"

type DirectionKeys = keyof typeof Direction;

export interface Config {
  gestures: {
    [key in DirectionKeys]: Operations
  },
  arrows: {
    [key in DirectionKeys]: string
  },
  enableGestureCue: boolean,
  strokeStyle: string,
  lineWidth: number,
}

export const DefaultConfig: Config = {
  gestures: {
    Up: Operations.ScrollUp,
    Down: Operations.ScrollDown,
    Left: Operations.Backward,
    Right: Operations.Forward,
    UpDown: Operations.ScrollToBottom,
    UpLeft: Operations.SwitchLeftTab,
    UpRight: Operations.SwitchRightTab,
    DownUp: Operations.ScrollToTop,
    DownLeft: Operations.Fullscreen,
    DownRight: Operations.CloseCurrentTab,
    LeftRight: Operations.CloseOtherTabs,
    LeftUp: Operations.IncognitoWindow,
    LeftDown: Operations.Invalid,
    RightLeft: Operations.ReopenLastClosedTab,
    RightUp: Operations.OpenNewTab,
    RightDown: Operations.Refresh,
  },
  arrows: {
    Up: "🡱",
    Down: "🡳",
    Left: "🡰",
    Right: "🡲",
    UpDown: "⮁",
    UpLeft: "⮪",
    UpRight: "⮫",
    DownUp: "⮃",
    DownLeft: "⮨",
    DownRight: "⮩",
    LeftRight: "⮀",
    LeftUp: "⮬",
    LeftDown: "⮮",
    RightLeft: "⮂",
    RightUp: "⮭",
    RightDown: "⮯",
  },
  enableGestureCue: true,
  strokeStyle: '#0072f3',
  lineWidth: 2
}

export const getConfig = async () => {
  const storage = new Storage();
  let cfg: Config = await storage.get("config");
  if (cfg) {
    return cfg;
  }
  await storage.set("config", DefaultConfig);
  return DefaultConfig;
}

export const setConfig = (config: Config) => {
  const storage = new Storage();
  storage.set("config", config).then();
}