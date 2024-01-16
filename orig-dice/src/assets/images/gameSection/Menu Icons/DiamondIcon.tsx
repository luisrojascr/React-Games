import React from 'react'

const DiamondIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    viewBox="0 0 16 12"
  >
    <path
      fill={props.fill}
      fillRule="evenodd"
      d="M8 12L4.5 5h7L8 12zm1.5-.5L12.455 5H16l-6.5 6.5zM3.546 5L6.5 11.5 0 5h3.546zM16 4.5h-3.608L8.5 0h3.608L16 4.5zm-12.391 0H0L3.892 0H7.5L3.609 4.5zm.891 0h7L8 .5l-3.5 4z"
    />
  </svg>
)
export default DiamondIcon
