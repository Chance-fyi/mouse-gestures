import type { CommandInterface } from "~commands/command-interface"

let previousState: chrome.windows.windowStateEnum = "maximized"

export class Fullscreen implements CommandInterface {
  readonly uniqueKey: string = "gesture-fullscreen"
  readonly title: string = "command_gesture_fullscreen_title"
  readonly description: string = "command_gesture_fullscreen_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.windows.getCurrent((win) => {
      if (win.state === "fullscreen") {
        chrome.windows.update(win.id, { state: previousState }).then()
      } else {
        previousState = win.state as chrome.windows.windowStateEnum
        chrome.windows.update(win.id, { state: "fullscreen" }).then()
      }
    })
  }
}
