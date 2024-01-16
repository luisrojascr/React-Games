import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import styled, { keyframes } from 'styled-components'

interface Props {
  pastBet: number | string | undefined | null
  win: boolean | undefined | null
  index: number
  id: string
}

export default function PastBetButton({
  pastBet,
  win,
  index,
  id,
}: Props): JSX.Element {
  
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  return (
    <PastBetButtonWrapper
      ref={buttonRef}
      $animateIn={index === 0}
      style={{
        backgroundColor: !win ? '#3f4b79' : '#01d180',
        color: !win ? '#ffffff' : '#101940',
        transform:
          index > 0 ? `translateX(-${index * 100 + index * 12}%)` : undefined,
        opacity: index >= 5 || 0 ? '0' : '1',
      }}
      onClick={(): void => {}}
      data-testid={`past-bet-button:${index}`}
      key={id ? id : index}
    >
      {pastBet}
    </PastBetButtonWrapper>
  )
}

const slideIn = keyframes`
  from {
    transform: translate(100%);
    opacity: 0;
  }

  to {
    transform: translate(0);
    opacity: 1
  }
`

const PastBetButtonWrapper = styled.button<{ $animateIn: boolean }>`
  font-family: 'Open Sans',serif;
  font-size: 11px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.45;
  letter-spacing: 1px;
  text-align: center;
  border-radius: 4px;
  min-width: 9ch;
  max-width: 9ch;
  white-space: nowrap;
  touch-action: manipulation;
  position: relative;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  transition: background 300ms ease 0s, opacity 1000ms ease 0s,
    transform 400ms ease 0s;
  padding: 4px;
  font-variant-numeric: tabular-nums;

  animation: ${props => (props.$animateIn ? slideIn : '')} 0.4s ease;

  position: absolute;
`
