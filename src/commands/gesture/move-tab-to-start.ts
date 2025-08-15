import type { CommandInterface } from "~commands/command-interface"

export class MoveTabToStart implements CommandInterface {
  readonly uniqueKey: string = "gesture-move-tab-to-start"
  readonly title: string = "command_gesture_move_tab_to_start_title"
  readonly description: string = "command_gesture_move_tab_to_start_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.move(tabs[0].id, { index: 0 }).then()
    })
  }
}
