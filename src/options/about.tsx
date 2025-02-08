import { Menu } from "~enum/menu"
import { i18n } from "~utils/common"

export default () => {
  return (
    <>
      <div className="navbar bg-base-100">
        <span className="text-2xl">{i18n(Menu.About)}</span>
      </div>
      <div className="divider mt-0"></div>
      <div className="w-1/3 flex flex-row space-x-4 text-base pl-2">
        <a
          href="https://github.com/Chance-fyi/mouse-gestures"
          target="_blank"
          className="link">
          {i18n("about_source_code")}
        </a>
        <a
          href="https://github.com/Chance-fyi/mouse-gestures/issues"
          target="_blank"
          className="link">
          {i18n("about_report_bug")}
        </a>
        <a
          href="https://chromewebstore.google.com/detail/mouse-gestures/hiijklikoclhijlkkljppnnbpfdcgdpa/reviews"
          target="_blank"
          className="link">
          {i18n("about_good_review")}
        </a>
      </div>
    </>
  )
}
