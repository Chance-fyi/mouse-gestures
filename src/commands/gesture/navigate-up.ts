import { parse } from "tldts"

import type { CommandInterface } from "~commands/command-interface"
import { ConfigType } from "~enum/command"

export class NavigateUp implements CommandInterface {
  readonly uniqueKey: string = "gesture-navigate-up"
  readonly title: string = "command_gesture_navigate_up_title"
  readonly description: string = "command_gesture_navigate_up_description"
  config: { [key: string]: any } = {
    removeSubdomain: {
      title: "command_gesture_navigate_up_remove_subdomain_title",
      description: "command_gesture_navigate_up_remove_subdomain_description",
      type: ConfigType.Toggle,
      value: false
    }
  }

  window: boolean = true

  execute(): void {
    const url = new URL(window.location.href)
    if (url.pathname !== "/") {
      url.pathname = url.pathname.replace(/\/[^/]+\/?$/, "/")
      url.search = url.hash = ""
    } else {
      if (this.config.removeSubdomain.value) {
        const parts = parse(url.toString())
        if (parts.subdomain) {
          const subdomain = parts.subdomain.split(".").slice(1).join(".")
          url.host = subdomain ? `${subdomain}.${parts.domain}` : parts.domain
        } else {
          return
        }
      } else {
        return
      }
    }

    window.location.href = url.toString()
  }
}
