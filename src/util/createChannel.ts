import {
  Action,
  ActionBase,
  isResponse,
  ResponseAction,
  SubAction,
} from '../actions'
import { SOCKET } from '../constants'
import * as settings from '../settings'
import wait from './wait'

function createChannel<T extends string, A extends ActionBase<T>, R = void>(
  type: T,
  receiver: (action: SubAction<A>) => Promise<R>,
) {
  const { socket } = game

  socket.on(SOCKET, async (action: A) => {
    if (action.type === type && game.user.id === settings.getPrimaryDm()) {
      const response = await receiver(action)
      const responseAction: ResponseAction<R> = {
        type: 'response',
        response,
        scope: action.scope,
      }
      socket.emit(SOCKET, responseAction)
    }
  })

  function act(action: SubAction<A>): Promise<R> {
    return new Promise((resolve) => {
      if (game.user.id === settings.getPrimaryDm()) {
        resolve(receiver(action))
      } else {
        const timestamp = Date.now()
        const scope = `${game.user.id}-${timestamp}`
        const listener = (innerAction: Action<R>) => {
          if (isResponse<R>(scope, innerAction)) {
            socket.removeListener(scope, listener)
            resolve(innerAction.response)
          }
        }
        socket.on(SOCKET, listener)
        wait(30000).then(() => {
          socket.removeListener(SOCKET, listener)
        })
        socket.emit(SOCKET, { ...action, type, scope }, {}, (res: R) => {
          resolve(res)
        })
      }
    })
  }

  return act
}

export default createChannel
