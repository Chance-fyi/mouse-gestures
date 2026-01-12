import "~style.css"

import { useEffect, useState } from "react"

import { Menu } from "~enum/menu"
import About from "~options/about"
import { useConfirm } from "~options/components/confirm"
import Donation from "~options/components/donation"
import Drag from "~options/drag"
import Gesture from "~options/gesture"
import Setting from "~options/setting"
import { checkMissingPermissions, i18n } from "~utils/common"

export default () => {
  const MenuPages = {
    [Menu.Gesture]: Gesture,
    [Menu.Drag]: Drag,
    [Menu.Setting]: Setting,
    [Menu.About]: About
  }
  const [menu, setMenu] = useState(Menu.Gesture)
  const MenuPage = MenuPages[menu]
  const { ConfirmUI, showConfirm } = useConfirm()

  useEffect(() => {
    document.title = chrome.runtime.getManifest().name
    if (window.location.hash) {
      setMenu(window.location.hash.slice(1) as Menu)
    }

    checkMissingPermissions(showConfirm).then()
  }, [])
  const handleMenuClick = (page) => {
    setMenu(page)
    window.location.hash = page
  }

  return (
    <div className="flex p-4 h-screen">
      <ul className="menu menu-lg w-36 rounded-box">
        {Object.values(Menu).map((v) => {
          return (
            <li key={v}>
              <a
                className={v === menu ? "active" : ""}
                onClick={() => handleMenuClick(v)}>
                {i18n(v)}
              </a>
            </li>
          )
        })}
      </ul>
      <div className="flex-grow pl-4">{MenuPage && <MenuPage />}</div>
      <div
        className="mask mask-heart w-10 h-10 bg-red-500 fixed bottom-40 left-12 animate-bounce hover:cursor-pointer"
        onClick={() =>
          (document.getElementById("donation") as HTMLDialogElement).showModal()
        }></div>
      <Donation />
      {ConfirmUI}
    </div>
  )
}
