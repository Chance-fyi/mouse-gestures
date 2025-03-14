import { useStorage } from "@plasmohq/storage/dist/hook"

import { SyncConfig } from "~config/config"
import { Menu } from "~enum/menu"
import { i18n } from "~utils/common"

export default () => {
  const [syncConfig, setSyncConfig] = useStorage(
    SyncConfig.key,
    SyncConfig.default
  )
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
              defaultChecked={syncConfig.showTooltip}
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
      </div>
    </>
  )
}
