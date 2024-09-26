import {i18n} from "~utils/common";
import GestureDrawing from "~options/components/gesture-drawing";

export interface GestureManagementProps {
  title: string,
  createBtnText: string,
  createTitle: string,
  editTitle: string,
}

enum PopupType {
  create = "create-popup",
  edit = "edit-popup",
}

export default (props: GestureManagementProps) => {
  return (
    <div>
      <div className="navbar bg-base-100">
        <span className="text-2xl">{i18n(props.title)}</span>
      </div>
      <div className="divider mt-0"></div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))]">
        <div
          className="aspect-w-3 aspect-h-4 border-2 border-dashed hover:border-success text-base-300 hover:text-success cursor-pointer"
          onClick={() => (document.getElementById(PopupType.create) as HTMLDialogElement).showModal()}
        >
          <div className="flex items-center justify-center h-full text-xl select-none">
            {i18n(props.createTitle)}
          </div>
        </div>
        <div className="aspect-w-3 aspect-h-4 border">02</div>
      </div>
      <GestureDrawing id={PopupType.create} title={props.createTitle}/>
    </div>
  );
}