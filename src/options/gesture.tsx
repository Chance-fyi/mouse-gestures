import GestureManagement from "~options/components/gesture-management";
import {Menu} from "~enum/menu";

export default () => {
  return (
    <GestureManagement
      title={Menu.Gesture}
      createBtnText="createGesture"
      createTitle="createGesture"
      editTitle="editGesture"
    />
  );
}