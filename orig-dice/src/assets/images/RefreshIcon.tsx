import React from 'react'

import styled from 'styled-components'

const RefreshIcon = (props: any) => (
  <RefreshSVG
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    viewBox="0 0 15 15"
  >
    <g fill={props.fill}>
      <path d="M7.094 2.18c1.179 0 2.311.423 3.205 1.17L7.977 5.672l6.211.539L13.649 0l-1.93 1.93C10.447.812 8.804.18 7.094.18 3.661.18.758 2.634.191 6.014l1.973.331c.404-2.413 2.478-4.165 4.93-4.165zM7.094 12.18c-1.179 0-2.311-.423-3.205-1.17l2.322-2.322L0 8.149l.539 6.211 1.93-1.93c1.272 1.118 2.915 1.75 4.625 1.75 3.433 0 6.336-2.454 6.903-5.834l-1.973-.331c-.404 2.413-2.478 4.165-4.93 4.165z" />
    </g>
  </RefreshSVG>
)
export default RefreshIcon

const RefreshSVG = styled.svg`
  transition: transform 0.2s ease-in-out;
`
