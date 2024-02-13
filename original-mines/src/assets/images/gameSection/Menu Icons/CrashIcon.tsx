import React from 'react'

const CrashIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    viewBox="0 0 28 28"
  >
    <g fill={props.fill}>
      <path d="M3.5 26.25c-.966 0-1.75-.784-1.75-1.75V0H0v24.5C0 26.433 1.567 28 3.5 28H28v-1.75H3.5z" />
      <path d="M3.5 0v24.5c12.582-.28 19.25-6.598 19.25-18.34h-2.205l3.08-3.5 3.08 3.465H24.5c0 9.258-3.973 15.523-11.357 18.375H28v-21C28 1.567 26.433 0 24.5 0h-21z" />
    </g>
  </svg>
)
export default CrashIcon
