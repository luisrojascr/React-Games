import React from 'react'

export default function EthIcon(props: any): JSX.Element {
  return (
    <svg {...props} id="icon-eth" viewBox="0 0 32 32">
      <path
        fill="#627eea"
        d="M32 16c0 8.837-7.163 16-16 16s-16-7.163-16-16c0-8.837 7.163-16 16-16s16 7.163 16 16z"
      />
      <path fill="#fff" opacity="0.6" d="M16.5 4v8.87l7.5 3.35z" />
      <path fill="#fff" d="M16.5 4l-7.5 12.22 7.5-3.35z" />
      <path fill="#fff" opacity="0.6" d="M16.5 21.97v6.030l7.5-10.385z" />
      <path fill="#fff" d="M16.5 28v-6.035l-7.5-4.35z" />
      <path fill="#fff" opacity="0.2" d="M16.5 20.575l7.5-4.355-7.5-3.35z" />
      <path fill="#fff" opacity="0.6" d="M9 16.22l7.5 4.355v-7.705z" />
    </svg>
  )
}
