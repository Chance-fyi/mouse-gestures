interface IconSearchProps {
  width: number
  height: number
  color: string
}

export default (props: IconSearchProps) => {
  return (
    <svg
      d="1729675903434"
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      id="mx_n_1729675903435"
      width={props.width}
      height={props.height}>
      <path
        d="M1004.38 909.836l-207.128-207.17a439.157 439.157 0 0 0 85.773-261.164C882.982 198.064 684.933 0 441.51 0S0.036 198.05 0.036 441.502 198.1 883.004 441.509 883.004a439.129 439.129 0 0 0 261.136-85.773l207.17 207.156a66.86 66.86 0 0 0 94.55-94.55M108.681 441.501c0-183.526 149.302-332.856 332.828-332.856s332.813 149.33 332.813 332.856S625.034 774.286 441.51 774.286 108.681 625 108.681 441.502"
        fill={props.color}></path>
    </svg>
  )
}
