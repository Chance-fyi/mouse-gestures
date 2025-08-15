import type { CommandInterface } from "~commands/command-interface"

export class MoveTabToEnd implements CommandInterface {
  readonly uniqueKey: string = "gesture-move-tab-to-end"
  readonly title: string = "command_gesture_move_tab_to_end_title"
  readonly description: string = "command_gesture_move_tab_to_end_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.move(tabs[0].id, { index: -1 }).then()
    })
  }
}
