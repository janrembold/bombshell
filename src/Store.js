import { getCurrentTimestamp } from './utils'

class Store {
  constructor() {
    this.state = {
      player: {
        // the player class object
        object: null,
        // live coordinates of player
        coordinates: {
          x: null,
          y: null,
        },
        // data for each single player movement
        movement: {
          direction: null,
          confirmed: true,
          start: {
            x: null,
            y: null,
            timestamp: null,
          },
          target: { x: null, y: null },
        },
      },
      // the games' playground
      playground: {
        element: null,
        width: null,
      },
      // all enemies
      enemies: {},
    }
  }

  getPlayerId() {
    return this.state.player.id
  }

  setPlayerId(id) {
    this.state.player.id = id
  }

  getPlayer() {
    return this.state.player.object
  }

  setPlayer(player) {
    this.state.player.object = player
  }

  getPlaygroundElement() {
    return this.state.playground.element
  }

  setPlaygroundElement(element) {
    // const { backgroundPositionX, backgroundPositionY } = element.style

    this.state.playground.element = element
    // this.state.playground.coordinates.x = backgroundPositionX
    // this.state.playground.coordinates.y = backgroundPositionY
  }

  setPlaygroundWidth() {
    this.state.playground.width = this.state.playground.element.clientWidth
  }

  getPlaygroundWidth() {
    return this.state.playground.width
  }

  getPlayerElement() {
    return this.state.player.element
  }

  setPlayerElement(element) {
    this.state.player.element = element
  }

  getCoordinates() {
    return { ...this.state.player.coordinates }
  }

  setCoordinates(x, y) {
    this.state.player.coordinates.x = x
    this.state.player.coordinates.y = y
  }

  isPlayerMoving() {
    return !!this.state.player.movement.direction
  }

  isPlayerMovementConfirmed() {
    return this.state.player.movement.confirmed
  }

  getPlayerDirection() {
    return this.state.player.movement.direction
  }

  getMovementStartTimestamp() {
    return this.state.player.movement.start.timestamp
  }

  setMovement(direction, targetX, targetY, timestamp) {
    const { x, y } = this.state.player.coordinates

    this.state.player.movement.direction = direction
    this.state.player.movement.confirmed = false

    this.state.player.movement.start.timestamp = timestamp
    this.state.player.movement.start.x = x
    this.state.player.movement.start.y = y
    this.state.player.movement.target.x = targetX
    this.state.player.movement.target.y = targetY
  }

  confirmMovement() {
    this.state.player.movement.confirmed = true
    this.getPlayer().updateStatus()
  }

  resetMovementDirection() {
    this.state.player.movement.direction = null
    this.getPlayer().updateStatus()
  }

  getBackgroundStartPosition() {
    return { ...this.state.player.movement.startCoordinates }
  }

  getMovementStartCoordinates() {
    return { ...this.state.player.movement.start }
  }

  getMovementTargetCoordinates() {
    return { ...this.state.player.movement.target }
  }

  getEnemies() {
    return this.state.enemies
  }

  setEnemy(enemy, timestamp) {
    if (this.state.enemies.hasOwnProperty(enemy.id)) {
      const existingEnemy = this.state.enemies[enemy.id]
      existingEnemy.movement = {
        start: {
          x: existingEnemy.x,
          y: existingEnemy.y,
          timestamp: timestamp,
        },
        target: {
          x: enemy.x,
          y: enemy.y,
        },
      }
    } else {
      const enemyElement = document.createElement('div')
      enemyElement.className = 'enemy'
      this.getPlaygroundElement().appendChild(enemyElement)

      this.state.enemies[enemy.id] = {
        ...enemy,
        element: enemyElement,
      }
    }
  }

  hasEnemies() {
    return Object.entries(this.state.enemies).length > 0
  }
}

export default new Store()
