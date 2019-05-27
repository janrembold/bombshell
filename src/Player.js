import Hammer from 'hammerjs'
import {
  getDirection,
  movePlaygroundToCoordinates,
  getTargetCoordinatesForDirection,
} from './move'
import { getUser, persistPlayerMove, getEnemies, userChanged } from './apollo'
import Store from './Store'
import { getCurrentTimestamp, setUserIdToLocaleStorage } from './utils'

export default class Player {
  constructor() {
    this.loadUser()
  }

  async loadUser() {
    await getUser()
      .then(async result => {
        console.log('Player created', result.data.user)

        const { id, x, y } = result.data.user

        this.id = id
        setUserIdToLocaleStorage(id)
        storePlayerData(result)
        movePlaygroundToCoordinates(x, y)
        Store.getPlaygroundElement().classList.add('playground--loaded')

        this.loadEnemies()
        userChanged(id).subscribe({
          next(result) {
            console.log('next', userChanged)
            Store.setEnemy(result.data.userChanged)
          },
          error(err) {
            console.log('error', err)
          },
        })

        this.startGame()
      })
      .catch(error => console.log('getUser error', error))
  }

  async loadEnemies() {
    await getEnemies(Store.getPlayerId()).then(result => {
      const enemies = result.data.enemies
      for (let i = 0, l = enemies.length; i < l; i++) {
        Store.setEnemy(enemies[i])
      }
    })
  }

  startGame() {
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

const storePlayerData = result => {
  const { id, x, y } = result.data.user

  Store.setPlayerId(id)
  Store.setCoordinates(x, y)
}
