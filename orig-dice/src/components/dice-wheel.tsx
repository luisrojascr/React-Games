import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react'
import styled from 'styled-components'
import { motion, useAnimation } from 'framer-motion'
import DiceWheelCircleV2 from 'assets/images/DiceWheelCircleV2'
import DiceWheelBorder from 'assets/images/DiceWheelBorder'
import DiceWheelArrow from 'assets/images/DiceWheelArrow'
import DiceShape from 'assets/images/DiceResultWheel'
import { DiceContext } from './dice-context'
import { round } from 'utils/helper'
import diceSelectorSound from 'assets/sounds/selector-move.mp3'
import { useWindowDimensions } from 'contexts/window-dimensions-provider'
import useSound from 'use-sound'
import { DiceRollConditionEnum } from 'utils'

const ResultVariants = {
  visible: {
    scale: [1, 1, 1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.6],
    opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    transition: { ease: 'easeInOut', duration: 2.8 },
  },
}

interface Props {
  parentWidth: number
  resize: boolean
}

function DiceWheel({ parentWidth, resize }: Props): JSX.Element {
  const {
    numberRolled,
    rollOverUnder,
    isRollOverOrUnder,
    setrollOverUnder,
    gameInProgress,
    setCashout,
    setWinChance,
    rotateBoxTo,
    setRotateBoxTo,
    angle,
    setAngle,
    resetBoard,

    isSound
  } = useContext(DiceContext)

  const [rotateArrowTo, setRotateArrowTo] = useState<number>(0)

  const [isActive, setIsActive] = useState<boolean>(false)
  const [startAngle, setStartAngle] = useState<number>(0)
  const [currentAngle, setCurrentAngle] = useState<number>(0)
  const [boxCenterPoint, setBoxCenterPoint] = useState<any>({})

  const controls = useAnimation()
  const [playSelectorSound] = useSound(diceSelectorSound)

  const box = useRef<HTMLDivElement | null>(null)

  const { isMobile } = useWindowDimensions()

  useEffect(() => {
    resetBoard(false)
    setStartAngle(180)
    setCurrentAngle(180)

    if (box) {
      const boxPosition = box.current!.getBoundingClientRect()
      // get the current center point
      const boxCenterX = boxPosition.left + boxPosition.width / 2
      const boxCenterY = boxPosition.top + boxPosition.height / 2
      // update the state
      setBoxCenterPoint({ x: boxCenterX, y: boxCenterY })
    }
  }, [])

  //#region Mouse
  // method to get the position of the pointer event relative to the center of the box
  const getPositionFromCenter = useCallback(
    (e: any) => {
      const fromBoxCenter = {
        x: e.clientX - boxCenterPoint.x,
        y: -(e.clientY - boxCenterPoint.y),
      }
      return fromBoxCenter
    },
    [boxCenterPoint]
  )

  const mouseDownHandler = (e: any): void => {
    e.stopPropagation()
    const fromBoxCenter = getPositionFromCenter(e)
    const newStartAngle =
      90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI)
    setStartAngle(newStartAngle)
    setIsActive(true)
  }

  const mouseUpHandler = useCallback(
    (e: any) => {
      // shoudl only be used if no inputs need to be handled
      // deselectAll();
      e.stopPropagation()
      if (isActive) {
        const newCurrentAngle = currentAngle + (angle - startAngle)
        setIsActive(false)
        setCurrentAngle(newCurrentAngle)
      }
    },
    [isActive, angle, currentAngle, startAngle]
  )

  const getNewProgress = (newAngle: number): number => {
    if (newAngle < 0) {
      return (Math.min(360 + newAngle, 352.8) / 360) * 100
    }
    return (Math.max(newAngle, 7.2) / 360) * 100
  }

  const mouseMoveHandler = useCallback(
    (e: any) => {
      if (isActive) {
        if (isSound) {
          playSelectorSound()
        }
        const fromBoxCenter = getPositionFromCenter(e)
        const newAngle =
          90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI)

        // another option for transforming Thumb holder
        // box.current.style.transform = `rotate(${currentAngle + (newAngle - (startAngle || 0))}deg)`;
        setRotateBoxTo(currentAngle + (newAngle - (startAngle || 0)))
        setAngle(newAngle)
        const newUnderOver = round(getNewProgress(newAngle), 2).toFixed(2)
        if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
          setWinChance(round(100 - getNewProgress(newAngle), 2).toFixed(2))
          setCashout(round(99 / (100 - getNewProgress(newAngle)), 4).toFixed(4))
          setrollOverUnder(newUnderOver)
        } else {
          setrollOverUnder(newUnderOver)
          setWinChance(getNewProgress(newAngle).toFixed(2))
          setCashout(round(99 / getNewProgress(newAngle), 4).toFixed(4))
        }
      }
    },
    [isActive, currentAngle, startAngle, getPositionFromCenter]
  )

  useEffect(() => {
    // in case the event ends outside the box
    window.onmouseup = mouseUpHandler
    window.onmousemove = mouseMoveHandler
  }, [mouseUpHandler, mouseMoveHandler])
  //#endregion

  //#region Touch
  const getPositionFromCenterTouch = useCallback(
    (e: any) => {
      const fromBoxCenter = {
        x: e.touches[0].clientX - boxCenterPoint.x,
        y: -(e.touches[0].clientY - boxCenterPoint.y),
      }
      return fromBoxCenter
    },
    [boxCenterPoint]
  )

  const touchStartHandler = (e: any): void => {
    e.stopPropagation()
    const fromBoxCenter = getPositionFromCenterTouch(e)
    const newStartAngle =
      90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI)
    setStartAngle(newStartAngle)
    setIsActive(true)
  }

  const touchEndHandler = useCallback(
    (e: any) => {
      // shoudl only be used if no inputs need to be handled
      // deselectAll();
      e.stopPropagation()
      if (isActive) {
        const newCurrentAngle = currentAngle + (angle - startAngle)
        setIsActive(false)
        setCurrentAngle(newCurrentAngle)
      }
    },
    [isActive, angle, currentAngle, startAngle]
  )

  const touchMoveHandler = useCallback(
    (e: any) => {
      if (isActive) {
        if (isSound) {
          playSelectorSound()
        }
        const fromBoxCenter = getPositionFromCenterTouch(e)
        const newAngle =
          90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI)
        // another option for transforming Thumb holder
        // box.current.style.transform = `rotate(${currentAngle + (newAngle - (startAngle || 0))}deg)`;
        setRotateBoxTo(currentAngle + (newAngle - (startAngle || 0)))
        setAngle(newAngle)
        const newUnderOver = round(getNewProgress(newAngle), 2).toFixed(2)
        if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
          setWinChance(round(100 - getNewProgress(newAngle), 2).toFixed(2))
          setCashout(round(99 / (100 - getNewProgress(newAngle)), 4).toFixed(4))
          setrollOverUnder(newUnderOver)
        } else {
          setrollOverUnder(newUnderOver)
          setWinChance(getNewProgress(newAngle).toFixed(2))
          setCashout(round(99 / getNewProgress(newAngle), 4).toFixed(4))
        }
      }
    },
    [isActive, currentAngle, startAngle, getPositionFromCenterTouch]
  )
  //#endregion

  useEffect(() => {
    const newAngleToRotate = 3.6 * numberRolled
    setRotateArrowTo(newAngleToRotate)
    controls.start('visible')
  }, [numberRolled])

  const getWheelWidth = (): string => {
    if (parentWidth <= 410) {
      return '240px'
    }
    if (parentWidth <= 510) {
      return '380px'
    }

    return '390px'
  }

  return (
    <DiceWheelWrapper style={{ maxWidth: getWheelWidth() }}>
      <NumberLimit
        small={resize}
        style={{ left: '50%', bottom: resize ? '98%' : '100%' }}
      >
        <span>0</span>
      </NumberLimit>
      <NumberLimit
        small={resize}
        style={{
          top: resize ? '44.5%' : '47.5%',
          left: resize ? '98%' : '102%',
        }}
      >
        <span>25</span>
      </NumberLimit>
      <NumberLimit
        small={resize}
        style={{ top: '102%', left: '50%', transform: 'translateX(-50%)' }}
      >
        <span>50</span>
      </NumberLimit>
      <NumberLimit
        small={resize}
        style={{
          top: resize ? '44.5%' : '47.5%',
          right: resize ? '98%' : '102%',
        }}
      >
        <span>75</span>
      </NumberLimit>
      <NumberLimit
        small={resize}
        style={{
          left: '50%',
          bottom: resize ? '98%' : '100%',
          transform: 'translateX(-100%)',
        }}
      >
        <span>100</span>
      </NumberLimit>
      <DiceWheelCircleV2
        stroke={10}
        progress={getNewProgress(rotateBoxTo)}
        frontColor={
          isRollOverOrUnder === DiceRollConditionEnum.Under
            ? '#01d180'
            : '#ff2c55'
        }
        backColor={
          isRollOverOrUnder === DiceRollConditionEnum.Under
            ? '#ff2c55'
            : '#01d180'
        }
      />
      <DiceWheelBorder />
      <DiceWheelArrow
        fill="#ffffff"
        style={{ transform: `rotate(${rotateArrowTo}deg)` }}
      />
      <DiceHolder style={{ transform: 'translate(-50%, -50%)' }}>
        <DiceShapeWrapper
          animate={controls}
          variants={ResultVariants}
          style={{
            color:
              (isRollOverOrUnder === DiceRollConditionEnum.Over &&
                numberRolled > round(rollOverUnder, 2)) ||
              (isRollOverOrUnder === DiceRollConditionEnum.Under &&
                numberRolled < round(rollOverUnder, 2))
                ? '#01d180'
                : '#ff2c55',
          }}
        >
          <Result>{numberRolled}</Result>
          <DiceShape width="100%" height="100%" stroke="currentColor" />
        </DiceShapeWrapper>
      </DiceHolder>
      <PositionHandler />
      <ThumbButtonWrapper
        ref={box}
        style={{ transform: `rotate(${rotateBoxTo}deg)` }}
      >
        <ThumbButton
          onMouseDown={!isMobile ? (e: any) => mouseDownHandler(e) : () => {}}
          onMouseUp={!isMobile ? (e: any) => mouseUpHandler(e) : () => {}}
          disabled={gameInProgress}
          onTouchStart={isMobile ? (e: any) => touchStartHandler(e) : () => {}}
          onTouchEnd={isMobile ? (e: any) => touchEndHandler(e) : () => {}}
          onTouchMove={isMobile ? (e: any) => touchMoveHandler(e) : () => {}}
        />{' '}
      </ThumbButtonWrapper>
      <Filler />
      <LeftFiller
        style={{
          opacity: '1',
          backgroundColor:
            isRollOverOrUnder === DiceRollConditionEnum.Under
              ? '#01d180'
              : '#ff2c55',
        }}
      />
      <RightFiller
        style={{
          opacity: '1',
          backgroundColor:
            isRollOverOrUnder === DiceRollConditionEnum.Under
              ? '#ff2c55'
              : '#01d180',
        }}
      />
    </DiceWheelWrapper>
  )
}

