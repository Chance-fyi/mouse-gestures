import type { CommandInterface } from "~commands/command-interface"
import { NewTab } from "~commands/gesture/new-tab"
import type { DragData } from "~core/event"
import { ConfigType, Position } from "~enum/command"

export class Search implements CommandInterface {
  readonly uniqueKey: string = "drag-image-search"
  readonly title: string = "command_drag_text_search_title"
  readonly description: string = "command_drag_image_search_description"
  config: { [key: string]: any } = {
    disposition: {
      title: "command_drag_text_search_disposition_title",
      description: "command_drag_text_search_disposition_description",
      type: ConfigType.Select,
      options: [
        {
          label: "command_drag_text_search_disposition_option_current_tab",
          value: "CURRENT_TAB"
        },
        {
          label: "command_drag_text_search_disposition_option_new_tab",
          value: "NEW_TAB"
        },
        {
          label: "command_drag_text_search_disposition_option_new_window",
          value: "NEW_WINDOW"
        }
      ],
      value: "NEW_TAB"
    },
    active: {
      title: "command_drag_text_search_active_title",
      description: "command_drag_text_search_active_description",
      type: ConfigType.Toggle,
      visibleWhen: {
        key: "disposition",
        equals: "NEW_TAB"
      },
      value: true
    },
    position: {
      title: "command_drag_image_search_position_title",
      description: "command_drag_image_search_position_description",
      type: ConfigType.Select,
      visibleWhen: {
        key: "disposition",
        equals: "NEW_TAB"
      },
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
    },
    engine: {
      title: "command_drag_text_search_engine_title",
      description: "command_drag_image_search_engine_description",
      type: ConfigType.Input,
      value: ""
    }
  }
  data: DragData

  execute(): void {
    const engine: string =
      this.config.engine.value || "https://lens.google.com/uploadbyurl?url="
    let url: string
    if (engine.includes("%s")) {
      url = engine.replace("%s", this.data.content)
    } else {
      url = engine + this.data.content
    }

    const disposition = this.config.disposition.value
    const active = this.config.active.value as boolean
    const position = (this.config.position?.value as Position) || Position.End

    if (disposition === "NEW_TAB") {
      new NewTab().newTab(position, active, url)
      return
    }

    this.openUrl(url, disposition, active)
  }

  openUrl(url: string, disposition: string, active: boolean = true): void {
    switch (disposition) {
      case "CURRENT_TAB":
        chrome.tabs.update({ url: url }).then()
        break
      case "NEW_WINDOW":
        chrome.windows.create({ url: url, state: "maximized" }).then()
        break
      default:
        chrome.tabs.create({ url: url, active }).then()
        break
    }
  }
}
