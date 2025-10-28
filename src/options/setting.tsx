import { useState } from "react"

import { useStorage } from "@plasmohq/storage/dist/hook"

import { Backup, Reset, Restore, SyncConfig } from "~config/config"
import { Menu } from "~enum/menu"
import { useConfirm } from "~options/components/confirm"
import { i18n } from "~utils/common"

export default () => {
  const [syncConfig, setSyncConfig] = useStorage(
    SyncConfig.key,
    SyncConfig.default
  )
  const { ConfirmUI, showConfirm } = useConfirm()
  const [tooltipStyle, setTooltipStyle] = useState("")
  const [tooltipStyleError, setTooltipStyleError] = useState(false)

  return (
    <>
      <div className="navbar bg-base-100">
        <span className="text-2xl">{i18n(Menu.Setting)}</span>
      </div>
      <div className="divider mt-0"></div>
      <div className="w-1/3 flex flex-col space-y-4 text-base pl-2">
        <div className="w-full flex flex-row">
          <div className="w-1/2 flex items-center">{i18n("line_color")}</div>
          <div className="w-1/2 flex justify-end">
            <input
              type="color"
              className="w-7 h-8"
              value={syncConfig.strokeStyle}
              onChange={(e) =>
                setSyncConfig({ ...syncConfig, strokeStyle: e.target.value })
              }
            />
          </div>
        </div>
        <div className="w-full flex flex-row">
          <div className="w-1/2 flex items-center">{i18n("line_width")}</div>
          <div className="w-1/2 flex justify-end">
            <input
              type="text"
              value={syncConfig.lineWidth}
              onChange={(e) =>
                setSyncConfig({
                  ...syncConfig,
                  lineWidth: Number(e.target.value)
                })
              }
              className="input input-bordered input-sm w-20 max-w-xs focus:outline-none"
            />
          </div>
        </div>
        <div className="w-full flex flex-row">
          <div className="w-1/2 flex items-center">{i18n("show_tooltip")}</div>
          <div className="w-1/2 flex justify-end">
            <input
              type="checkbox"
              checked={syncConfig.showTooltip}
              onChange={(e) =>
                setSyncConfig({
                  ...syncConfig,
                  showTooltip: e.target.checked
                })
              }
              className="toggle"
            />
          </div>
        </div>
        <div className="w-full flex flex-row">
          <div className="w-1/2 flex items-center">{i18n("show_trajectory")}</div>
          <div className="w-1/2 flex justify-end">
            <input
              type="checkbox"
              checked={syncConfig.showTrajectory}
              onChange={(e) =>
                setSyncConfig({
                  ...syncConfig,
                  showTrajectory: e.target.checked
                })
              }
              className="toggle"
            />
          </div>
        </div>
        <div className="w-full flex flex-row">
          <div className="w-1/2 flex items-center">{i18n("tooltip_style")}</div>
          <div className="w-1/2 flex justify-end">
            <textarea
              className={`textarea textarea-bordered ${tooltipStyleError ? "textarea-error" : ""} focus:outline-none w-full border`}
              rows={5}
              spellCheck={false}
              value={
                tooltipStyle
                  ? tooltipStyle
                  : JSON.stringify(syncConfig.tooltipStyle, null, 2)
              }
              onChange={(e) => {
                try {
                  let json = JSON.parse(e.target.value)
                  setTooltipStyleError(false)
                  setSyncConfig({
                    ...syncConfig,
                    tooltipStyle: json
                  }).then()
                  console.log(syncConfig)
                } catch {
                  setTooltipStyleError(true)
                }
                setTooltipStyle(e.target.value)
              }}></textarea>
          </div>
        </div>
        <div className="divider mt-0"></div>
        <div className="w-full flex flex-row space-x-5 justify-end">
          <button className="btn min-w-20" onClick={Backup}>
            {i18n("backup")}
          </button>
          <button
            className="btn min-w-20"
            onClick={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.accept = ".json"
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files[0]
                const reader = new FileReader()
                reader.onload = () => {
                  showConfirm({
                    title: i18n("restore"),
                    content: i18n("confirm_restore"),
                    onConfirm: () => Restore(reader.result as string)
                  })
                }
                reader.readAsText(file)
              }
              input.click()
            }}>
            {i18n("restore")}
          </button>
          <button
            className="btn min-w-20"
            onClick={() =>
              showConfirm({
                title: i18n("reset"),
                content: i18n("confirm_reset"),
                onConfirm: Reset
              })
            }>
            {i18n("reset")}
          </button>
        </div>
      </div>
      {ConfirmUI}
    </>
  )
}