export default DiceWheel

const DiceWheelWrapper = styled.div`
  position: relative;
  width: 100%;

  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`

const DiceHolder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20%;
  height: 20%;
`
const DiceShapeWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
`

const Result = styled.span`
  font-family: 'Open Sans',serif;
  font-size: 19.2px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  position: absolute;
  width: 10ch;
  top: 50%;
  left: 50%;
  text-align: center;
  font-weight: 600;
  transition-property: transform, opacity;
  transition-duration: 300ms;
  transform: translate(-50%, -50%);
`

const PositionHandler = styled.div`
  position: absolute;
  top: calc(10% + 18px);
  left: calc(10% + 18px);
  width: calc(80% - 36px);
  height: calc(80% - 36px);
`

const ThumbButtonWrapper = styled.div`
  z-index: 15;
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
`

const ThumbButton = styled.button`
  position: absolute;
  top: -5%;
  left: 50%;
  transform: translate(-50%, 0px);
  width: 12%;
  height: 9%;
  cursor: pointer;

  font-weight: 600;
  font-size: inherit;
  touch-action: manipulation;
  position: relative;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 2px 0px;
  border-radius: 0.25rem;

  background-image: url(${'/src/assets/images/gameSection/Dice/ThumbArrows.svg'});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;

  &:disabled {
    cursor: pointer;
  }

  &:active {
    cursor: pointer;
  }
`

const Filler = styled.div`
  background-color: #334284;
  position: absolute;
  width: 5%;
  height: 5%;
  left: 47.48%;
  top: 7%;
  z-index: 9;
`

const LeftFiller = styled.div`
  position: absolute;
  width: 2.329%;
  height: 2.329%;
  left: 51.3%;
  top: 8.197%;
  z-index: 9;
  border-radius: 50%;
`

const RightFiller = styled.div`
  position: absolute;
  width: 2.329%;
  height: 2.329%;
  left: 46.3%;
  top: 8.19%;
  z-index: 9;
  /* border-bottom-left-radius: 50%; */
  /* border-top-left-radius: 50%; */
  border-radius: 50%;
`

const NumberLimit = styled.div<{ small: boolean }>`
  position: absolute;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-family: 'Open Sans',serif;
  font-size: ${(props): string => (props.small ? '10px' : '14.4px')};
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  border-radius: 4.8px;
  border: solid 1.2px #2a335b;
  background-color: #111a41;
  padding: 1px 5px;
  width: 4ch;
  flex-shrink: 0;

  & span {
    white-space: nowrap;
  }
`
