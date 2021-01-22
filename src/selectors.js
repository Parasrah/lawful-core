export const players = (game) =>
  game.users.filter((x) => x.active).map((x) => x.id)
