import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { Command } from "~commands/command"
import { Event } from "~core/event"
import { Trajectory } from "~core/trajectory"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start"
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default () => {
  const canvasRef = useRef(null)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipText, setTooltipText] = useState("")

  let os: string
  useEffect(() => {
    document.addEventListener("mousedown", startDrawing, { capture: true })
    document.addEventListener("dragstart", startDrawing, { capture: true })
    sendToBackground({
      name: "os",
      body: {}
    }).then((res) => {
      os = res.os
    })
  }, [])

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    const ctx = canvas.getContext("2d")
    const event = new Event({
      canvas: ctx,
      upCallback: upCallback,
      setting: false,
      os: os,
      setTooltipVisible,
      setTooltipText
    })
    event.mouseDown(e)
  }

  const upCallback = (t: Event) => {
    t.canvas.clearRect(0, 0, t.canvas.canvas.width, t.canvas.canvas.height)
    const trajectory = Trajectory.simplifyTrajectory(Trajectory.trajectory)
    if (trajectory.length < 2) return

    sendToBackground({
      name: "execute",
      body: {
        trajectory: trajectory,
        group: t.group,
        dragData: t.dragData
      }
    })
      .then((res) => {
        const command = new Command(t.group).getCommands()[
          res.command.uniqueKey
        ]
        command.config = res.command.config
        command.data = t.dragData
        command.execute()
      })
      .finally(() => {
        setTooltipVisible(false)
        setTooltipText("")
      })
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-screen h-screen fixed top-0 left-0 z-[99999] pointer-events-none"
      />
      {tooltipVisible && (
        <div className="z-[999999] w-screen h-screen fixed top-0 left-0 flex items-center justify-center">
          <div className="bg-gray-800 bg-opacity-75 text-white text-[30px] p-[40px] rounded-[30px] flex items-center justify-center min-w-[15%] min-h-[15%] max-w-[50%] max-h-[50%]">
            {tooltipText}
          </div>
        </div>
      )}
    </>
  )
}
