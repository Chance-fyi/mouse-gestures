import { type CommandInterface, type Config } from "~commands/command-interface"
import { ConfigType, Direction } from "~enum/command"

export class Scroll implements CommandInterface {
  readonly uniqueKey: string = "gesture-scroll"
  readonly title: string = "command_gesture_scroll_title"
  readonly description: string = "command_gesture_scroll_description"
  config: { [key: string]: Config } = {
    direction: {
      title: "command_gesture_scroll_config_direction_title",
      description: "command_gesture_scroll_config_direction_description",
      type: ConfigType.Select,
      options: [
        {
          label: "command_gesture_scroll_config_direction_option_up",
          value: Direction.Up
        },
        {
          label: "command_gesture_scroll_config_direction_option_down",
          value: Direction.Down
        },
        {
          label: "command_gesture_scroll_config_direction_option_left",
          value: Direction.Left
        },
        {
          label: "command_gesture_scroll_config_direction_option_right",
          value: Direction.Right
        }
      ],
      value: Direction.Up
    },
    time: {
      title: "command_gesture_scroll_config_time_title",
      description: "command_gesture_scroll_config_time_description",
      type: ConfigType.Input,
      value: "100"
    },
    proportions: {
      title: "command_gesture_scroll_config_proportions_title",
      description: "command_gesture_scroll_config_proportions_description",
      type: ConfigType.Input,
      value: "95"
    }
  }
}
