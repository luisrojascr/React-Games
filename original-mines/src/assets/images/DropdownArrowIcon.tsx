import React from 'react'

const DropdownArrowIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    viewBox="0 0 11 6"
    style={props.style}
    opacity={0.5}
  >
    <path
      fill={props.fill}
      d="M8.845.661L5.5 3.741 2.155.662C1.749.288 1.125.288.718.661.353.998.33 1.567.666 1.931c.017.019.034.036.052.053l4.064 3.742c.396.365 1.04.365 1.436 0l4.064-3.742c.365-.336.388-.905.052-1.27L10.282.66c-.406-.373-1.03-.373-1.437 0z"
    />
  </svg>
)
export default DropdownArrowIcon
