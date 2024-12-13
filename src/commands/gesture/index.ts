import { Backward } from "~commands/gesture/backward"
import { CloseLeftTabs } from "~commands/gesture/close-left-tabs"
import { CloseOtherTabs } from "~commands/gesture/close-other-tabs"
import { CloseRightTabs } from "~commands/gesture/close-right-tabs"
import { CloseTab } from "~commands/gesture/close-tab"
import { Duplicate } from "~commands/gesture/duplicate"
import { Forward } from "~commands/gesture/forward"
import { Fullscreen } from "~commands/gesture/fullscreen"
import { Maximized } from "~commands/gesture/maximized"
import { Minimized } from "~commands/gesture/minimized"
import { Muted } from "~commands/gesture/muted"
import { MutedOtherTabs } from "~commands/gesture/muted-other-tabs"
import { NewTab } from "~commands/gesture/new-tab"
import { NewWindow } from "~commands/gesture/new-window"
import { Pinned } from "~commands/gesture/pinned"
import { Reload } from "~commands/gesture/reload"
import { ReloadAll } from "~commands/gesture/reload-all"
import { RestoreTab } from "~commands/gesture/restore-tab"
import { Scroll } from "~commands/gesture/scroll"
import { ScrollToBottom } from "~commands/gesture/scroll-to-bottom"
import { ScrollToTop } from "~commands/gesture/scroll-to-top"

export default [
  new Scroll(),
  new ScrollToTop(),
  new ScrollToBottom(),
  new Forward(),
  new Backward(),
  new Reload(),
  new ReloadAll(),
  new Duplicate(),
  new NewTab(),
  new CloseTab(),
  new CloseOtherTabs(),
  new CloseLeftTabs(),
  new CloseRightTabs(),
  new RestoreTab(),
  new Pinned(),
  new Muted(),
  new MutedOtherTabs(),
  new Maximized(),
  new Minimized(),
  new Fullscreen(),
  new NewWindow()
]
