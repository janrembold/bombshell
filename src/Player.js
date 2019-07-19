import Hammer from 'hammerjs'
import {
  getDirection,
  movePlaygroundToCoordinates,
  getTargetCoordinatesForDirection,
} from './move'
import { getUser, persistPlayerMove, initPlayer } from './apollo'
import Store from './Store'
import {
  getCurrentTimestamp,
  setUserIdToLocaleStorage,
  isUserOffline,
} from './utils'
import { loadEnemies } from './enemies'
import Game from './game'

export default class Player {
  constructor() {
    console.log('init player')
    this.loadUser()
  }

  async loadUser() {
    await getUser()
      .then(async result => {
        console.log('Player created, ID = ', result.data.user)
        const { id, x, y } = result.data.user
        this.id = id

        Store.setPlayerId(id)
        setUserIdToLocaleStorage(id)

        await loadEnemies()

        Store.setGame(new Game())
        Store.getPlaygroundElement().classList.add('playground--loaded')

        if (!isUserOffline(result.data.user)) {
          Store.setCoordinates(x, y)
          this.start()
        }
      })
      .catch(error => console.log('getUser error', error))
  }

  async startGame() {
    console.log('init player', Store.getPlayerId())

    initPlayer(Store.getPlayerId())
      .then(result => {
        console.log('start game', result.data.start, result)

        const { x, y } = result.data.start
        Store.setCoordinates(x, y)
        this.start()
      })
      .catch(error => console.log('initPlayer error', error))
  }

  start() {
    const { x, y } = Store.getCoordinates()
    if (isUserOffline({ x, y })) {
      console.warn("Can't start game - player coordinates not set", Store.state)
      return
    }

    movePlaygroundToCoordinates(x, y)

    this.addPlayerToPlayground()
    this.initMovementEvents()

    document.querySelector('body').classList.add('playing')
  }

  stop() {
    document.querySelector('body').classList.remove('playing')
    this.removeMovementEvents()
  }

  addPlayerToPlayground() {
    if (!this.playerElement) {
      this.playerElement = document.createElement('div')
      this.playerElement.className = 'player'

      Store.getPlaygroundElement().appendChild(this.playerElement)
      Store.setPlayerElement(this.playerElement)
    }
  }

  removeMovementEvents() {
    if (this.hammer) {
      this.hammer.off('swipe tap')
    }
  }

  initMovementEvents() {
    this.hammer = new Hammer(Store.getPlaygroundElement())

    this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL })
    this.hammer.on('swipe tap', event => {
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

          console.log('state', Store.state)
          break

        case 'swipe':
          // TODO throw bomb
          console.log('you swiped - throw a bomb')
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
