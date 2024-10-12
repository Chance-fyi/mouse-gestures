import { Menu } from "~enum/menu"
import GestureManagement from "~options/components/gesture-management"

export default () => {
  return (
    <GestureManagement
      title={Menu.Gesture}
      createBtnText="gesture_create"
      createTitle="gesture_create"
      editTitle="gesture_edit"
    />
  )
}
