import React from 'react'

import styled from 'styled-components'

export default function DiceWheelCircle(props: any) {
  return (
    <Wrapper xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <circle
        r="144"
        cx="200"
        cy="200"
        strokeWidth="14"
        fill="none"
        stroke="#01d180"
      />
      <circle
        r="144"
        cx="200"
        cy="200"
        strokeWidth="14"
        fill="none"
        stroke="#ff2c55"
        strokeDasharray="904.7786842338604"
        // strokedashoffset: "405.61702758938236"
        strokeDashoffset={props.strokeDashoffset}
      />
    </Wrapper>
  )
}

const Wrapper = styled.svg`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%) rotate(-90deg);
`
