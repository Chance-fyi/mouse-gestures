import CommandDrawer from "~options/components/command-drawer"
import GestureDrawing from "~options/components/gesture-drawing"
import { i18n } from "~utils/common"

export interface GestureManagementProps {
  title: string
  createBtnText: string
  createTitle: string
  editTitle: string
}

const modalId: string = "drawing-modal"
const drawerId: string = "command-drawer"

export default (props: GestureManagementProps) => {
  return (
    <div>
      <div className="navbar bg-base-100">
        <span className="text-2xl">{i18n(props.title)}</span>
      </div>
      <div className="divider mt-0"></div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))]">
        <label
          htmlFor={modalId}
          className="aspect-w-3 aspect-h-4 border-2 border-dashed hover:border-success text-base-300 hover:text-success cursor-pointer">
          <div className="flex items-center justify-center h-full text-xl select-none">
            {i18n(props.createTitle)}
          </div>
        </label>
        <div className="aspect-w-3 aspect-h-4 border">02</div>
      </div>
      <GestureDrawing
        modalId={modalId}
        drawerId={drawerId}
        title={props.createTitle}
      />
      <CommandDrawer drawerId={drawerId} />
    </div>
  )
}
