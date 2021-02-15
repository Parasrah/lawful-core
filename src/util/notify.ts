const notify = {
  error: (msg: string) => {
    const scopedMessage = `Lawful Loot: ${msg}`
    ui.notifications.error(scopedMessage)
    return new Error(scopedMessage)
  },
  info: (msg: string) => {
    ui.notifications.info(`Lawful Loot: ${msg}`)
  },
}

export default notify
