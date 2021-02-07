import { ActionBase } from '../actions'
import { SOCKET } from '../constants'
import * as settings from '../settings'

// TODO: should negotiate a "master" DM (and get rid of setting)

function createChannel<T extends string, A extends ActionBase<T>>(
  type: T,
  receiver: (action: Omit<A, 'type'>) => Promise<boolean>,
) {
  const { socket } = game


  socket.on(SOCKET, (action: A) => {
    if (action.type === type && game.user.id === settings.getPrimaryDm()) {
      receiver(action)
    }
  })

  function act(action: Omit<A, 'type'>): void {
    if (game.user.id === settings.getPrimaryDm()) {
      receiver(action)
    } else {
      socket.emit(SOCKET, { ...action, type })
    }
  }

  return act
}

export default createChannel
