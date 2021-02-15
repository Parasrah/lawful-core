import { ActionBase } from '../actions'
import { SOCKET } from '../constants'
import * as settings from '../settings'

function createChannel<T extends string, A extends ActionBase<T>, R = void>(
  type: T,
  receiver: (action: Omit<A, 'type'>) => Promise<R>,
) {
  const { socket } = game

  socket.on(SOCKET, async (action: A, cb: (response: R) => void) => {
    if (action.type === type && game.user.id === settings.getPrimaryDm()) {
      const response = await receiver(action)
      cb(response)
    }
  })

  function act(action: Omit<A, 'type'>): Promise<R> {
    return new Promise((resolve) => {
      if (game.user.id === settings.getPrimaryDm()) {
        resolve(receiver(action))
      } else {
        socket.emit(SOCKET, { ...action, type }, (res: R) => {
          resolve(res)
        })
      }
    })
  }

  return act
}

export default createChannel
