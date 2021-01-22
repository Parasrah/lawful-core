import { createSelector } from 'reselect'

export const players = createSelector((users) =>
  users.filter((x) => x.active).map((x) => x.data._id),
)
