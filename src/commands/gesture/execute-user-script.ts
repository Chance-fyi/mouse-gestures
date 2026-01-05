import type { CommandInterface } from "~commands/command-interface"
import { ConfigType } from "~enum/command"

export class ExecuteUserScript implements CommandInterface {
  readonly uniqueKey: string = "gesture-execute-user-script"
  readonly title: string = "command_gesture_execute_user_script_title"
  readonly description: string =
    "command_gesture_execute_user_script_description"
  config: { [key: string]: any } = {
    script: {
      title: "command_gesture_execute_user_script_config_script_title",
      description:
        "command_gesture_execute_user_script_config_script_description",
      type: ConfigType.Textarea,
      default: ""
    }
  }

  execute(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          world: "MAIN",
          func: (code) => {
            new Function(code)()
          },
          args: [this.config.script.value]
        })
        .then()
    })
  }
}
