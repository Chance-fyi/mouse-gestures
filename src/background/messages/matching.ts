import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getLocalConfig } from "~background"
import type { LocalConfigInterface } from "~config/config-interface"
import type { Point } from "~core/trajectory"
import type { Group } from "~enum/command"
import { i18n, matchGesture } from "~utils/common"

export type matchingReq = {
  trajectory: Point[]
  group: Group
}

export type matchingRes = {
  message: string
}

const handler: PlasmoMessaging.MessageHandler<
  matchingReq,
  matchingRes
> = async (req, res) => {
  const config: LocalConfigInterface = await getLocalConfig()
  const uniqueKey = matchGesture(req.body.trajectory, config[req.body.group])
  if (!uniqueKey) {
    res.send({
      message: ""
    })
  } else {
    const gesture = config[req.body.group].find(
      (g) => g.uniqueKey === uniqueKey
    )
    res.send({
      message: gesture.name ? gesture.name : i18n(gesture.command.name)
    })
  }
}

export default handler
