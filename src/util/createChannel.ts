import { isResponse } from '../actions'
import { SOCKET } from '../constants'
import * as settings from '../settings'
import wait from './wait'

function createChannel<T extends string, A extends BaseAction<T>, R = void>(
  type: T,
  receiver: (action: SubAction<A>, from: string) => Promise<R>,
  predicate: (action: SubAction<A>) => boolean,
) {
  const { socket } = game

  socket.on(SOCKET, async (action: A, userId: string) => {
    if (action.type === type && predicate(action)) {
      const response = await receiver(action, userId)
      const responseAction: ResponseAction<R> = {
        type: 'response',
        response,
        scope: action.scope,
        source: game.user.id,
      }
      socket.emit(SOCKET, responseAction)
    }
  })

  function act(action: SubAction<A>): Promise<R> {
    return new Promise((resolve) => {
      if (predicate(action)) {
        Promise.resolve(receiver(action, game.user.id)).then(resolve)
      } else {
        const timestamp = Date.now()
        const scope = `${game.user.id}-${timestamp}`
        const listener = (innerAction: Action<R>) => {
          if (isResponse<R>(scope, innerAction)) {
            socket.removeListener(SOCKET, listener)
            resolve(innerAction.response)
          }
        }
        socket.on(SOCKET, listener)
        wait(30000).then(() => {
          socket.removeListener(SOCKET, listener)
        })
        socket.emit(SOCKET, { ...action, type, scope }, {})
      }
    })
  }

  return act
}

function createTargetedChannel<
  T extends string,
  A extends TargetedAction<T>,
  R = void
>(type: T, receiver: (action: SubAction<A>, from: string) => Promise<R>) {
  return createChannel(
    type,
    receiver,
    (action) => action.target === game.user.id,
  )
}

function createMasterChannel<
  T extends string,
  A extends BaseAction<T>,
  R = void
>(type: T, receiver: (action: SubAction<A>, from: string) => Promise<R>) {
  return createChannel(
    type,
    receiver,
    () => game.user.id === settings.getPrimaryDm(),
  )
}

export { createMasterChannel, createTargetedChannel }
