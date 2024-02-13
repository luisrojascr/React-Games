import React from 'react'
const WheelNeedle = (props: any) => (
  <svg
    width="35"
    height="50"
    style={{ marginTop: '40px' }}
    viewBox="0 0 51 73"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.596147 64.4774L25.2878 0.408386L49.9795 64.4774C50.6874 66.3153 50.4511 68.2103 49.3116 69.8255C48.1721 71.4428 46.4475 72.3291 44.4426 72.3291H6.13205C4.12717 72.3291 2.40358 71.4428 1.26305 69.8255C0.124568 68.2093 -0.112721 66.3153 0.596147 64.4774Z"
      fill={props.color}
    />
  </svg>
)

export default WheelNeedle
