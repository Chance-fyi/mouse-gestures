import { useRef, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/dist/hook"

import { LocalConfig, SyncConfig } from "~config/config"
import type { ConfigGesture } from "~config/config-interface"
import { Event } from "~core/event"
import { Trajectory } from "~core/trajectory"
import Svg from "~options/components/svg"
import { i18n } from "~utils/common"

export interface GestureDrawingProps {
  modalId: string
  drawerId: string
  title: string
  configGesture: ConfigGesture
  setConfigGesture: (configGesture: ConfigGesture) => void
}

export default (props: GestureDrawingProps) => {
  const canvasRef = useRef(null)
  const [svg, setSvg] = useState(null)
  const [syncConfig] = useStorage(SyncConfig.key, SyncConfig.default)
  const [localConfig, setLocalConfig] = useStorage(
    {
      key: LocalConfig.key,
      instance: new Storage({
        area: "local"
      })
    },
    LocalConfig.default
  )

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    const ctx = canvas.getContext("2d")
    const event = new Event({
      canvas: ctx,
      upCallback: upCallback,
      config: syncConfig
    })
    event.mouseDown(e)
  }

  const upCallback = (t: Event) => {
    t.canvas.clearRect(0, 0, t.canvas.canvas.width, t.canvas.canvas.height)
    const trajectory = Trajectory.simplify(10, 30)
    if (trajectory.length < 2) return
    props.setConfigGesture({
      ...props.configGesture,
      trajectory: trajectory
    })
    setSvg(
      <Svg
        points={trajectory}
        width={t.canvas.canvas.width}
        height={t.canvas.canvas.height}
      />
    )
  }

  const closeDialog = () => {
    const checkbox = document.getElementById(props.modalId) as HTMLInputElement
    checkbox.checked = false
  }

  return (
    <>
      <input
        type="checkbox"
        id={props.modalId}
        className="modal-toggle"
        onChange={(e) => {
          if (!e.target.checked) {
            props.setConfigGesture(null)
            setSvg(null)
          }
        }}
      />
      <div className="modal" role="dialog">
        <div className="modal-box w-3/5 max-w-5xl">
          <div className="flex justify-between sticky top-0">
            <h3 className="font-bold text-lg">{i18n(props.title)}</h3>
            <form method="dialog">
              <label
                htmlFor={props.modalId}
                className="btn btn-sm btn-circle btn-ghost focus:outline-none hover:bg-inherit hover:text-red-500">
                ✕
              </label>
            </form>
          </div>
          <div className="grid grid-flow-row-dense grid-cols-5 gap-4 mt-2">
            <div
              className="col-span-3 aspect-w-1 aspect-h-1 border-2 border-dashed hover:cursor-crosshair"
              onMouseDown={startDrawing}>
              <canvas ref={canvasRef} className="w-full h-full" />
              {svg}
            </div>
            <div className="col-span-2 flex flex-col">
              <div className="space-y-5 flex-grow">
                <div className="space-y-2">
                  <h4 className="w-full text-base">{i18n("command")}</h4>
                  <p className="text-sm text-gray-400 hover:text-inherit">
                    {i18n("command_description")}
                  </p>
                  <div>
                    <label
                      htmlFor={props.drawerId}
                      className="block input input-bordered input-sm w-full max-w-xs cursor-pointer">
                      <div>{i18n(props.configGesture?.command?.name)}</div>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="w-full text-base">
                    {i18n("textLabel")}（{i18n("optional")}）
                  </h4>
                  <p className="text-sm text-gray-400 hover:text-inherit">
                    {i18n("textLabel_description")}
                  </p>
                  <input
                    type="text"
                    className="input input-bordered input-sm w-full max-w-xs focus:outline-none"
                    placeholder={
                      props.configGesture?.name ||
                      i18n(props.configGesture?.command?.name)
                    }
                    onChange={(e) => {
                      props.configGesture.name = e.target.value
                      props.setConfigGesture({ ...props.configGesture })
                    }}
                  />
                </div>
              </div>
              <div className="justify-end">
                <button
                  className="btn btn-sm w-full btn-neutral"
                  onClick={() => {
                    if (
                      props.configGesture &&
                      props.configGesture?.trajectory &&
                      props.configGesture?.command
                    ) {
                      if (!props.configGesture?.uniqueKey) {
                        props.configGesture.uniqueKey = crypto.randomUUID()
                      }

                      let found = false
                      localConfig.gesture.forEach((v, i) => {
                        if (v.uniqueKey === props.configGesture.uniqueKey) {
                          found = true
                          localConfig.gesture[i] = props.configGesture
                        }
                      })
                      if (!found) {
                        localConfig.gesture.push(props.configGesture)
                      }

                      setLocalConfig(localConfig).then()
                      closeDialog()
                    }
                  }}>
                  {i18n("save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
