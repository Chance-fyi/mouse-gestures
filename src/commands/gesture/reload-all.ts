import type { CommandInterface } from "~commands/command-interface"

export class ReloadAll implements CommandInterface {
  readonly uniqueKey: string = "gesture-reload-all"
  readonly title: string = "command_gesture_reload_all_title"
  readonly description: string = "command_gesture_reload_all_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({}, (tabs) => {
      for (let tab of tabs) {
        chrome.tabs.reload(tab.id).then()
      }
    })
  }
}
