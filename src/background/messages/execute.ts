import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getLocalConfig } from "~background"
import { Command } from "~commands/command"
import type { CommandInterface } from "~commands/command-interface"
import type { LocalConfigInterface } from "~config/config-interface"
import type { Point } from "~core/trajectory"
import type { Group } from "~enum/command"
import { matchGesture } from "~utils/common"

export type executeReq = {
  trajectory: Point[]
  group: Group
}

export type executeRes = {
  command: CommandInterface
}

const handler: PlasmoMessaging.MessageHandler<executeReq, executeRes> = async (
  req,
  res
) => {
  const config: LocalConfigInterface = await getLocalConfig()
  const uniqueKey = matchGesture(req.body.trajectory, config[req.body.group])
  if (!uniqueKey) {
    return
  }
  const gesture = config[req.body.group].find((g) => g.uniqueKey === uniqueKey)
  const command = new Command(req.body.group).getCommands()[
    gesture.command.uniqueKey
  ]
  Object.entries(gesture.command.config).forEach(([key, value]) => {
    command.config[key].value = value
  })
  if (command?.window) {
    res.send({
      command: command
    })
  } else {
    command.execute()
  }
}

export default handler
