import { useState } from "react"

import { Command } from "~commands/command"
import type { CommandInterface } from "~commands/command-interface"
import type { ConfigGesture } from "~config/config-interface"
import { ConfigType, type Group } from "~enum/command"
import IconBack from "~options/components/icon-back"
import IconClose from "~options/components/icon-close"
import IconPermissions from "~options/components/icon-permissions"
import IconSearch from "~options/components/icon-search"
import IconSetting from "~options/components/icon-setting"
import { i18n, requestPermissions } from "~utils/common"

interface CommandDrawerProps {
  drawerId: string
  commandGroup: Group
  configGesture: ConfigGesture
  setConfigGesture: (configGesture: ConfigGesture) => void
}

enum Tabs {
  Tab1 = "tab1",
  Tab2 = "tab2"
}

export default (props: CommandDrawerProps) => {
  const command = new Command(props.commandGroup)
  const commands = command.getCommands()
  const [activeTab, setActiveTab] = useState(Tabs.Tab1)
  const [search, setSearch] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [tab2Command, setTab2Command] = useState<CommandInterface | null>(null)
  const _ = require("lodash")

  const closeDrawer = () => {
    const checkbox = document.getElementById(props.drawerId) as HTMLInputElement
    checkbox.checked = false
  }

  return (
    <div className="drawer drawer-end">
      <input
        id={props.drawerId}
        type="checkbox"
        className="drawer-toggle"
        onChange={(e) => e.target.checked && setActiveTab(Tabs.Tab1)}
      />
      <div className="drawer-content"></div>
      <div className="drawer-side z-[1000]">
        <label
          htmlFor={props.drawerId}
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <div className="min-h-full w-80 bg-white">
          {Tabs.Tab1 === activeTab && (
            <div className="flex flex-col h-screen">
              <div className="sticky top-0 bg-white shadow-md z-10 w-full h-16 border-b border-gray-300 flex flex-row items-center">
                <div className="w-1/6 h-full flex justify-center items-center">
                  <label className="swap swap-rotate">
                    <input type="checkbox" />
                    <div className={`swap-on ${search ? "swap-active" : ""}`}>
                      <div
                        onClick={() => {
                          setSearch(!search)
                          setSearchText("")
                        }}>
                        <IconClose width={25} height={25} color={"#2b3440"} />
                      </div>
                    </div>
                    <div className={`swap-off ${search ? "" : "swap-active"}`}>
                      <div className="mt-1" onClick={() => setSearch(!search)}>
                        <IconSearch width={20} height={20} color={"#2b3440"} />
                      </div>
                    </div>
                  </label>
                </div>
                <div className="w-5/6">
                  {search && (
                    <input
                      type="text"
                      placeholder={i18n("search")}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="input input-bordered w-5/6 input-sm focus:outline-none"
                    />
                  )}
                  {!search && (
                    <p className="text-xl w-4/6 text-center">
                      {i18n("command")}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-[95%] flex-1 min-h-0 justify-center overflow-y-auto flex scrollbar-thin">
                <ul className="w-full pt-4">
                  {Object.entries(commands)
                    .filter((c) => {
                      return (
                        !search ||
                        searchText === "" ||
                        i18n(c[1].title)
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      )
                    })
                    .map(([k, c]) => {
                      return (
                        <li
                          key={k}
                          className="hover:bg-neutral-100 pl-4 pt-2 pb-2">
                          <div
                            tabIndex={0}
                            onClick={() => {
                              requestPermissions(c.permissions).then(
                                (granted) => {
                                  if (!granted) {
                                    return
                                  }
                                  if (Object.keys(c.config).length === 0) {
                                    props.setConfigGesture({
                                      ...props.configGesture,
                                      command: {
                                        uniqueKey: c.uniqueKey,
                                        name: c.title,
                                        config: _.mapValues(
                                          c.config,
                                          (value: { [x: string]: any }) =>
                                            value["value"]
                                        )
                                      }
                                    })
                                    closeDrawer()
                                    return
                                  }

                                  const cc = _.cloneDeep(c)
                                  if (
                                    props.configGesture?.command?.uniqueKey ===
                                    cc.uniqueKey
                                  ) {
                                    Object.keys(cc.config).forEach((k) => {
                                      cc.config[k]["value"] =
                                        props.configGesture.command.config[k]
                                    })
                                  }
                                  setTab2Command(cc)
                                  setActiveTab(Tabs.Tab2)
                                }
                              )
                            }}
                            className="collapse h-full collapse-close hover:collapse-open group pl-5 delay-300">
                            <div className="collapse-title p-0 min-h-0 text-base">
                              <div
                                className={`flex flex-row w-full items-center justify-between pr-2 relative ${c.uniqueKey === props.configGesture?.command?.uniqueKey ? "before:absolute before:-left-5 before:top-1/2 before:-translate-y-1/2 before:bg-[#2b3440] before:w-1.5 before:h-1.5 before:rounded-full" : ""}`}>
                                <div>{i18n(c.title)}</div>
                                <div className="flex flex-row gap-2">
                                  {(c.permissions?.length ?? 0) !== 0 && (
                                    <IconPermissions
                                      width={17}
                                      height={17}
                                      color={"#2b3440"}
                                    />
                                  )}
                                  {Object.keys(c.config).length !== 0 && (
                                    <IconSetting
                                      width={17}
                                      height={17}
                                      color={"#2b3440"}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="collapse-content p-0 min-h-0 mt-1.5 group-hover:pb-0 text-sm">
                              {i18n(c.description)}
                            </div>
                          </div>
                        </li>
                      )
                    })}
                </ul>
              </div>
            </div>
          )}
          {Tabs.Tab2 === activeTab && (
            <div className="flex flex-col">
              <div className="w-full h-16 border-b border-gray-300 flex flex-row items-center">
                <div
                  className="w-1/6 h-full flex justify-center items-center cursor-pointer"
                  onClick={() => setActiveTab(Tabs.Tab1)}>
                  <IconBack width={30} height={30} color={"#2b3440"} />
                </div>
                <div className="w-5/6">
                  <p className="text-xl w-4/6 text-center">
                    {i18n(tab2Command.title)}
                  </p>
                </div>
              </div>
              <ul className="w-full pt-4 space-y-5">
                {Object.entries(tab2Command.config).map(([k, c]) => {
                  switch (c.type) {
                    case ConfigType.Input:
                      return (
                        <li className="pl-8 pr-5" key={k}>
                          <div className="w-full flex flex-col space-y-1">
                            <p className="text-base">{i18n(c.title)}</p>
                            <p className="text-sm text-gray-400 hover:text-inherit">
                              {i18n(c.description)}
                            </p>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-full max-w-xs focus:outline-none text-center"
                              value={c.value as string}
                              onChange={(e) => {
                                tab2Command.config[k].value = e.target.value
                                setTab2Command({ ...tab2Command })
                              }}
                            />
                          </div>
                        </li>
                      )
                    case ConfigType.Textarea:
                      return (
                        <li className="pl-8 pr-5" key={k}>
                          <div className="w-full flex flex-col space-y-1">
                            <p className="text-base">{i18n(c.title)}</p>
                            <p className="text-sm text-gray-400 hover:text-inherit">
                              {i18n(c.description)}
                            </p>
                            <textarea
                              className="textarea textarea-bordered focus:outline-none"
                              value={c.value as string}
                              onChange={(e) => {
                                tab2Command.config[k].value = e.target.value
                                setTab2Command({ ...tab2Command })
                              }}></textarea>
                          </div>
                        </li>
                      )
                    case ConfigType.Select:
                      return (
                        <li className="pl-8 pr-5" key={k}>
                          <div className="w-full flex flex-col space-y-1">
                            <p className="text-base">{i18n(c.title)}</p>
                            <p className="text-sm text-gray-400 hover:text-inherit">
                              {i18n(c.description)}
                            </p>
                            <select
                              className="select select-bordered select-sm w-full max-w-xs focus:outline-none text-center"
                              value={c.value as string}
                              onChange={(e) => {
                                tab2Command.config[k].value = e.target.value
                                setTab2Command({ ...tab2Command })
                              }}>
                              {c.options.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {i18n(o.label)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </li>
                      )
                    case ConfigType.Toggle:
                      return (
                        <li className="pl-8 pr-5" key={k}>
                          <div className="w-full flex flex-col space-y-1">
                            <div className="flex flex-row w-full">
                              <p className="text-base w-5/6">{i18n(c.title)}</p>
                              <input
                                type="checkbox"
                                className="toggle w-1/6 focus:outline-none"
                                checked={c.value as boolean}
                                onChange={(e) => {
                                  tab2Command.config[k].value = e.target.checked
                                  setTab2Command({ ...tab2Command })
                                }}
                              />
                            </div>
                            <p className="text-sm text-gray-400 hover:text-inherit">
                              {i18n(c.description)}
                            </p>
                          </div>
                        </li>
                      )
                  }
                })}
                <li className="pl-8 pr-5 pt-20">
                  <button
                    className="btn btn-neutral btn-sm w-full"
                    onClick={() => {
                      props.setConfigGesture({
                        ...props.configGesture,
                        command: {
                          uniqueKey: tab2Command.uniqueKey,
                          name: tab2Command.title,
                          config: _.mapValues(
                            tab2Command.config,
                            (value: { [x: string]: any }) => value["value"]
                          )
                        }
                      })
                      closeDrawer()
                    }}>
                    {i18n("save")}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
