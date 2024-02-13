import React, { createContext, useContext, useState, useEffect } from 'react'

export enum Orientations {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSPACE',
}

export interface WindowDimensions {
  height: number | undefined
  width: number | undefined
  orientation: Orientations | undefined
}

export interface WindowSize {
  windowSize: WindowDimensions
  isMobile: boolean | undefined
}

const BreakPoints = {
  mobile: 979,
}

export const WindowDimensionsCtx = createContext({} as WindowSize)

const WindowDimensionsProvider = ({ children }: any): JSX.Element => {
  const isClient = typeof window === 'object'

  const getSize = (): WindowDimensions => ({
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
    // eslint-disable-next-line no-nested-ternary
    orientation: isClient
      ? window.innerHeight > window.innerWidth
        ? Orientations.PORTRAIT
        : Orientations.LANDSCAPE
      : undefined,
  })

  const [windowSize, setWindowSize] = useState<WindowDimensions>(getSize())
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize.width < BreakPoints.mobile && !isMobile) {
        setIsMobile(true)
      } else if (windowSize.width > BreakPoints.mobile && isMobile) {
        setIsMobile(false)
      }
    }
  }, [windowSize.width])

  useEffect((): any => {
    const setSize = (): void => {
      setWindowSize(getSize())
    }

    if (!isClient) {
      return false
    }
    // timeoutId for debounce mechanism
    let timeoutId: any = null
    const resizeListener = (): void => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId)
      // change width from the state object after 50 milliseconds
      timeoutId = setTimeout(() => setSize(), 50)
    }
    // set resize listener
    window.addEventListener('resize', resizeListener)

    // clean up function
    return (): void => {
      // remove resize listener
      window.removeEventListener('resize', resizeListener)
    }
  }, [])

  return (
    <WindowDimensionsCtx.Provider value={{ windowSize, isMobile }}>
      {children}
    </WindowDimensionsCtx.Provider>
  )
}

export default WindowDimensionsProvider

export const useWindowDimensions = () => useContext(WindowDimensionsCtx)
