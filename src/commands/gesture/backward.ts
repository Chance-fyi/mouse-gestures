import type { CommandInterface } from "~commands/command-interface"

export class Backward implements CommandInterface {
  readonly uniqueKey: string = "gesture-backward"
  readonly title: string = "command_gesture_backward_title"
  readonly description: string = "command_gesture_backward_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.goBack().then()
  }
}
