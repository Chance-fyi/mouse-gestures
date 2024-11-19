import "~style.css"

import { useEffect, useState } from "react"

import { Menu } from "~enum/menu"
import Drag from "~options/drag"
import Gesture from "~options/gesture"
import Setting from "~options/setting"
import { i18n } from "~utils/common"

export default () => {
  const MenuPages = {
    [Menu.Gesture]: Gesture,
    [Menu.Drag]: Drag,
    [Menu.Setting]: Setting
  }
  const [menu, setMenu] = useState(Menu.Gesture)
  const MenuPage = MenuPages[menu]

  useEffect(() => {
    if (window.location.hash) {
      setMenu(window.location.hash.slice(1) as Menu)
    }
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
    </div>
  )
}
