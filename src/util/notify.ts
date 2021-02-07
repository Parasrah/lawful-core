const notify = {
  error: (msg: string) => {
    ui.notifications.error(`Lawful Loot: ${msg}`)
  },
  info: (msg: string) => {
    ui.notifications.info(`Lawful Loot: ${msg}`)
  },
}

export default notify
