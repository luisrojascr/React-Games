import React from 'react'

import styled, { keyframes } from 'styled-components'

export const bounceDelay = keyframes`
    0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
`

const Spinner = styled.div`
  width: 70px;
  text-align: center;

  & div {
    width: 14px;
    height: 14px;
    background-color: #ffffff;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: ${bounceDelay} 1.2s infinite ease-in-out both;
    animation: ${bounceDelay} 1.2s infinite ease-in-out both;
  }

  & div:first-child {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  & div:nth-child(2) {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
`

export default function SpinnerAnimation(): JSX.Element {
  return (
    <Spinner>
      <div />
      <div />
      <div />
    </Spinner>
  )
}
