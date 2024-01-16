import React from 'react'

const DiceShapeIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    viewBox="0 0 50 57"
  >
    <g fill="none" fillRule="evenodd">
      <path
        fill={props.fill}
        d="M2.383 10.34l21-9.28c1.03-.455 2.204-.455 3.234 0l21 9.28c1.448.64 2.383 2.075 2.383 3.659v29.035c0 1.583-.935 3.018-2.383 3.658l-21 9.28c-1.03.455-2.204.455-3.234 0l-21-9.28C.935 46.052 0 44.617 0 43.034V13.999c0-1.584.935-3.019 2.383-3.66z"
      />
    </g>
  </svg>
)
export default DiceShapeIcon
