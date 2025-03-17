import type { CommandInterface } from "~commands/command-interface"
import { ConfigType } from "~enum/command"

export class ScrollToBottom implements CommandInterface {
  readonly uniqueKey: string = "gesture-scroll-to-bottom"
  readonly title: string = "command_gesture_scroll_to_bottom_title"
  readonly description: string = "command_gesture_scroll_to_bottom_description"
  config: { [key: string]: any } = {
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

  execute(): void {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: this.config.behavior.value as ScrollBehavior
    })
  }
}
