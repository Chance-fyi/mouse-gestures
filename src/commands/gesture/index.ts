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
import { OpenUrl } from "~commands/gesture/open-url"
import { OpenUrlWindow } from "~commands/gesture/open-url-window"
import { Pinned } from "~commands/gesture/pinned"
import { Reload } from "~commands/gesture/reload"
import { ReloadAll } from "~commands/gesture/reload-all"
import { RestoreTab } from "~commands/gesture/restore-tab"
import { Scroll } from "~commands/gesture/scroll"
import { ScrollToBottom } from "~commands/gesture/scroll-to-bottom"
import { ScrollToTop } from "~commands/gesture/scroll-to-top"
import { StopLoading } from "~commands/gesture/stop-loading"
import { ToggleLeftTab } from "~commands/gesture/toggle-left-tab"
import { ToggleRightTab } from "~commands/gesture/toggle-right-tab"

export default [
  new Scroll(),
  new ScrollToTop(),
  new ScrollToBottom(),
  new Forward(),
  new Backward(),
  new Reload(),
  new ReloadAll(),
  new StopLoading(),
  new Duplicate(),
  new NewTab(),
  new CloseTab(),
  new CloseOtherTabs(),
  new CloseLeftTabs(),
  new CloseRightTabs(),
  new RestoreTab(),
  new ToggleLeftTab(),
  new ToggleRightTab(),
  new Pinned(),
  new Muted(),
  new MutedOtherTabs(),
  new Maximized(),
  new Minimized(),
  new Fullscreen(),
  new NewWindow(),
  new OpenUrl(),
  new OpenUrlWindow()
]
