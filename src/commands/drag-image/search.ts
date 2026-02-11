import type { CommandInterface } from "~commands/command-interface"
import type { DragData } from "~core/event"
import { ConfigType } from "~enum/command"

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

    this.openUrl(url, this.config.disposition.value)
  }

  openUrl(url: string, disposition: string): void {
    switch (disposition) {
      case "CURRENT_TAB":
        chrome.tabs.update({ url: url }).then()
        break
      case "NEW_WINDOW":
        chrome.windows.create({ url: url, state: "maximized" }).then()
        break
      default:
        chrome.tabs.create({ url: url }).then()
        break
    }
  }
}
