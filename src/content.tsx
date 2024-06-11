import type {PlasmoCSConfig} from "plasmo";
import cssText from "data-text:~style.css"
import Canvas from "~components/canvas";
import {useEffect, useRef, useState} from "react";
import {handleMouseDown} from "~event";
import Tooltip from "~components/tooltip";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [canvasVisible, setCanvasVisible] = useState(false);
  const canvasRef = useRef(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [gesture, setGesture] = useState("");

  useEffect(() => {
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext();
      document.addEventListener('mousedown', handleMouseDown.bind(null, setCanvasVisible, canvasCtx, setTooltipVisible,setGesture));
      // Clean up the event listeners on component unmount
      return () => {
        document.removeEventListener('mousedown', handleMouseDown.bind(null, setCanvasVisible, canvasCtx, setTooltipVisible,setGesture));
      };
    }
  }, []);

  return (
    <>
      <div style={{ display: canvasVisible ? 'block' : 'none' }}><Canvas ref={canvasRef} /></div>
      {tooltipVisible && <Tooltip gesture={gesture}/>}
    </>
  );
}

export default PlasmoOverlay
