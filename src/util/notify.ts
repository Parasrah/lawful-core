const notify = {
  error: (msg: string) => {
    ui.notifications.error(msg)
  },
  info: (msg: string) => {
    ui.notifications.info(msg)
  },
}

export default notify
