import type { CommandInterface } from "~commands/command-interface"
import { NewTab } from "~commands/gesture/new-tab"
import type { DragData } from "~core/event"
import { ConfigType, Position } from "~enum/command"

export class Open implements CommandInterface {
  readonly uniqueKey: string = "drag-url-open"
  readonly title: string = "command_drag_url_open_title"
  readonly description: string = "command_drag_url_open_description"
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
  data: DragData

  execute(): void {
    new NewTab().newTab(
      this.config.position.value,
      this.config.active.value as boolean,
      this.data.content
    )
  }
}
