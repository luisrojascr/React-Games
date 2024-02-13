/* eslint-disable global-require */
import React, { useRef, useState } from 'react'
import styled from 'styled-components'

import DropdownArrowIcon from 'assets/images/DropdownArrowIcon'
import { useOnClickOutside } from 'hooks/useOnClickOutside'

// import useWindowDimensions from '../../Contexts/WindowDimensionsProvider';

export interface Option {
  label: string
  value: number | string
  icon?: JSX.Element
  id?: any
  inputChildren?: JSX.Element
  code?: any
  available?: number
}

interface CustomDropdownProps {
  isMobile: boolean | undefined
  options: Option[]
  handleOptionClick: (option: any) => void
  currentOption: Option
  wrapperStyle?: any
  buttonStyle?: any
  v2?: boolean
  v3?: boolean
  $bgBlue?: boolean
  label?: string
  labelV2?: boolean
  disabled?: boolean
  section?: string
}

export function CustomDropdown({
  isMobile,
  options,
  handleOptionClick,
  currentOption,
  wrapperStyle,
  buttonStyle,
  label,
  labelV2,
  v2,
  v3,
  $bgBlue,
  section,
  disabled
}: CustomDropdownProps): JSX.Element {
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const wrapperRef = useRef(null)
  useOnClickOutside(wrapperRef, () => setShowMenu(false))

  const handleChange = (filteredOption: Option): void => {
    handleOptionClick(filteredOption)
    setShowMenu(false)
  }

  const $bgColor = v2 ? '#222C55' : '#ffffff'
  return (
    <Wrapper ref={wrapperRef} style={wrapperStyle || {}}>
      {label && labelV2 && (
        <LabelWrapperV2>
          <span>{label}</span>
        </LabelWrapperV2>
      )}

      {label && !labelV2 && (
        <LabelWrapper>
          <span>{label}</span>
        </LabelWrapper>
      )}
      <DropDownButton
        type="button"
        $bgColor={$bgColor}
        style={buttonStyle || {}}
        onClick={(): void => setShowMenu(!showMenu)}
        $menuOpen={showMenu}
        isMobile={isMobile}
        disabled={disabled}
      >
        <ButtonContent $v3={false}>
          {currentOption?.inputChildren || <span>{currentOption?.label}</span>}
          <DropdownArrowIcon
            width="11px"
            height="6px"
            fill="#8b90a5"
            style={{
              transform: showMenu ? 'rotate(180deg)' : 'none',
              transition: 'all 0.2s ease-in-out'
            }}
          />
        </ButtonContent>
      </DropDownButton>
      {showMenu && (
        <MenuContent $menuOpen={showMenu} $v3={v3} $bgBlue={$bgBlue}>
          {options
            .filter((option) => option.value !== currentOption?.value)
            .map((filteredOption) => (
              <MenuButton
                $v3={v3}
                type="button"
                style={buttonStyle || {}}
                isMobile={isMobile}
                $bgColor={$bgColor}
                key={filteredOption.label}
                onClick={(): void => handleChange(filteredOption)}
                section={section}
              >
                <ButtonContent $v3={v3}>
                  {filteredOption.inputChildren || (
                    <span>{filteredOption.label}</span>
                  )}
                </ButtonContent>
              </MenuButton>
            ))}
        </MenuContent>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  position: relative;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 580px) {
    width: 100% !important;
    max-width: 100% !important;
    margin-top: 0px !important;
  }
`

const MenuContent = styled.div<{
  $menuOpen: boolean
  $v3: boolean | undefined
  $bgBlue: boolean | undefined
}>`
  width: 100%;
  color: rgb(255, 255, 255);
  position: absolute;
  display: ${(props): string => (props.$v3 ? 'grid' : 'flex')};
  ${(props): string =>
    props.$v3
      ? 'grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));'
      : ''}
  ${(props): string => (props.$v3 ? 'border: 1px solid #d6d7df;' : '')}
  flex-direction: column;
  top: calc(100% - 1px);
  pointer-events: all;
  min-width: 21px;
  z-index: 1400;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  ${(props): string => (props.$v3 ? 'background: #ffffff;' : '')}
  ${(props): string => (props.$bgBlue ? 'background-color: #222c56;' : '')};
  & button:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom: 1px solid #d6d7df;
    border: ${(props): string => (props.$v3 ? 'none' : '')};
  }
`

const DropDownButton = styled.button<{
  $menuOpen: boolean
  isMobile: boolean | undefined
  $bgColor: string | undefined
}>`
  width: 100%;
  font-family: 'Open Sans',serif;;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  color: #273262;
  touch-action: manipulation;
  position: relative;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  transition: background 300ms ease 0s, opacity 300ms ease 0s,
    transform 100ms ease 0s, border-color 150ms ease;
  border-radius: 4px;
  border-bottom-left-radius: ${(props): string =>
    props.$menuOpen ? '0' : '4px'};
  border-bottom-right-radius: ${(props): string =>
    props.$menuOpen ? '0' : '4px'};
  border: ${(props): string =>
    props.$menuOpen ? '1px solid #d6d7df' : '1px solid #d6d7df'};
  border-bottom: 1px solid #d6d7df;
  background-color: ${(props): string =>
    props.$bgColor ? props.$bgColor : '#ffffff'};
  padding: 6px 12px;
  &:hover {
    border: ${(props): string => (props.$menuOpen ? '' : '1px solid #8b90a5')};
    transition: border 150ms ease;
  }
`
const MenuButton = styled.button<{
  isMobile: boolean | undefined
  $bgColor: string | undefined
  $v3: boolean | undefined
  section: string | undefined
}>`
  font-family: 'Open Sans',serif;;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  color: #848aa0;
  touch-action: manipulation;
  position: relative;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: flex-start;
  -webkit-box-align: center;
  align-items: center;
  transition: background 300ms ease 0s, opacity 300ms ease 0s,
    transform 100ms ease 0s;
  border-top: solid 1px #d6d7df;
  background-color: ${(props): string =>
    props.$bgColor ? props.$bgColor : '#ffffff'};
  padding: 6px 12px;
  border-left: 1px solid #d6d7df;
  border-right: 1px solid #d6d7df;
  border: ${(props): string => (props.$v3 ? 'none' : '')};
  &:hover {
    background-color: ${(props): string =>
      props.section === 'Deposite' ? '#4b4b87' : '#fafafb'};
    color: #273262;
  }
`

const ButtonContent = styled.span<{ $v3: boolean | undefined }>`
  display: inline-flex;
  position: relative;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  justify-content: ${(props): string =>
    props.$v3 ? 'center' : 'space-between'};
  transition: background 300ms ease 0s, opacity 300ms ease 0s,
    transform 100ms ease 0s;
`

const LabelWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: 'Open Sans',serif;;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 1px;
  /* color: #848aa0; */
  color: #fff;
  margin-bottom: 8px;
  & span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
`

const LabelWrapperV2 = styled.div`
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-family: 'Open Sans',serif;;
  font-size: 10px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  -webkit-letter-spacing: 0.6px;
  -moz-letter-spacing: 0.6px;
  -ms-letter-spacing: 0.6px;
  letter-spacing: 0.6px;
  color: #848aa0;
  margin: 0px 0px 0.25em;
  -webkit-transition: all 200ms ease-out 0s;
  transition: all 200ms ease-out 0s;
  & span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
`
