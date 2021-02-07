const notify = {
  error: (msg: string) => {
    ui.notifications.error(`lawful loot: ${msg}`)
  },
  info: (msg: string) => {
    ui.notifications.info(`lawful loot: ${msg}`)
  },
}

export default notify
