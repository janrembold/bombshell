import './styles.scss'
import Store from './Store'
import Player from './Player'

// TODO
// - Start Button

// - Apollo Request mit Timestamp
// - Timestamp von Server einbeziehen
// - move enemies
// - throw bomb

// - window.addEventListener('resize', setDimension)
// - add mobile flexbox layout
// - create landing page with player name
// -

const playground = document.querySelector('.playground')
const playButton = document.querySelector('.playButton')

Store.setPlaygroundElement(playground)
Store.setPlaygroundWidth()
// TODO add listener for width changes e.g. orientation change

Store.setPlayer(new Player())

playButton.addEventListener('click', async () => {
  await Store.getPlayer().startGame()
})
