import type { CommandInterface } from "~commands/command-interface"
import { Group } from "~enum/command"

export class Command {
  private readonly group: Group
  private commands: { [key: string]: CommandInterface } = {}

  constructor(group: Group) {
    this.group = group
  }

  getCommands() {
    if (Object.keys(this.commands).length > 0) {
      return this.commands
    }

    let commands: CommandInterface[] = []
    switch (this.group) {
      case Group.Gesture:
        commands = require("~commands/gesture/index").default
        break
    }
    commands.forEach((c) => {
      if (!c.uniqueKey) {
        throw new Error("Command must have a uniqueKey")
      }
      if (this.commands[c.uniqueKey]) {
        throw new Error("Command already exists")
      }
      this.commands[c.uniqueKey] = c
    })

    return this.commands
  }
}
