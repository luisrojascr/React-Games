export enum MinesStateActionsEnum {
  SET_GAME_STATE = 'SET_GAME_STATE',
  SET_RANDOM_TILE = 'SET_RANDOM_TILE',
  SET_TILE_STATE = 'SET_TILE_STATE',
  SET_TILES_STATE_ENDED = 'SET_TILES_STATE_ENDED',
  INITIALIZE_GAME = 'INIT_GAME',
  SET_ANIMATING_TILE = 'SET_ANIMATING_TILE',
  SET_TILE_CLICKED = 'SET_TILE_CLICKED',
  SET_GEMS_NUM = 'SET_GEMS_NUM',
  NEXT_TILE_PROFIT = 'NEXT_TILE_PROFIT',
  SHOW_AMOUNT_WIN_CASHOUT = 'SHOW_AMOUNT_WIN_CASHOUT',
  SET_BOARD_ON_GAME_START = 'SET_BOARD_ON_GAME_START',
  SET_BOARD_ON_GAME_END = 'SET_BOARD_ON_GAME_END',
  SET_CHECKED_GAME_STATE = 'SET_CHECKED_GAME_STATE'
}

export enum MinesBoardStatesEnum {
  INIT = 'INIT',
  IN_PROGRESS_NOT_STARTED = 'IN_PROGRESS_NOT_STARTED',
  IN_PROGRESS_STARTED = 'IN_PROGRESS_STARTED',
  ENDED_WON = 'ENDED_WON',
  ENDED_LOST = 'ENDED_LOST'
}

export enum TileStateEnum {
  Revealed = 'REVEALED',
  UserRevealed = 'USERREVEALED',
  Hidden = 'HIDDEN'
}

export interface TileState {
  id: number
  index: number
  isMine: boolean | undefined
  state: TileStateEnum
}

export interface MinesState {
  boardState: MinesBoardStatesEnum
  tilesState: TileState[]
  profitOnNextTile: number
  totalProfit: number
  animatingTile: boolean
  randomTileId: number
  gemsNum: number
  nextPayoutMultiplier: number
  totalPayoutMultiplier: number
  tileClicked: number | null
  currency: string
}

export type Action =
  | {
      type: MinesStateActionsEnum.SET_ANIMATING_TILE
      payload: boolean
    }
  | {
      type: MinesStateActionsEnum.SET_GEMS_NUM
      payload: number
    }
  | { type: MinesStateActionsEnum.SET_BOARD_ON_GAME_START; payload: number }
  | {
      type: MinesStateActionsEnum.INITIALIZE_GAME
      payload: null
    }
  | {
      type: MinesStateActionsEnum.SET_TILES_STATE_ENDED
      payload: null
    }
  | {
      type: MinesStateActionsEnum.SET_TILE_STATE
      payload: {
        tileId: number
        tileState: TileState
      }
    }
  | {
      type: MinesStateActionsEnum.SET_GAME_STATE
      payload: MinesBoardStatesEnum
    }
  | {
      type: MinesStateActionsEnum.SET_RANDOM_TILE
      payload: number
    }
  | {
      type: MinesStateActionsEnum.NEXT_TILE_PROFIT
      payload: {
        nextPayoutMultiplier: number
        totalPayoutMultiplier: number
      }
    }
  | {
      type: MinesStateActionsEnum.SET_TILE_CLICKED
      payload: number
    }
  | {
      type: MinesStateActionsEnum.SHOW_AMOUNT_WIN_CASHOUT
      payload: {
        totalPayoutMultiplier: number
        currency: string
        totalProfit: number
      }
    }
  | {
      type: MinesStateActionsEnum.SET_BOARD_ON_GAME_END
      payload: {
        boardState: MinesBoardStatesEnum
        totalPayoutMultiplier: number
        currency: string
        amountWon: number
      }
    }
  | {
      type: MinesStateActionsEnum.SET_CHECKED_GAME_STATE
      payload: {
        boardState: MinesBoardStatesEnum
        totalPayoutMultiplier: number
        nextPayoutMultiplier: number
        gemsNumber: number
      }
    }

export interface MineTileProps {
  data?: any
  value?: number
  onMineClickCallback?: () => void
  isGameOver?: boolean
  isMine: boolean | undefined
  index: number
  id: number
  tileState: TileStateEnum
  handleTileClick?: (i: number) => void
}
