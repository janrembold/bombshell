import './styles.scss'
import Game from './game'
import Store from './Store'
import { getCurrentTimestamp, getRandomInt } from './utils'

// TODO
// - GraphQl -> enemy endpoint

// - Apollo Request mit Timestamp
// - Timestamp von Server einbeziehen
// - move enemies
// - throw bomb

// - window.addEventListener('resize', setDimension)
// - add mobile flexbox layout
// - create landing page with player name
// -

const playground = document.querySelector('.playground')
Store.setPlaygroundElement(playground)
Store.setPlaygroundWidth()
// TODO add listener for width changes e.g. orientation change

const game = new Game()
game.start()
