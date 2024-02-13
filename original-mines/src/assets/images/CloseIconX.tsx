import React from 'react'

const CloserIconX = (props: any) => (
  <svg
    {...props}
    width={props.width ? props.width : '12'}
    height={props.height ? props.height : '12'}
    viewBox="0 0 12 12"
  >
    <g
      fill="none"
      fillRule="evenodd"
      stroke={props.stroke ? props.stroke : '#7B8AC5'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M10 0L0 10M10 10L0 0" transform="translate(1 1)" />
    </g>
  </svg>
)
export default CloserIconX
