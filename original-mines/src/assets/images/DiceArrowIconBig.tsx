import React from 'react'

const DiceArrowIconBig = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    viewBox="0 0 171 305"
  >
    <g fill="none" fillRule="evenodd" transform="translate(-14 5)">
      <circle cx="109.418" cy="70.2" r="70.2" stroke="#FFF" strokeWidth="9.6" />
      <path
        fill={props.fill}
        d="M66.26 131.246L14.422 298.34c-.196.633.157 1.305.79 1.502.567.175 1.177-.09 1.436-.623L92.89 142.061l-26.63-10.815z"
      />
    </g>
  </svg>
)
export default DiceArrowIconBig
