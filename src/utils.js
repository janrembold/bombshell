export const getCurrentTimestamp = () => performance.now()

export const getViewportWidth = () =>
  window.innerWidth || document.documentElement.clientWidth

export const easing = (t, b, c, d) => {
  //   return ((c - b) * t) / d // linear

  return c * Math.sin((t / d) * (Math.PI / 2)) + b // easeOutSine

  // return (t /= d / 2) < 1
  //   ? (c / 2) * t * t + b
  //   : (-c / 2) * (--t * (t - 2) - 1) + b // easeInOutQuad

  // return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b // easeInSine
  // return -c * (t /= d) * (t - 2) + b // swing
  // return c * (t /= d) * t + b // easeInQuad
}

export const getRandomInt = (min, max) => {
  const ceiledMin = Math.ceil(min)
  const ceiledMax = Math.floor(max)
  return Math.floor(Math.random() * (ceiledMax - ceiledMin)) + ceiledMin
}

export const setUserIdToLocaleStorage = id => localStorage.setItem('id', id)
export const getUserIdFromLocaleStorage = () => localStorage.getItem('id')

// export const getDirectionFromCoordinates = () => {
//   return 666 //DIRECTION.north
// }

export const isUserOffline = user => user.x === null || user.y === null
