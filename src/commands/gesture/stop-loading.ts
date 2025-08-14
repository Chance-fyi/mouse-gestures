import type { CommandInterface } from "~commands/command-interface"

export class StopLoading implements CommandInterface {
  readonly uniqueKey: string = "gesture-stop-loading"
  readonly title: string = "command_gesture_stop_loading_title"
  readonly description: string = "command_gesture_stop_loading_description"
  config: { [key: string]: any } = {}
  window: boolean = true

  execute(): void {
    window.stop()
  }
}
