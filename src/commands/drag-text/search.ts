import type { CommandInterface } from "~commands/command-interface"
import type { DragData } from "~core/event"

export class Search implements CommandInterface {
  readonly uniqueKey: string = "drag-text-search"
  readonly title: string = "command_drag_text_search_title"
  readonly description: string = "command_drag_text_search_description"
  config: { [key: string]: any } = {
    disposition: {
      title: "command_drag_text_search_disposition_title",
      description: "command_drag_text_search_disposition_description",
      type: "select",
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
    }
  }
  data: DragData

  execute(): void {
    chrome.search
      .query({
        text: this.data.content,
        disposition: this.config.disposition.value
      })
      .then()
  }
}
