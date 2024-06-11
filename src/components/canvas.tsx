import React, {useRef, useImperativeHandle, forwardRef} from 'react';

const Canvas = forwardRef(({ ...rest }, ref) => {
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getContext: () => {
      const canvas = canvasRef.current;
      return canvas.getContext('2d');
    },
    clearCanvas: () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }));

  return <canvas
    className="fixed top-0 left-0 z-[99999] pointer-events-none w-screen h-screen"
    width={window.innerWidth}
    height={window.innerHeight}
    ref={canvasRef} {...rest}
  />;
});

export default Canvas;