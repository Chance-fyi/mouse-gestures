import type { CommandInterface } from "~commands/command-interface"

export class RestoreTab implements CommandInterface {
  readonly uniqueKey: string = "gesture-restore-tab"
  readonly title: string = "command_gesture_restore_tab_title"
  readonly description: string = "command_gesture_restore_tab_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.sessions.getRecentlyClosed({ maxResults: 1 }, (sessions) => {
      if (sessions.length && sessions[0].tab) {
        chrome.sessions.restore(sessions[0].tab.sessionId).then()
      }
    })
  }
}
