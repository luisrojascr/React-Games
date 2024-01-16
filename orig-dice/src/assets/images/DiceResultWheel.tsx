import React from 'react'

export default function DiceResultWheel(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      viewBox="0 0 75 84"
    >
      <g fill="none" fillRule="evenodd">
        <path
          fill="#111A41"
          stroke={props.stroke}
          strokeWidth="2"
          d="M39.52 1.986c-1.286-.569-2.754-.569-4.04 0l-31.5 13.92c-.906.4-1.651 1.048-2.17 1.844-.518.796-.81 1.74-.81 2.73v43.552c0 .99.292 1.933.81 2.729.519.795 1.264 1.444 2.17 1.844l31.5 13.92c1.286.568 2.754.568 4.04 0l31.5-13.92c.906-.4 1.651-1.049 2.17-1.844.518-.796.81-1.74.81-2.73V20.48c0-.99-.292-1.933-.81-2.729-.519-.796-1.264-1.444-2.17-1.844l-31.5-13.92z"
        />
        <text
          fill="#FFF"
          fontFamily="InterUI-Black, Inter UI"
          fontSize="19.2"
          fontWeight="700"
        />
      </g>
    </svg>
  )
}
