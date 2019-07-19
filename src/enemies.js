import Store from './Store'
import { usersChanged, getEnemies } from './apollo'
import { getCurrentTimestamp, isUserOffline } from './utils'

export const loadEnemies = async () => {
  await getEnemies(Store.getPlayerId())
    .then(result => {
      console.log('enemies loaded', result.data.enemies)

      const enemies = result.data.enemies
      const timestamp = getCurrentTimestamp()

      for (let i = 0, l = enemies.length; i < l; i++) {
        // TODO timestamp necessary here?
        console.log('set enemy', enemies[i])
        Store.setEnemy(enemies[i], timestamp)
      }

      subscribeUserChanges()
    })
    .catch(err => console.log('load enemies error', err))
}

const subscribeUserChanges = () => {
  usersChanged().subscribe({
    next(result) {
      console.log('userChanged', result.data.userChanged)
      const { id, x, y } = result.data.userChanged

      if (Store.getPlayerId() === id) {
        if (isUserOffline(result.data.userChanged)) {
          Store.resetCoordinates()
          Store.getPlayer().stop()
        } else {
          Store.setCoordinates(x, y)
        }
      } else {
        Store.setEnemy(result.data.userChanged, getCurrentTimestamp())
      }
    },
    error(err) {
      console.log('subscription error', err)
    },
  })
}
