import type { CommandInterface } from "~commands/command-interface"

export class ToggleLeftTab implements CommandInterface {
  readonly uniqueKey: string = "gesture-toggle-left-tab"
  readonly title: string = "command_gesture_toggle_left_tab_title"
  readonly description: string = "command_gesture_toggle_left_tab_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.query({}, function (allTabs) {
        const currentTabIndex = allTabs.findIndex(
          (tab) => tab.id === tabs[0].id
        )

        let targetIndex = currentTabIndex - 1
        if (targetIndex < 0) {
          targetIndex = allTabs.length - 1
        }

        chrome.tabs.update(allTabs[targetIndex].id, { active: true }).then()
      })
    })
  }
}
