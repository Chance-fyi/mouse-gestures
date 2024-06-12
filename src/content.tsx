import type {PlasmoCSConfig} from "plasmo";
import cssText from "data-text:~style.css"
import Canvas from "~components/canvas";
import {useEffect, useRef, useState} from "react";
import {handleMouseDown} from "~event";
import Tooltip from "~components/tooltip";
import {Operations} from "~enum";

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
  const [tooltipValue, setTooltipValue] = useState({
    arrow: "",
    operation: Operations.Invalid,
  });

  useEffect(() => {
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext();
      document.addEventListener('mousedown', handleMouseDown.bind(null, setCanvasVisible, canvasCtx, setTooltipVisible, setTooltipValue));
      // Clean up the event listeners on component unmount
      return () => {
        document.removeEventListener('mousedown', handleMouseDown.bind(null, setCanvasVisible, canvasCtx, setTooltipVisible, setTooltipValue));
      };
    }
  }, []);

  return (
    <>
      <div style={{display: canvasVisible ? 'block' : 'none'}}><Canvas ref={canvasRef}/></div>
      {tooltipVisible && <Tooltip tooltipValue={tooltipValue}/>}
    </>
  );
}

export default PlasmoOverlay
