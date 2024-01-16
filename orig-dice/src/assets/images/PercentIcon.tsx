import React from 'react'

const PercentIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    viewBox="0 0 14 14"
  >
    <g fill="none" fillRule="evenodd">
      <path
        fill={props.fill}
        fillRule="nonzero"
        d="M3 6c1.7 0 3-1.3 3-3S4.7 0 3 0 0 1.3 0 3s1.3 3 3 3zm0-4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zM11 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
      />
      <path
        stroke={props.fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 1L1 13"
      />
    </g>
  </svg>
)
export default PercentIcon
