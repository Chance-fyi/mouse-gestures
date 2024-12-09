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
    proportions: {
      title: "command_gesture_scroll_config_proportions_title",
      description: "command_gesture_scroll_config_proportions_description",
      type: ConfigType.Input,
      value: "95"
    },
    behavior: {
      title: "command_gesture_scroll_config_behavior_title",
      description: "command_gesture_scroll_config_behavior_description",
      type: ConfigType.Select,
      options: [
        {
          label: "command_gesture_scroll_config_behavior_option_smooth",
          value: "smooth"
        },
        {
          label: "command_gesture_scroll_config_behavior_option_instant",
          value: "instant"
        },
        {
          label: "command_gesture_scroll_config_behavior_option_auto",
          value: "auto"
        }
      ],
      value: "smooth"
    }
  }

  window: boolean = true

  execute() {
    let top = 0
    let left = 0
    const proportions = this.config.proportions.value as number
    switch (this.config.direction.value) {
      case Direction.Up:
        top = (-proportions * window.innerHeight) / 100
        break
      case Direction.Down:
        top = (proportions * window.innerHeight) / 100
        break
      case Direction.Left:
        left = (-proportions * window.innerWidth) / 100
        break
      case Direction.Right:
        left = (proportions * window.innerWidth) / 100
        break
    }

    window.scrollBy({
      top: top,
      left: left,
      behavior: this.config.behavior.value as ScrollBehavior
    })
  }
}
