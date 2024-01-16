/* eslint-disable no-nested-ternary */
import * as React from 'react'
import { useState, useRef } from 'react'

import styled from 'styled-components'

export interface TooltipProps {
  position?: 'top' | 'left' | 'right' | 'bottom'
  message: JSX.Element | Array<JSX.Element> | string
  children: JSX.Element | Array<JSX.Element> | string
  show?: boolean
  togglerStyle?: React.CSSProperties
  wrapperStyle?: React.CSSProperties
  messageStyle?: any
  fiatColor?: boolean
  bgColor?: boolean
  statsTop?: boolean
  statsTop2?: any
  translate?: string
}

/* export interface TooltipStyle {
  left?: string;
  top?: string;
  bottom?: string;
  right?: string;
} */

export function Tooltip({
  position,
  message,
  children,
  show,
  togglerStyle,
  wrapperStyle,
  messageStyle,
  bgColor,
  fiatColor,
  statsTop,
  statsTop2,
  translate,
}: TooltipProps): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  // const toggle = (): void => setIsVisible(!isVisible);

  const node = useRef<any>(null)

  let tooltipStyle = {}

  if (position === 'left') {
    tooltipStyle = {
      bottom: '50%',
      right: '100%',
      transform: 'translate(-10px, 50%)',
      ...messageStyle,
    }
  } else if (position === 'right') {
    tooltipStyle = {
      bottom: '50%',
      left: '100%',
      transform: 'translate(10px, 50%)',
      ...messageStyle,
    }
  } else if (position === 'bottom') {
    tooltipStyle = {
      top: '100%',
      left: '50%',
      transform: 'translate(-50%, 50%)',
      ...messageStyle,
    }
  } else {
    tooltipStyle = {
      bottom: statsTop ? '120%' : statsTop2 ? statsTop2 : '100%',
      left: '50%',
      transform: translate ? translate : 'translate(-30%, -50%)',
      ...messageStyle,
    }
  }

  /* const style: TooltipStyle = {};
  if (node.current && node.current.offsetWidth) {
    if (position === 'top' || position === 'bottom') {
      style.left = `${node.current.offsetWidth / 2}px`;
    } else {
      style.top = `-${node.current.offsetHeight / 1.5}px`;
    }
  } */

  if (show !== undefined) {
    return (
      <TooltipWrapper style={wrapperStyle || {}}>
        <TooltipTogglerWrapper style={togglerStyle || {}} ref={node}>
          {children}
        </TooltipTogglerWrapper>
        {show && (
          <TooltipMessage
            $pos={position}
            style={tooltipStyle}
            $bgColor={bgColor}
            $fiatColor={fiatColor}
          >
            {message}
          </TooltipMessage>
        )}
      </TooltipWrapper>
    )
  }

  return (
    <TooltipWrapper
      onMouseEnter={(): void => setIsVisible(true)}
      onMouseLeave={(): void => setIsVisible(false)}
      style={wrapperStyle || {}}
    >
      <TooltipTogglerWrapper ref={node}>{children}</TooltipTogglerWrapper>
      {isVisible && (
        <TooltipMessage
          $pos={position}
          style={tooltipStyle}
          $bgColor={bgColor}
          $fiatColor={fiatColor}
        >
          {message}
        </TooltipMessage>
      )}
    </TooltipWrapper>
  )
}

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
  /* width: 100%; */
`

const TooltipTogglerWrapper = styled.div`
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`

const TooltipMessage = styled.div<{
  $pos: string | undefined
  $bgColor?: boolean
  $fiatColor?: boolean
}>`
  position: absolute;
  z-index: 3000;
  border-radius: 2px;
  padding: 8px;
  box-shadow: 0 6px 10px 0 rgba(17, 26, 65, 0.12);
  background-color: ${props =>
    props.$bgColor ? '#2C3763' : props.$fiatColor ? '#4769fc' : '#fbfcff'};
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  border: ${props =>
    props.$bgColor
      ? 'solid 1px #2C3763'
      : props.$fiatColor
      ? '#4769fc'
      : 'solid 1px #eaeaf0'};
  background-color: ${props =>
    props.$bgColor ? '#2C3763' : props.$fiatColor ? '#4769fc' : '#ffffff'};
  font-family: 'Open Sans',serif;
  font-size: 10px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => (props.$fiatColor ? '#ffffff' : '#222c55')};
  white-space: pre;

  &::after {
    content: '';
    position: absolute;
    -webkit-transform: ${(props): string =>
      props.$pos === 'right'
        ? 'translate(0, -50%) rotate(270deg)'
        : props.$pos === 'left'
        ? 'translate(0, -50%) rotate(-270deg)'
        : props.$pos === 'bottom'
        ? 'translate(0, -50%) rotate(0deg)'
        : 'translate(-50%, 50%) rotate(180deg)'};
    -ms-transform: ${(props): string =>
      props.$pos === 'right'
        ? 'translate(0, -50%) rotate(270deg)'
        : props.$pos === 'left'
        ? 'translate(0, -50%) rotate(-270deg)'
        : props.$pos === 'bottom'
        ? 'translate(0, -50%) rotate(0deg)'
        : 'translate(-50%, 50%) rotate(180deg)'};
    -webkit-transform: ${(props): string =>
      props.$pos === 'right'
        ? 'translate(0, -50%) rotate(270deg)'
        : props.$pos === 'left'
        ? 'translate(0, -50%) rotate(-270deg)'
        : props.$pos === 'bottom'
        ? 'translate(0, -50%) rotate(0deg)'
        : 'translate(-50%, 50%) rotate(180deg)'};
    -ms-transform: ${(props): string =>
      props.$pos === 'right'
        ? 'translate(0, -50%) rotate(270deg)'
        : props.$pos === 'left'
        ? 'translate(0, -50%) rotate(-270deg)'
        : props.$pos === 'bottom'
        ? 'translate(0, -50%) rotate(0deg)'
        : 'translate(-50%, 50%) rotate(180deg)'};
    transform: ${(props): string =>
      props.$pos === 'right'
        ? 'translate(0, -50%) rotate(270deg)'
        : props.$pos === 'left'
        ? 'translate(0, -50%) rotate(-270deg)'
        : props.$pos === 'bottom'
        ? 'translate(0, -50%) rotate(0deg)'
        : 'translate(-50%, 50%) rotate(180deg)'};
    top: ${(props): string =>
      props.$pos === 'right'
        ? '50%'
        : props.$pos === 'left'
        ? '50%'
        : props.$pos === 'bottom'
        ? ''
        : 'calc(100% - 4px)'};
    left: ${(props): string =>
      props.$pos === 'right'
        ? ''
        : props.$pos === 'left'
        ? 'calc(100% - 3px)'
        : props.$pos === 'bottom'
        ? ''
        : '50%'};
    right: ${(props): string =>
      props.$pos === 'right'
        ? 'calc(100% - 3px)'
        : props.$pos === 'left'
        ? '50%'
        : props.$pos === 'bottom'
        ? '50%'
        : ''};
    bottom: ${(props): string =>
      props.$pos === 'right'
        ? ''
        : props.$pos === 'left'
        ? '50%'
        : props.$pos === 'bottom'
        ? 'calc(100% - 4px)'
        : ''};
    width: 0px;
    height: 0px;
    border-radius: 2px;
    border-color: transparent transparent
      ${props => (props.$fiatColor ? '#4769fc' : '#ffffff')};

    border-style: solid;
    border-width: 0px 6px 6px;
    z-index: 3000;
  }
`
