import type { CommandInterface } from "~commands/command-interface"

export class Fullscreen implements CommandInterface {
  readonly uniqueKey: string = "gesture-fullscreen"
  readonly title: string = "command_gesture_fullscreen_title"
  readonly description: string = "command_gesture_fullscreen_description"
  config: { [key: string]: any } = {}

  window: boolean = true

  execute(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then()
    } else {
      document.exitFullscreen().then()
    }
  }
}
