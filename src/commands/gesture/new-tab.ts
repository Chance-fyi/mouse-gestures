import type { CommandInterface } from "~commands/command-interface"
import { ConfigType, Position } from "~enum/command"

export class NewTab implements CommandInterface {
  readonly uniqueKey: string = "gesture-new-tab"
  readonly title: string = "command_gesture_new_tab_title"
  readonly description: string = "command_gesture_new_tab_description"
  config: { [key: string]: any } = {
    active: {
      title: "command_gesture_new_tab_active_title",
      description: "command_gesture_new_tab_active_description",
      type: ConfigType.Toggle,
      value: true
    },
    position: {
      title: "command_gesture_new_tab_position_title",
      description: "command_gesture_new_tab_position_description",
      type: ConfigType.Select,
      options: [
        {
          label: "command_gesture_new_tab_position_option_home",
          value: Position.Home
        },
        {
          label: "command_gesture_new_tab_position_option_left",
          value: Position.Left
        },
        {
          label: "command_gesture_new_tab_position_option_right",
          value: Position.Right
        },
        {
          label: "command_gesture_new_tab_position_option_end",
          value: Position.End
        }
      ],
      value: Position.End
    }
  }

  execute(): void {
    let max = 0
    let active = 0
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      for (let tab of tabs) {
        max++
        if (tab.active) {
          active = max
        }
      }
      let index = max
      switch (this.config.position.value) {
        case Position.Home:
          index = 0
          break
        case Position.Left:
          index = active - 1
          break
        case Position.Right:
          index = active
          break
        case Position.End:
          index = max
          break
      }
      chrome.tabs
        .create({
          active: this.config.active.value as boolean,
          index: index
        })
        .then()
    })
  }
}
