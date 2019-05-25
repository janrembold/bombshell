import { getViewportWidth } from './utils'
import Store from './Store'
import { settings } from './settings'

export const DIRECTION = {
  north: 1,
  east: 2,
  south: 3,
  west: 4,
}

export const getDirection = (x, y) => {
  const width = getViewportWidth()

  if (x > y) {
    return x > width - y ? DIRECTION.east : DIRECTION.north
  } else {
    return y > width - x ? DIRECTION.south : DIRECTION.west
  }
}

export const setDirection = direction => {
  console.log('todo: start settings x or y coordinates')
  Store.setCoordinates(666, 3)
}

export const getBackgroundPositionFromCoordinates = (x, y) => {
  const playgroundWidth = Store.getPlaygroundWidth()
  return {
    backgroundX: playgroundWidth * settings.movementGrid * x,
    backgroundY: playgroundWidth * settings.movementGrid * y,
  }
}

export const movePlaygroundToCoordinates = (x, y) => {
  const playgroundElement = Store.getPlaygroundElement()
  const { backgroundX, backgroundY } = getBackgroundPositionFromCoordinates(
    x,
    y,
  )

  playgroundElement.style.backgroundPositionX = `${backgroundX}px`
  playgroundElement.style.backgroundPositionY = `${backgroundY}px`

  Store.setCoordinates(x, y)
}

export const getTargetCoordinatesForDirection = direction => {
  let { x, y } = Store.getCoordinates()

  switch (direction) {
    case DIRECTION.north:
      y -= 1
      break

    case DIRECTION.east:
      x += 1
      break

    case DIRECTION.south:
      y += 1
      break

    case DIRECTION.west:
      x -= 1
      break

    default:
    // TODO error message for unknown direction
  }

  return { x, y }
}
