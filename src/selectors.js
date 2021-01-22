export const players = (users) =>
  users.filter((x) => x.active).map((x) => x.data._id)
