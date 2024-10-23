interface CommandDrawerProps {
  drawerId: string
}
export default (props: CommandDrawerProps) => {
  return (
    <div className="drawer drawer-end">
      <input id={props.drawerId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content"></div>
      <div className="drawer-side z-[1000]">
        <label
          htmlFor={props.drawerId}
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <ul className="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
