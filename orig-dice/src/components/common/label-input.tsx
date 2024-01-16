import React from 'react'

import styled from 'styled-components'
import { numberOnly } from 'utils/helper'

interface Props {
  type?: string
  value: string | number
  integerOnly?: boolean
  onChange?: (e: any) => void
  onBlur?: () => void
  inputIcon?: any
  labelChildren?: JSX.Element | Array<JSX.Element> | string
  inputButtons?: Array<JSX.Element>
  readOnly?: boolean
  buttonsPosition?: 'start' | 'end'
  disabled?: boolean
  min?: number | string
  max?: number | string
  step?: any
  style?: React.CSSProperties
  paddingRight?: string
  dataTestId?: string
}

function LabelInput({
  type,
  value,
  onChange,
  onBlur,
  inputIcon,
  labelChildren,
  inputButtons,
  readOnly,
  buttonsPosition,
  disabled,
  min,
  max,
  step,
  style,
  integerOnly,
  paddingRight,
  dataTestId,
}: Props): JSX.Element {
  const [isActive, setIsActive] = React.useState<boolean>(false)

  const handleBlur = (): void => {
    if (onBlur) {
      onBlur()
    }
    setIsActive(false)
  }

  return (
    <InputLabel style={{ ...style, opacity: disabled ? '0.8' : '1' }}>
      <InputWrapper
        $active={isActive}
        $readonly={readOnly}
        $buttonsPosition={buttonsPosition}
      >
        <InputInnerLabel>
          <InputInnerWrapper>
            <InnerContent>
              {type === 'number' ? (
                <MainInput
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled}
                  $isReadOnly={readOnly}
                  readOnly={readOnly}
                  type={type}
                  inputMode="decimal"
                  value={value}
                  data-testid={dataTestId}
                  onChange={onChange}
                  onKeyDown={(e: any) => integerOnly && numberOnly(e)}
                  onFocus={(): void => setIsActive(true)}
                  onBlur={handleBlur}
                  $paddingRight={paddingRight}
                />
              ) : (
                <MainInput
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled}
                  $isReadOnly={readOnly}
                  readOnly={readOnly}
                  type={type}
                  data-testid={dataTestId}
                  value={value}
                  onChange={onChange}
                  onKeyDown={(e: any) => integerOnly && numberOnly(e)}
                  onFocus={(): void => setIsActive(true)}
                  onBlur={handleBlur}
                  $paddingRight={paddingRight}
                />
              )}
              {inputIcon}
            </InnerContent>
          </InputInnerWrapper>
        </InputInnerLabel>
        {inputButtons && (
          <ButtonsWrapper $buttonsLeft={buttonsPosition === 'start'}>
            {inputButtons}
          </ButtonsWrapper>
        )}
      </InputWrapper>
      <LabelContent>{labelChildren}</LabelContent>
    </InputLabel>
  )
}

export default LabelInput

const InputLabel = styled.div`
  display: inline-flex;
  -webkit-box-align: center;
  -webkit-overflow-scrolling: touch;
  flex-direction: column-reverse;
  align-items: flex-start;
  touch-action: manipulation;
  width: 100%;
`
const InputWrapper = styled.div<{
  $active: boolean
  $readonly: boolean | undefined
  $buttonsPosition: string | undefined
}>`
  width: 100%;
  display: inline-flex;
  flex-direction: ${(props): string =>
    props.$buttonsPosition === 'start' ? 'row-reverse' : 'row'};
  border-radius: 4px;
  /* border: solid 1px ${(props): string =>
    props.$active && !props.$readonly ? '#8b90a5' : '#d6d7df'}; */
  background: #111a41;
  border: 1px solid #2c3763;
  transition: border 0.25s ease-in;

  &:hover {
    border: solid 1px #8b90a5;
    transition: border 0.85s ease-in;
  }
`
const LabelContent = styled.span`
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  font-family: 'Open Sans',serif;
  font-size: 10px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: 0.6px;
  /* color: #848aa0; */
  color: #ffffff;
  opacity: 0.7;
  margin: 0px 0px 0.25em;
  transition: all 200ms ease-out 0s;
  margin-bottom: 5px;
`
const InputInnerLabel = styled.label`
  width: 100%;
  display: inline-flex;
  flex-direction: row-reverse;
  -webkit-box-align: center;
  align-items: center;
`
const InputInnerWrapper = styled.span`
  width: 100%;
  display: flex;
  flex-shrink: 0;
`

const InnerContent = styled.span`
  position: relative;
  -webkit-box-flex: 1;
  flex-grow: 1;
  width: 100%;
  display: flex;

  & svg {
    position: absolute;
    top: 50%;
    transform: translate(0px, -50%);
    pointer-events: none;
    color: rgb(177, 186, 211);
    cursor: text;
    right: 0.75em;
    height: 16px;
    width: 16px;
  }
  & img {
    position: absolute;
    top: 50%;
    transform: translate(0px, -50%);
    pointer-events: none;
    color: rgb(177, 186, 211);
    cursor: text;
    right: 0.75em;
    height: 16px;
    width: 16px;
  }
`

const MainInput = styled.input<{
  $isReadOnly: boolean | undefined
  $paddingRight: string | undefined
}>`
  -webkit-appearance: none;
  width: 100%;
  box-shadow: none;
  cursor: text;
  -webkit-appearance: none;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 6px;
  padding-right: 36px;
  /* background-color: ${(props): string =>
    props.$isReadOnly ? '#222c55' : '#222c55'}; */
  background-color: #111a41;
  border: none;
  transition: all 200ms ease-out 0s;
  outline: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  -webkit-overflow-scrolling: touch;
  @media (max-width: 1030px) {
    font-size: 15px;
    padding-right: ${props =>
      props.$paddingRight ? props.$paddingRight : '36px'};
  }
  font-size: 14px;
  font-family: 'Open Sans',serif;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  color: #fff;

  &:disabled {
    color: #7483c5;
    cursor: not-allowed;
  }
  @media (max-width: 475px) {
  }
`

const ButtonsWrapper = styled.div<{ $buttonsLeft: boolean }>`
  display: inline-flex;
  flex-shrink: 0;

  & button {
    ${(props): any =>
      !props.$buttonsLeft ? 'margin-right: 4px;' : 'margin-left: 4px;'}
  }

  & button:last-child {
    ${(props): any => !props.$buttonsLeft && 'font-size: 12px !important;'}
  }
`
