import { addEnemyElement } from './htmlElement'

class Store {
  constructor() {
    this.state = {
      game: null,
      player: {
        id: null,
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
        },
      },
      // the games' playground
      playground: {
        element: null,
        width: null,
      },
      // all enemies
      enemies: {
        // 123: {
        //   user: {
        //     id: 123,
        //     x: 0,
        //     y: 0,
        //   },
        //   element: null,
        //   movement: {
        //     direction: null,
        //     start: {
        //       x: 0,
        //       y: 0,
        //       timestamp: null,
        //     },
        //   },
        // },
      },
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

  getGame() {
    return this.state.game
  }

  setGame(game) {
    this.state.game = game
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

  getEnemies() {
    return this.state.enemies
  }

  setEnemy(enemy, timestamp) {
    if (this.state.enemies.hasOwnProperty(enemy.id)) {
      let existingEnemy = this.state.enemies[enemy.id]
      const {
        user: { x, y },
      } = existingEnemy
      const positionDidNotChange = x === enemy.x && y === enemy.y

      if (positionDidNotChange) {
        return
      }

      this.state.enemies[enemy.id] = {
        ...existingEnemy,
        movement: {
          direction: enemy.direction,
          start: { x, y, timestamp },
        },
        user: {
          ...enemy,
        },
      }
    } else {
      this.state.enemies[enemy.id] = {
        user: enemy,
        element: addEnemyElement(this.getPlaygroundElement()),
      }
    }
  }

  setEnemyCoordinates(id, x, y) {
    this.state.enemies[id].user.x = x
    this.state.enemies[id].user.y = y
  }

  resetEnemyMovement(id) {
    delete this.state.enemies[id].movement
  }

  hasEnemies() {
    return Object.entries(this.state.enemies).length > 0
  }
}

export default new Store()
