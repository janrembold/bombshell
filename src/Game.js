import Store from './Store'
import { settings } from './settings'
import { easing } from './utils'
import { DIRECTION, movePlaygroundToCoordinates } from './move'

const setEnemyPosition = (enemy, left, top) => {
  enemy.element.style.left = `${left}px`
  enemy.element.style.top = `${top}px`
}

export default class Game {
  constructor() {
    this.startLoop()
  }

  startLoop() {
    this.isLoopActive = true
    window.requestAnimationFrame(timestamp => this.loop(timestamp))
  }

  loop(timestamp) {
    if (this.isLoopActive) {
      window.requestAnimationFrame(timestamp => this.loop(timestamp))
    }

    const start = performance.now()

    // TODO check if async calculation is better
    if (Store.isPlayerMoving()) {
      this.movePlayer(timestamp)
    }

    // // TODO check if async calculation is better
    if (Store.hasEnemies()) {
      this.moveEnemies(timestamp)
    }

    // TODO remove for production
    const duration = performance.now() - start
    const warnDuration = 1
    if (duration > warnDuration) {
      console.warn(`loop duration > ${warnDuration}ms`, duration)
    }
  }

  moveEnemies(timestamp) {
    const enemies = Store.getEnemies()
    const keys = Object.keys(enemies)

    for (let i = 0, l = keys.length; i < l; i++) {
      this.moveEnemy(enemies[keys[i]], timestamp)
    }
  }

  moveEnemy(enemy, timestamp) {
    if (enemy.hasOwnProperty('movement')) {
      this.calculateMovingEnemyCoordinates(enemy, timestamp)
    }

    this.setEnemyPosition(enemy)
  }

  calculateMovingEnemyCoordinates(enemy, timestamp) {
    const {
      user: { id },
      movement: {
        direction,
        start: { x, y, timestamp: startTimestamp },
      },
    } = enemy
    const startTime = startTimestamp
    const endTime = startTime + settings.movementDurationMs
    const currentTime = timestamp - startTime
    const isAnimationFinished = timestamp >= endTime
    let newX = x
    let newY = y

    const distanceToMove = isAnimationFinished
      ? 1
      : easing(currentTime, 0, 1, settings.movementDurationMs)

    switch (direction) {
      case DIRECTION.north:
        newY -= distanceToMove
        break
      case DIRECTION.south:
        newY += distanceToMove
        break
      case DIRECTION.east:
        newX += distanceToMove
        break
      case DIRECTION.west:
        newX -= distanceToMove
        break
    }

    Store.setEnemyCoordinates(id, newX, newY)

    if (isAnimationFinished) {
      Store.resetEnemyMovement(id)
      console.log('enemy animation finished', enemy)
    }
  }

  setEnemyPosition(enemy) {
    const { x, y } = Store.getCoordinates()
    const { x: enemyX, y: enemyY } = enemy.user

    const diffX = enemyX - x
    const diffY = enemyY - y

    const playgroundWidth = Store.getPlaygroundWidth()
    const halfPlaygroundWidth = playgroundWidth / 2
    const distance = settings.movementGrid * playgroundWidth

    const left = distance * diffX + halfPlaygroundWidth
    const top = distance * diffY + halfPlaygroundWidth

    setEnemyPosition(enemy, left, top)
  }

  movePlayer(timestamp) {
    // TODO performance refactoring
    const direction = Store.getPlayerDirection()
    const startTime = Store.getMovementStartTimestamp()
    const endTime = startTime + settings.movementDurationMs
    const currentTime = timestamp - startTime
    const isAnimationFinished = timestamp >= endTime

    let { x, y } = Store.getMovementStartCoordinates()
    const distanceToMove = isAnimationFinished
      ? 1
      : easing(currentTime, 0, 1, settings.movementDurationMs)

    switch (direction) {
      case DIRECTION.north:
        y -= distanceToMove
        break

      case DIRECTION.south:
        y += distanceToMove
        break

      case DIRECTION.east:
        x += distanceToMove
        break

      case DIRECTION.west:
        x -= distanceToMove
        break
    }

    movePlaygroundToCoordinates(x, y)

    if (isAnimationFinished) {
      Store.resetMovementDirection()
      console.log('animation finished', Store.state.player.coordinates)
    }
  }
}
