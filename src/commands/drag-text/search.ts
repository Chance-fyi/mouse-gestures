import isURL from "validator/lib/isURL"

import type { CommandInterface } from "~commands/command-interface"
import { Search as ImageSearch } from "~commands/drag-image/search"
import { NewTab } from "~commands/gesture/new-tab"
import type { DragData } from "~core/event"
import { ConfigType, Position } from "~enum/command"

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
      title: "command_drag_text_search_position_title",
      description: "command_drag_text_search_position_description",
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

  async execute(): Promise<void> {
    const disposition = this.config.disposition.value
    const active = this.config.active.value as boolean
    const position = (this.config.position?.value as Position) || Position.End

    if (this.config.openUrl.value && isURL(this.data.content)) {
      let url: string = this.data.content
      if (!url.startsWith("http")) {
        url = "https://" + url
      }
      if (disposition === "NEW_TAB") {
        new NewTab().newTab(position, active, url)
        return
      }
      new ImageSearch().openUrl(url, disposition, active)
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

      if (disposition === "NEW_TAB") {
        new NewTab().newTab(position, active, url)
        return
      }
      new ImageSearch().openUrl(url, disposition, active)
      return
    }

    if (disposition !== "NEW_TAB") {
      await chrome.search.query({
        text: this.data.content,
        disposition
      })
      return
    }

    const originalTab = await this.getOriginalTab()
    const tabIdsBefore = new Set(
      (await chrome.tabs.query({ currentWindow: true })).flatMap((tab) =>
        tab.id == null ? [] : [tab.id]
      )
    )

    await chrome.search.query({
      text: this.data.content,
      disposition: "NEW_TAB"
    })

    const tabsAfter = await chrome.tabs.query({ currentWindow: true })
    const newTab = tabsAfter.find(
      (tab) => tab.id != null && !tabIdsBefore.has(tab.id)
    )

    if (newTab?.id != null && originalTab?.index != null) {
      await chrome.tabs.move(newTab.id, {
        index: this.getTargetIndex(position, originalTab.index, tabsAfter.length)
      })
    }

    if (!active && originalTab?.id != null) {
      await chrome.tabs.update(originalTab.id, { active: true })
    }
  }

  private async getOriginalTab() {
    const [originalTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })

    return originalTab
  }

  private getTargetIndex(position: Position, activeIndex: number, tabCount: number) {
    switch (position) {
      case Position.Home:
        return 0
      case Position.Left:
        return activeIndex
      case Position.Right:
        return activeIndex + 1
      case Position.End:
      default:
        return tabCount - 1
    }
  }
}
