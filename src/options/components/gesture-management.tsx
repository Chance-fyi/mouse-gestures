import { useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/dist/hook"

import { LocalConfig, SyncConfig } from "~config/config"
import type { ConfigGesture } from "~config/config-interface"
import type { Point } from "~core/trajectory"
import type { Group } from "~enum/command"
import CommandDrawer from "~options/components/command-drawer"
import GestureDrawing from "~options/components/gesture-drawing"
import Svg from "~options/components/svg"
import { i18n } from "~utils/common"

export interface GestureManagementProps {
  title: string
  commandGroup: Group
  createBtnText: string
  createTitle: string
  editTitle: string
}

const modalId: string = "drawing-modal"
const drawerId: string = "command-drawer"

export default (props: GestureManagementProps) => {
  const [title, setTitle] = useState(props.createTitle)
  const [configGesture, setConfigGesture] = useState<ConfigGesture | null>(null)
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

  const [editTrajectory, setEditTrajectory] = useState<Point[]>([])
  const [, forceReRender] = useState("")

  return (
    <div>
      <div className="navbar bg-base-100">
        <span className="text-2xl">{i18n(props.title)}</span>
      </div>
      <div className="divider mt-0"></div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(170px,_1fr))]">
        <label
          htmlFor={modalId}
          className="aspect-[3/4] border-2 border-dashed hover:border-success text-base-300 hover:text-success cursor-pointer"
          onClick={() => setTitle(props.createTitle)}>
          <div className="flex items-center justify-center h-full text-xl select-none">
            {i18n(props.createTitle)}
          </div>
        </label>
        {localConfig?.gesture?.map((gesture: ConfigGesture) => {
          return (
            <div
              key={gesture.uniqueKey}
              className="aspect-[3/4] border flex flex-col h-full cursor-pointer indicator group"
              onClick={() => {
                setTitle(props.editTitle)
                setConfigGesture(gesture)
                setEditTrajectory(gesture.trajectory)
                const checkbox = document.getElementById(
                  modalId
                ) as HTMLInputElement
                checkbox.checked = true
              }}>
              <div
                className="indicator-item w-7 h-7 flex items-center justify-center text-base text-white font-bold bg-error rounded-full error opacity-0 scale-50 transform transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 delay-300"
                onClick={(e) => {
                  e.stopPropagation()
                  localConfig.gesture = localConfig.gesture.filter(
                    (g) => g.uniqueKey !== gesture.uniqueKey
                  )
                  setLocalConfig(localConfig).then()
                  forceReRender(gesture.uniqueKey)
                }}>
                ✕
              </div>
              <div className="aspect-[1/1] border-b flex items-center justify-center">
                <Svg
                  points={gesture.trajectory}
                  width={170}
                  height={170}
                  animate={true}
                  color={syncConfig.strokeStyle}
                />
              </div>
              <div className="w-full flex-1 flex items-center justify-center text-base">
                {gesture?.name || i18n(gesture.command.name)}
              </div>
            </div>
          )
        })}
      </div>
      <GestureDrawing
        modalId={modalId}
        drawerId={drawerId}
        title={title}
        configGesture={configGesture}
        setConfigGesture={setConfigGesture}
        editTrajectory={editTrajectory}
        setEditTrajectory={setEditTrajectory}
      />
      <CommandDrawer
        drawerId={drawerId}
        commandGroup={props.commandGroup}
        configGesture={configGesture}
        setConfigGesture={setConfigGesture}
      />
    </div>
  )
}
