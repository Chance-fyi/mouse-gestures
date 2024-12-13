import { Group } from "~enum/command"
import { Menu } from "~enum/menu"
import GestureManagement from "~options/components/gesture-management"
import { i18n } from "~utils/common"

export default () => {
  return (
    <div role="tablist" className="tabs tabs-bordered tabs-lg">
      <input
        type="radio"
        name="drag_tab"
        role="tab"
        className="tab text-2xl"
        aria-label={i18n("drag_text")}
        defaultChecked
      />
      <div role="tabpanel" className="tab-content pt-8">
        <GestureManagement
          title={Menu.Drag}
          commandGroup={Group.DragText}
          createBtnText="gesture_create"
          createTitle="gesture_create"
          editTitle="gesture_edit"
          modalId="drag-text-drawing-modal"
          drawerId="drag-text-command-drawer"
        />
      </div>

      <input
        type="radio"
        name="drag_tab"
        role="tab"
        className="tab text-2xl"
        aria-label={i18n("drag_url")}
      />
      <div role="tabpanel" className="tab-content pt-8">
        <GestureManagement
          title={Menu.Drag}
          commandGroup={Group.DragUrl}
          createBtnText="gesture_create"
          createTitle="gesture_create"
          editTitle="gesture_edit"
          modalId="drag-url-drawing-modal"
          drawerId="drag-url-command-drawer"
        />
      </div>

      <input
        type="radio"
        name="drag_tab"
        role="tab"
        className="tab text-2xl"
        aria-label={i18n("drag_image")}
      />
      <div role="tabpanel" className="tab-content pt-8">
        <GestureManagement
          title={Menu.Drag}
          commandGroup={Group.DragImage}
          createBtnText="gesture_create"
          createTitle="gesture_create"
          editTitle="gesture_edit"
          modalId="drag-image-drawing-modal"
          drawerId="drag-image-command-drawer"
        />
      </div>
    </div>
  )
}
