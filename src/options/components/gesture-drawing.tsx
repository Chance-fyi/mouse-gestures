import { useRef, useState } from "react"

import { Event } from "~core/event"
import { Trajectory } from "~core/trajectory"
import Svg from "~options/components/svg"
import { i18n } from "~utils/common"

export interface GestureDrawingProps {
  id: string
  title: string
}

export default (props: GestureDrawingProps) => {
  const canvasRef = useRef(null)
  const [svg, setSvg] = useState(null)

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    const ctx = canvas.getContext("2d")
    const event = new Event({
      canvas: ctx,
      upCallback: upCallback
    })
    event.mouseDown(e)
  }

  const upCallback = (t: Event) => {
    t.canvas.clearRect(0, 0, t.canvas.canvas.width, t.canvas.canvas.height)
    const trajectory = Trajectory.simplify(10, 10)
    if (trajectory.length < 2) return
    setSvg(
      <Svg
        points={trajectory}
        width={t.canvas.canvas.width}
        height={t.canvas.canvas.height}
      />
    )
  }

  return (
    <dialog id={props.id} className="modal">
      <div className="modal-box w-3/5 max-w-5xl">
        <div className="flex justify-between sticky top-0">
          <h3 className="font-bold text-lg">{i18n(props.title)}</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost focus:outline-none hover:bg-inherit hover:text-red-500">
              ✕
            </button>
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
                <input
                  type="text"
                  readOnly
                  className="input input-bordered input-sm w-full max-w-xs focus:outline-none cursor-pointer"
                />
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
                />
              </div>
            </div>
            <div className="justify-end">
              <button className="btn btn-sm w-full btn-neutral">
                {i18n("save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}
