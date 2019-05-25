import Store from './Store'
import { settings } from './settings'
import { easing } from './utils'
import { DIRECTION, movePlaygroundToCoordinates } from './move'
import Player from './Player'

export default class Game {
  constructor() {
    Store.setPlayer(new Player())
    this.isAnimationActive = false
  }

  start() {
    this.isAnimationActive = true
    window.requestAnimationFrame(timestamp => this.loop(timestamp))
  }

  stop() {
    this.isAnimationActive = false
  }

  loop(timestamp) {
    if (this.isAnimationActive) {
      window.requestAnimationFrame(timestamp => this.loop(timestamp))
    }

    const start = performance.now()

    if (Store.isPlayerMoving()) {
      this.movePlayer(timestamp)
    }

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

  moveEnemy(enemy, timestemp) {
    if (enemy.hasOwnProperty('movement')) {
      // moving
      // TODO calculate new enemy coordinates
      // TODO calculate relative position to player coordinates
    } else {
      // not moving
      // TODO calculate relative position to player coordinates

      const { x, y } = Store.getCoordinates()
      const { x: enemyX, y: enemyY } = enemy

      const diffX = x - enemyX
      const diffY = y - enemyY

      const playgroundWidth = Store.getPlaygroundWidth()
      const halfPlaygroundWidth = playgroundWidth / 2
      const distance = settings.movementGrid * playgroundWidth

      const left = distance * diffX + halfPlaygroundWidth
      const top = distance * diffY + halfPlaygroundWidth

      enemy.element.style.left = `${left}px`
      enemy.element.style.top = `${top}px`
      //   console.log('diff', diffX, diffY, left, top)
    }
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
        y += distanceToMove
        break

      case DIRECTION.south:
        y -= distanceToMove
        break

      case DIRECTION.east:
        x -= distanceToMove
        break

      case DIRECTION.west:
        x += distanceToMove
        break
    }

    movePlaygroundToCoordinates(x, y)

    if (isAnimationFinished) {
      Store.resetMovementDirection()
      console.log('animation finished', Store.state.player.coordinates)
    }
  }
}
