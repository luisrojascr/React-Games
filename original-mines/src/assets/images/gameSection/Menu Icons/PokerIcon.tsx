import React from 'react'

const PokerIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    viewBox="0 0 32 32"
  >
    <g fill={props.fill}>
      <path d="M16.12 4.3c-4.734-.008-9.006 2.837-10.824 7.209-1.817 4.371-.82 9.407 2.524 12.757 3.344 3.35 8.378 4.355 12.753 2.545C24.947 25.001 27.8 20.734 27.8 16c-.011-6.45-5.23-11.678-11.68-11.7zm5.42 15.12c-1.491 1.029-3.437 1.122-5.02.24l.34 2.56h-1.74l.34-2.56c-1.575.883-3.517.79-5-.24-1.4-1.16-1.4-3.46 0-5.78 1.448-1.959 3.349-3.537 5.54-4.6 2.191 1.063 4.092 2.641 5.54 4.6 1.4 2.36 1.4 4.62 0 5.78z" />
      <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16c0-4.243-1.686-8.313-4.686-11.314C24.314 1.686 20.244 0 16 0zm.12 30c-7.732 0-14-6.268-14-14s6.268-14 14-14 14 6.268 14 14-6.268 14-14 14z" />
    </g>
  </svg>
)
export default PokerIcon