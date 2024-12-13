import type { CommandInterface } from "~commands/command-interface"

export class Minimized implements CommandInterface {
  readonly uniqueKey: string = "gesture-minimized"
  readonly title: string = "command_gesture_minimized_title"
  readonly description: string = "command_gesture_minimized_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.windows.getCurrent().then((window) => {
      chrome.windows.update(window.id, { state: "minimized" }).then()
    })
  }
}
