import isURL from "validator/lib/isURL"

import type { CommandInterface } from "~commands/command-interface"
import { Search as ImageSearch } from "~commands/drag-image/search"
import type { DragData } from "~core/event"
import { ConfigType } from "~enum/command"

export class Search implements CommandInterface {
  readonly uniqueKey: string = "drag-text-search"
  readonly title: string = "command_drag_text_search_title"
  readonly description: string = "command_drag_text_search_description"
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
    openUrl: {
      title: "command_drag_url_open_title",
      description: "command_drag_text_search_open_url_description",
      type: ConfigType.Toggle,
      value: false
    },
    engine: {
      title: "command_drag_text_search_engine_title",
      description: "command_drag_text_search_engine_description",
      type: ConfigType.Input,
      value: ""
    }
  }
  data: DragData
  permissions: string[] = ["search"]

  execute(): void {
    if (this.config.openUrl.value && isURL(this.data.content)) {
      let url: string = this.data.content
      if (!url.startsWith("http")) {
        url = "https://" + url
      }
      new ImageSearch().openUrl(url, this.config.disposition.value)
      return
    }

    const engine: string = this.config.engine.value
    if (engine) {
      let url: string
      if (engine.includes("%s")) {
        url = engine.replace("%s", this.data.content)
      } else {
        url = engine + this.data.content
      }

      new ImageSearch().openUrl(url, this.config.disposition.value)
      return
    }

    chrome.search
      .query({
        text: this.data.content,
        disposition: this.config.disposition.value
      })
      .then()
  }
}
