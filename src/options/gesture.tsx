import { Menu } from "~enum/menu"
import GestureManagement from "~options/components/gesture-management"

export default () => {
  return (
    <GestureManagement
      title={Menu.Gesture}
      createBtnText="createGesture"
      createTitle="createGesture"
      editTitle="editGesture"
    />
  )
}
