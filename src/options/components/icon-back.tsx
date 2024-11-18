interface IconBackProps {
  width: number
  height: number
  color: string
}

export default (props: IconBackProps) => {
  return (
    <svg
      d="1731051602632"
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}>
      <path
        d="M436.130909 512l242.501818-242.501818c16.756364-16.756364 16.756364-44.218182 0-60.974546s-44.218182-16.756364-60.974545 0L344.436364 481.745455a43.287273 43.287273 0 0 0 0 60.974545l273.221818 273.221818c8.378182 8.378182 19.549091 12.567273 30.254545 12.567273a43.054545 43.054545 0 0 0 30.254546-73.541818l-242.501818-242.501818z"
        fill={props.color}></path>
    </svg>
  )
}
