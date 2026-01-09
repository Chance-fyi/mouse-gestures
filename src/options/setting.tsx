import { useState } from "react"
import { toast, Toaster } from "react-hot-toast"

import { useStorage } from "@plasmohq/storage/dist/hook"

import { GoogleDrive } from "~cloud/google-drive"
import { Backup, Reset, Restore, SyncConfig } from "~config/config"
import { Menu } from "~enum/menu"
import { useConfirm } from "~options/components/confirm"
import IconDelete from "~options/components/icon-delete"
import IconDownload from "~options/components/icon-download"
import IconRestore from "~options/components/icon-restore"
import { i18n } from "~utils/common"

export default () => {
  const [syncConfig, setSyncConfig] = useStorage(
    SyncConfig.key,
    SyncConfig.default
  )
  const { ConfirmUI, showConfirm } = useConfirm()
  const [tooltipStyle, setTooltipStyle] = useState("")
  const [tooltipStyleError, setTooltipStyleError] = useState(false)
  const [backupDropdownOpen, setBackupDropdownOpen] = useState(false)
  const [restoreDropdownOpen, setRestoreDropdownOpen] = useState(false)
  const [fileList, setFileList] = useState([])

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
                          onConfirm: () => Restore(reader.result as string)
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
                onConfirm: Reset
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
