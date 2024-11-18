interface IconCloseProps {
  width: number
  height: number
  color: string
}

export default (props: IconCloseProps) => {
  return (
    <svg
      d="1729733620136"
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}>
      <path
        d="M512 451.669333l225.834667-225.834666a42.666667 42.666667 0 0 1 60.330666 60.330666L572.330667 512l225.834666 225.834667a42.666667 42.666667 0 0 1-60.330666 60.330666L512 572.330667l-225.834667 225.834666a42.666667 42.666667 0 1 1-60.330666-60.330666L451.669333 512 225.834667 286.165333a42.666667 42.666667 0 0 1 60.330666-60.330666L512 451.669333z"
        fill={props.color}></path>
    </svg>
  )
}
