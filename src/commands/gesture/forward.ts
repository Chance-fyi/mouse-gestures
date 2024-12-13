import type { CommandInterface } from "~commands/command-interface"

export class Forward implements CommandInterface {
  readonly uniqueKey: string = "gesture-forward"
  readonly title: string = "command_gesture_forward_title"
  readonly description: string = "command_gesture_forward_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.goForward().then()
  }
}
