import React from 'react'

import styled from 'styled-components'

interface Props {
  radius?: number
  stroke?: number
  progress: number
  frontColor?: string
  backColor?: string
}

export default function DiceWheelCircle({
  stroke,
  progress,
  frontColor,
  backColor,
}: Props): JSX.Element {
  // const normalizedRadius = radius - stroke * 2;
  // const normalizedRadius = 200 - stroke * 2;

  // const circumference = normalizedRadius * 2 * Math.PI;
  const circumference = 163 * 2 * Math.PI

  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <DiceWheelCircleV2SVG viewBox="0 0 400 400">
      <circle
        r={163}
        cx={200}
        cy={200}
        strokeWidth={14}
        fill="none"
        stroke="rgb(17, 26, 65)"
      />
      <circle
        r={163}
        cx={200}
        cy={200}
        strokeWidth={stroke}
        fill="none"
        stroke={backColor}
      />
      <circle
        stroke={frontColor}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        r={163}
        cx={200}
        cy={200}
      />
    </DiceWheelCircleV2SVG>
  )
}

const DiceWheelCircleV2SVG = styled.svg`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%) rotate(-90deg);
`
