import type { PlasmoMessaging } from "@plasmohq/messaging"

export type executeReq = {}

export type executeRes = {
  os: string
}

const handler: PlasmoMessaging.MessageHandler<executeReq, executeRes> = async (
  req,
  res
) => {
  chrome.runtime.getPlatformInfo((info) => {
    res.send({
      os: info.os
    })
  })
}

export default handler
