import Hammer from 'hammerjs'
import {
  getDirection,
  movePlaygroundToCoordinates,
  getTargetCoordinatesForDirection,
} from './move'
import { getUser, persistPlayerMove, initPlayer } from './apollo'
import Store from './Store'
import { getCurrentTimestamp, setUserIdToLocaleStorage } from './utils'
import { loadEnemies } from './enemies'
import Game from './game'

export default class Player {
  constructor() {
    this.loadUser()
  }

  async loadUser() {
    await getUser()
      .then(async result => {
        console.log('Player created, ID = ', result.data.user)
        const { id } = result.data.user
        this.id = id

        Store.setPlayerId(id)
        setUserIdToLocaleStorage(id)

        await loadEnemies()

        Store.setGame(new Game())
        Store.getPlaygroundElement().classList.add('playground--loaded')
      })
      .catch(error => console.log('getUser error', error))
  }

  async startGame() {
    console.log('start game')

    await initPlayer(Store.getPlayerId())
      .then(result => {
        const { x, y } = result.data.start
        Store.setCoordinates(x, y)
        this.start()
      })
      .catch(error => console.log('initPlayer error', error))
  }

  start() {
    const { x, y } = Store.getCoordinates()
    if (!x || !y) {
      console.warn("Can't start game - player coordinates not set")
      return
    }

    movePlaygroundToCoordinates(x, y)

    this.addPlayerToPlayground()
    this.initMovementEvents()
  }

  addPlayerToPlayground() {
    const playerElement = document.createElement('div')
    playerElement.className = 'player'

    Store.getPlaygroundElement().appendChild(playerElement)
    Store.setPlayerElement(playerElement)
  }

  initMovementEvents() {
    const hammer = new Hammer(Store.getPlaygroundElement())

    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL })
    hammer.on('swipe tap', event => {
      event.preventDefault()

      const pointer = event.pointers[0]
      const offsetX = pointer.pageX - pointer.target.offsetLeft
      const offsetY = pointer.pageY - pointer.target.offsetTop

      // console.log('event', event)

      switch (event.type) {
        case 'tap':
          if (Store.isPlayerMoving()) {
            break
          }

          const direction = getDirection(offsetX, offsetY)
          const { x: targetX, y: targetY } = getTargetCoordinatesForDirection(
            direction,
          )

          Store.setMovement(direction, targetX, targetY, getCurrentTimestamp())

          persistPlayerMove(this.id, direction).then(result => {
            // TODO check target coordinates
            // console.log('persistPlayerMove', result.data.move)
            Store.confirmMovement()
          })

          // console.log('state', Store.state)
          break

        case 'swipe':
          // TODO throw bomb
          break
      }
    })
  }

  updateStatus() {
    if (Store.isPlayerMoving() || !Store.isPlayerMovementConfirmed()) {
      Store.getPlayerElement().classList.add('player_active')
    } else {
      Store.getPlayerElement().classList.remove('player_active')
    }
  }
}
