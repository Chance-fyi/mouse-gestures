import { useEffect, useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import { useDebouncedCallback } from "use-debounce"

import { useStorage } from "@plasmohq/storage/dist/hook"

import { GoogleDrive } from "~cloud/google-drive"
import { Backup, Reset, Restore, SyncConfig } from "~config/config"
import {
  GestureStrictness,
  LooseOptions,
  NormalOptions,
  StrictOptions
} from "~enum/config"
import { Menu } from "~enum/menu"
import { useConfirm } from "~options/components/confirm"
import IconDelete from "~options/components/icon-delete"
import IconDownload from "~options/components/icon-download"
import IconRestore from "~options/components/icon-restore"
import { checkMissingPermissions, i18n } from "~utils/common"

export default () => {
  const [syncConfig, setSyncConfig, { isLoading }] = useStorage(
    SyncConfig.key,
    SyncConfig.default
  )
  const { ConfirmUI, showConfirm } = useConfirm()
  const [tooltipStyle, setTooltipStyle] = useState("")
  const [tooltipStyleError, setTooltipStyleError] = useState(false)
  const [backupDropdownOpen, setBackupDropdownOpen] = useState(false)
  const [restoreDropdownOpen, setRestoreDropdownOpen] = useState(false)
  const [fileList, setFileList] = useState([])
  const [localLineWidth, setLocalLineWidth] = useState(0)
  const [localStrictness, setLocalStrictness] = useState("")
  const [localAngleThreshold, setLocalAngleThreshold] = useState(0)
  const [localLengthTolerance, setLocalLengthTolerance] = useState(0)
  const [localMinSimilarity, setLocalMinSimilarity] = useState(0)

  const debouncedSetSyncConfig = useDebouncedCallback(
    (config) => setSyncConfig(config),
    300
  )
  useEffect(() => {
    if (isLoading) return
    debouncedSetSyncConfig({
      ...syncConfig,
      lineWidth: localLineWidth,
      gestureMatchConfig: {
        ...syncConfig?.gestureMatchConfig,
        strictness: localStrictness,
        customOptions: {
          ...syncConfig?.gestureMatchConfig?.customOptions,
          angleThreshold: localAngleThreshold,
          lengthTolerance: localLengthTolerance,
          minSimilarity: localMinSimilarity
        }
      }
    })
  }, [
    localLineWidth,
    localStrictness,
    localAngleThreshold,
    localLengthTolerance,
    localMinSimilarity
  ])
  const setLocalValue = () => {
    setLocalLineWidth(syncConfig?.lineWidth ?? SyncConfig.default.lineWidth)
    setLocalStrictness(
      syncConfig?.gestureMatchConfig?.strictness ??
        SyncConfig.default.gestureMatchConfig.strictness
    )
    setLocalAngleThreshold(
      syncConfig?.gestureMatchConfig?.customOptions?.angleThreshold ??
        SyncConfig.default.gestureMatchConfig.customOptions.angleThreshold
    )
    setLocalLengthTolerance(
      syncConfig?.gestureMatchConfig?.customOptions?.lengthTolerance ??
        SyncConfig.default.gestureMatchConfig.customOptions.lengthTolerance
    )
    setLocalMinSimilarity(
      syncConfig?.gestureMatchConfig?.customOptions?.minSimilarity ??
        SyncConfig.default.gestureMatchConfig.customOptions.minSimilarity
    )
  }
  useEffect(() => {
    if (isLoading) return
    setLocalValue()
  }, [syncConfig])

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
              type="range"
              min="1"
              max="20"
              value={localLineWidth}
              onChange={(e) => setLocalLineWidth(Number(e.target.value))}
              className="range range-xs"
            />
            <span className="text-xs opacity-60 w-8 text-right">
              {localLineWidth}px
            </span>
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
          <div className="w-1/2 flex items-center">
            {i18n("show_trajectory")}
          </div>
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
                } catch {
                  setTooltipStyleError(true)
                }
                setTooltipStyle(e.target.value)
              }}></textarea>
          </div>
        </div>
        <div className="w-full flex flex-row">
          <div className="w-1/2 flex items-center">{i18n("strictness")}</div>
          <div className="w-1/2 flex justify-end">
            <select
              value={localStrictness}
              onChange={(e) => {
                switch (e.target.value) {
                  case GestureStrictness.Strict:
                    setLocalAngleThreshold(StrictOptions.angleThreshold)
                    setLocalLengthTolerance(StrictOptions.lengthTolerance)
                    setLocalMinSimilarity(StrictOptions.minSimilarity)
                    break
                  case GestureStrictness.Normal:
                    setLocalAngleThreshold(NormalOptions.angleThreshold)
                    setLocalLengthTolerance(NormalOptions.lengthTolerance)
                    setLocalMinSimilarity(NormalOptions.minSimilarity)
                    break
                  case GestureStrictness.Loose:
                    setLocalAngleThreshold(LooseOptions.angleThreshold)
                    setLocalLengthTolerance(LooseOptions.lengthTolerance)
                    setLocalMinSimilarity(LooseOptions.minSimilarity)
                    break
                }
                setLocalStrictness(e.target.value)
              }}
              className="select select-bordered select-sm w-1/2 max-w-xs focus:outline-none text-center">
              {Object.values(GestureStrictness).map((v) => (
                <option key={v} value={v}>
                  {i18n(`strictness_${v}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {localStrictness === GestureStrictness.Custom && (
          <>
            <div className="w-full flex flex-row">
              <div className="w-1/2 flex items-center">
                {i18n("strictness_angle_threshold")}
              </div>
              <div className="w-1/2 flex justify-end">
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={localAngleThreshold / 2}
                  step="1"
                  onChange={(e) =>
                    setLocalAngleThreshold(Number(e.target.value) * 2)
                  }
                  className="range range-xs"
                />
                <span className="text-xs opacity-60 w-8 text-right">
                  ±{localAngleThreshold / 2}°
                </span>
              </div>
            </div>
            <div className="w-full flex flex-row">
              <div className="w-1/2 flex items-center">
                {i18n("strictness_length_tolerance")}
              </div>
              <div className="w-1/2 flex justify-end">
                <input
                  type="range"
                  min="0.1"
                  max="0.7"
                  value={localLengthTolerance}
                  step="0.05"
                  onChange={(e) =>
                    setLocalLengthTolerance(Number(e.target.value))
                  }
                  className="range range-xs"
                />
                <span className="text-xs opacity-60 w-8 text-right">
                  {(localLengthTolerance * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="w-full flex flex-row">
              <div className="w-1/2 flex items-center">
                {i18n("strictness_min_similarity")}
              </div>
              <div className="w-1/2 flex justify-end">
                <input
                  type="range"
                  min="0.5"
                  max="0.9"
                  value={localMinSimilarity}
                  step="0.05"
                  onChange={(e) =>
                    setLocalMinSimilarity(Number(e.target.value))
                  }
                  className="range range-xs"
                />
                <span className="text-xs opacity-60 w-8 text-right">
                  {localMinSimilarity.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
        <div className="divider mt-0"></div>
        <div className="w-full flex flex-row space-x-5 justify-end">
          <div
            className={`dropdown ${backupDropdownOpen ? "dropdown-open" : ""}`}
            onMouseEnter={() => setBackupDropdownOpen(true)}
            onMouseLeave={() => setBackupDropdownOpen(false)}>
            <div role="button" className="btn min-w-20">
              {i18n("backup")}
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <a
                  onClick={async () => {
                    const res = await Backup()
                    const blob = new Blob([res.content], {
                      type: "application/json"
                    })
                    const url = URL.createObjectURL(blob)

                    const a = document.createElement("a")
                    a.href = url
                    a.download = res.name
                    a.click()
                    URL.revokeObjectURL(url)
                    setBackupDropdownOpen(false)
                  }}>
                  {i18n("local")}
                </a>
              </li>
              <li>
                <a
                  onClick={async () => {
                    setBackupDropdownOpen(false)
                    const res = await Backup()
                    await toast.promise(
                      new GoogleDrive().uploadFile(res.name, res.content),
                      {
                        loading: "Loading...",
                        success: i18n("backup_successful"),
                        error: (e) => e.message
                      }
                    )
                  }}>
                  {new GoogleDrive().name}
                </a>
              </li>
            </ul>
          </div>
          <div
            className={`dropdown ${restoreDropdownOpen ? "dropdown-open" : ""}`}
            onMouseEnter={() => setRestoreDropdownOpen(true)}
            onMouseLeave={() => setRestoreDropdownOpen(false)}>
            <div role="button" className="btn min-w-20">
              {i18n("restore")}
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <a
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
                          onConfirm: () =>
                            Restore(reader.result as string).then(() =>
                              checkMissingPermissions(showConfirm)
                            )
                        })
                      }
                      reader.readAsText(file)
                    }
                    input.click()
                  }}>
                  {i18n("local")}
                </a>
              </li>
              <li>
                <a
                  onClick={async () => {
                    setRestoreDropdownOpen(false)
                    const list = await toast.promise(
                      new GoogleDrive().listFiles(),
                      {
                        loading: "Loading...",
                        success: "",
                        error: (e) => e.message
                      }
                    )
                    setFileList(list)
                    ;(
                      document.getElementById("file_list") as HTMLDialogElement
                    ).showModal()
                  }}>
                  {new GoogleDrive().name}
                </a>
              </li>
            </ul>
          </div>
          <button
            className="btn min-w-20"
            onClick={() =>
              showConfirm({
                title: i18n("reset"),
                content: i18n("confirm_reset"),
                onConfirm: () =>
                  Reset().then(() => checkMissingPermissions(showConfirm))
              })
            }>
            {i18n("reset")}
          </button>
        </div>
      </div>
      {ConfirmUI}
      <Toaster />
      <dialog id="file_list" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm absolute right-2 top-2 btn-circle btn-ghost focus:outline-none hover:bg-inherit hover:text-red-500">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-2 mt-2 items-center h-56 overflow-y-auto">
            {fileList.map((v) => (
              <div
                className="flex justify-between items-center w-full pl-4 pr-4 hover:bg-base-200"
                key={v.id}>
                <div>{v.name}</div>
                <div className="flex p-1 gap-3">
                  <div
                    className="cursor-pointer"
                    onClick={async () => {
                      const blob = await new GoogleDrive().downloadFile(v.id)
                      const url = URL.createObjectURL(blob)

                      const a = document.createElement("a")
                      a.href = url
                      a.download = v.name
                      a.click()
                      URL.revokeObjectURL(url)
                    }}>
                    <IconDownload width={15} height={15} color="#2B3440" />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={async () => {
                      showConfirm({
                        title: i18n("delete"),
                        content: i18n("confirm_delete"),
                        onConfirm: async () => {
                          await toast.promise(
                            new GoogleDrive().deleteFile(v.id),
                            {
                              loading: "Loading...",
                              success: i18n("deleted"),
                              error: (e) => e.message
                            }
                          )
                          setFileList((prev) =>
                            prev.filter((f) => f.id !== v.id)
                          )
                        }
                      })
                    }}>
                    <IconDelete width={15} height={15} color="#2B3440" />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={async () => {
                      showConfirm({
                        title: i18n("restore"),
                        content: i18n("confirm_restore"),
                        onConfirm: async () => {
                          const blob = await toast.promise(
                            new GoogleDrive().downloadFile(v.id),
                            {
                              loading: "Loading...",
                              success: "",
                              error: (e) => e.message
                            }
                          )
                          const text = await blob.text()
                          await Restore(text)
                          await checkMissingPermissions(showConfirm)
                          toast.success(i18n("restored"))
                        }
                      })
                    }}>
                    <IconRestore width={15} height={15} color="#2B3440" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>
    </>
  )
}
