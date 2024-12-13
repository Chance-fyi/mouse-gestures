import type { CommandInterface } from "~commands/command-interface"

export class Pinned implements CommandInterface {
  readonly uniqueKey: string = "gesture-pinned"
  readonly title: string = "command_gesture_pinned_title"
  readonly description: string = "command_gesture_pinned_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { pinned: !tabs[0].pinned }).then()
    })
  }
}
