import Store from './Store'
import { usersChanged, getEnemies } from './apollo'
import { getCurrentTimestamp } from './utils'

export const loadEnemies = async () => {
  await getEnemies(Store.getPlayerId())
    .then(result => {
      console.log('enemies loaded', result.data.enemies)

      const enemies = result.data.enemies
      const timestamp = getCurrentTimestamp()

      for (let i = 0, l = enemies.length; i < l; i++) {
        // TODO timestamp necessary here?
        Store.setEnemy(enemies[i], timestamp)
      }

      subscribeUserChanges()
    })
    .catch(err => console.log('load enemies error', err))
}

const subscribeUserChanges = () => {
  usersChanged(Store.getPlayerId()).subscribe({
    next(result) {
      Store.setEnemy(result.data.userChanged, getCurrentTimestamp())
    },
    error(err) {
      console.log('subscription error', err)
    },
  })
}
