import {Direction, Operations} from "~enum";

type DirectionKeys = keyof typeof Direction;

interface Config {
  gestures: {
    [key in DirectionKeys]: Operations
  },
  arrows: {
    [key in DirectionKeys]: string
  },
  strokeStyle: string,
  lineWidth: number,
}

const DefaultConfig: Config = {
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
    LeftUp: Operations.Invalid,
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
  strokeStyle: '#0072f3',
  lineWidth: 2
}

export const getConfig = () => {
  return DefaultConfig;
}