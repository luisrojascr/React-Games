/* eslint-disable no-nested-ternary */
import React from 'react'

import styled from 'styled-components'

import Spinner from './spinner'

interface Props {
  children?: any
  $bgColor?: string
  color?: string
  padding?: string
  width?: string
  type: 'button' | 'submit'
  margin?: string
  onClick?: () => void
  loading?: boolean
  style?: React.CSSProperties
  disabled?: boolean
  $isInRedState?: boolean
  secondary?: boolean
  spinerHide?: boolean
  hoverColor?: string
  dataTestId?: string
}

export default function Button({
  children,
  type,
  onClick,
  width,
  $bgColor,
  color,
  padding,
  margin,
  loading,
  style,
  disabled,
  $isInRedState,
  secondary,
  spinerHide,
  hoverColor,
  dataTestId,
}: Props): JSX.Element {
  const backgroundColor = secondary ? '#4769fc' : $bgColor || '#01d180'
  return (
    <CustomButton
      style={style}
      disabled={loading || disabled}
      onClick={onClick}
      type={type || 'button'}
      width={width || 'initial'}
      $bgColor={backgroundColor}
      color={color || '#ffffff'}
      padding={padding || '16px'}
      margin={margin || '0px'}
      $isInRedState={$isInRedState}
      secondary={secondary}
      hoverColor={hoverColor}
      data-testid={dataTestId}
    >
      {loading && spinerHide === undefined ? (
        <Spinner />
      ) : (
        <span>{children}</span>
      )}
    </CustomButton>
  )
}

const CustomButton = styled.button<Props>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  min-width: max-content;
  outline: none;
  padding: ${props => props.padding};
  border-radius: 4px;
  background-color: ${props => props.$bgColor};
  font-family: 'Open Sans',serif;
  font-size: 12px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 1px;
  text-align: center;
  color: ${props => props.color};
  cursor: pointer;
  margin: ${props => props.margin};
  width: ${props => props.width};
  transition: all 0.2s linear;
  transition: background 300ms ease 0s, opacity 300ms ease 0s,
    transform 100ms ease 0s;

  &:hover {
    background-color: ${props =>
      props.$isInRedState
        ? '#de2348'
        : props.secondary
        ? '#334aaf'
        : props.hoverColor
        ? props.hoverColor
        : '#00b16c'};
    transition: all 0.2s linear;

    &:disabled {
      cursor: not-allowed;
      background-color: ${props =>
        props.$isInRedState ? '#de2348' : '#80e8bf'};
    }

    &:active span {
      transform: scale(0.95);
      transition: background 300ms ease 0s, opacity 300ms ease 0s,
        transform 100ms ease 0s;
    }
  }
`
