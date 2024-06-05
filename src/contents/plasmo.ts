import type {PlasmoCSConfig} from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
}

// 是否阻止右键菜单
let blockMenu: boolean = false;
document.addEventListener("mousedown", (e: MouseEvent) => {
  // 判断是否是右键按下
  if (e.button != 2) {
    return;
  }
  blockMenu = false;
  // 鼠标初始位置
  let clientX: number = e.clientX;
  let clientY: number = e.clientY;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "999999";
  canvas.style.pointerEvents = "none"; // 点击穿透
  canvas.width = window.innerWidth - 1; // -1 防止出现滚动条
  canvas.height = window.innerHeight - 1;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  if (!ctx) return;
  ctx.strokeStyle = "#0072f3";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);

  let lastX = e.clientX;
  let lastY = e.clientY;
  const handleMouseMove = (moveEvent: MouseEvent) => {
    const currentX = moveEvent.clientX;
    const currentY = moveEvent.clientY;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    // 使用贝塞尔曲线来平滑轨迹
    ctx.quadraticCurveTo(
      (lastX + currentX) / 2,
      (lastY + currentY) / 2,
      currentX,
      currentY
    );
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
  };

  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.removeChild(canvas);
    if (clientX != e.clientX || clientY != e.clientY) {
      // 鼠标移动阻止右键菜单
      blockMenu = true;
    }
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
});
document.addEventListener("contextmenu", (e: MouseEvent) => {
  if (blockMenu) {
    // 阻止右键菜单
    e.preventDefault();
  }
});
