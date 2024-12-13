import type { CommandInterface } from "~commands/command-interface"

export class Maximized implements CommandInterface {
  readonly uniqueKey: string = "gesture-maximized"
  readonly title: string = "command_gesture_maximized_title"
  readonly description: string = "command_gesture_maximized_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.windows.getCurrent().then((window) => {
      let state = window.state
      if (state === "maximized") {
        state = "normal"
      } else {
        state = "maximized"
      }
      chrome.windows.update(window.id, { state: state }).then()
    })
  }
}
