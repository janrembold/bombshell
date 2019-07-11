export const addEnemyElement = playground => {
  const enemyElement = document.createElement('div')
  enemyElement.className = 'enemy'

  playground.appendChild(enemyElement)

  return enemyElement
}
