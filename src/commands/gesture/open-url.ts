import type { CommandInterface } from "~commands/command-interface"
import { NewTab } from "~commands/gesture/new-tab"
import { ConfigType, Position } from "~enum/command"

export class OpenUrl implements CommandInterface {
  readonly uniqueKey: string = "gesture-open-url"
  readonly title: string = "command_gesture_open_url_title"
  readonly description: string = "command_gesture_open_url_description"
  config: { [key: string]: any } = {
    url: {
      title: "command_gesture_open_url_config_url_title",
      description: "command_gesture_open_url_config_url_description",
      type: ConfigType.Input,
      value: ""
    },
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
    new NewTab().newTab(
      this.config.position.value,
      this.config.active.value as boolean,
      this.config.url.value
    )
  }
}
