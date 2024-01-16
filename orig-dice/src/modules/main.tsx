import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import DiceBoard from 'components/dice-board'
import DiceSidebar from 'components/dice-sidebar'
import DiceContextProvider from 'components/dice-context'
import { useDimensions } from 'hooks/useDimensions'
import { useTranslation } from 'react-i18next'

export function MainModule(props: any): JSX.Element {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const token = searchParams.get('token')
  const lang = searchParams.get('lang') || 'en'

  const { ref, dimensions } = useDimensions()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang)
      localStorage.setItem('currentLang', lang)
    }
  }, [lang])

  const getHeight = (): string => {
    if (dimensions.width > 810) return '575px'
    if (dimensions.width <= 750) return 'auto'
    return '575px'
  }

  return (
    // @ts-ignore
    <DiceContextProvider>
      <Wrapper ref={ref} $mobile={dimensions.width <= 750}>
        <MainGameBoardWrapper
          $mobile={dimensions.width <= 750}
          style={{ minHeight: getHeight() }}
        >
          <DiceBoard />
        </MainGameBoardWrapper>
        <DiceSidebar changeLayout={false} />
      </Wrapper>
    </DiceContextProvider>
  )
}

const MainGameBoardWrapper = styled.div<{ $mobile: boolean }>`
  width: 100%;
  max-width: ${(props: { $mobile: any }): string =>
    props.$mobile ? '500px' : '100%'};
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  align-self: center;
  -webkit-box-flex: 1;
  flex-grow: 1;
  user-select: none;
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  /* border: solid 1px #313d6b; */
  border: solid 1px #2c3763;
  /* background-color: #222c56; */
  background-color: #222c5599;
  margin-right: ${(props: { $mobile: any }): string =>
    props.$mobile ? '0' : '15px'};
  margin-bottom: ${(props: { $mobile: any }): string =>
    props.$mobile ? '8px' : '0'};
`

const Wrapper = styled.div<{ $mobile: boolean }>`
  display: flex;
  -webkit-box-flex: 1;
  flex-grow: 1;
  background-color: rgb(17, 26, 65);
  width: 100%;
  min-width: 300px;
  flex-direction: ${(props: { $mobile: any }): string =>
    props.$mobile ? 'column' : 'row'};
  align-items: ${(props: { $mobile: any }): string =>
    props.$mobile ? 'center' : 'initial'};
  padding: 0px;
`
