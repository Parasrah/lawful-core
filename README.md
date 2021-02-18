# FoundryVTT Lawful Loot Mod

The first module as part of the lawful collection, Lawful Loot & Trade seeks
to improve the item situation in Foundry for dnd5e. Like all Lawful modules,
it has an emphasis on code quality, playing well with other modules and with
the base game system.

## Instructions

This module is not currently ready for the public, but is close to a 1.0
release at which point this section **should** have all the information you
need to get started.

## Why does a DM need to be logged in? What is the Primary DM?

Players don't have permission to do certain things, such as adding or
removing items from the inventory of an NPC. Due to this restriction, this
mod has players send messages behind the scenes asking the DM to perform the
purchase or sale on their behalf. In order to achieve this, the players have
to know which DM to send that message to (in case there is more than one).

This is not a hard & fast requirement, after all there are other mods that do
similar things that don't have a setting for "Primary DM". This requires the
mod to negotiate between the players which one will be the primary DM without
requiring any effort from the players. This isn't currently the behaviour
purely because right now the effort to implement it would be better spent
elsewhere. It is a feature on the roadmap, and I will likely abstract that
logic away from this mod so that other module developers can benefit from it.

## Why GPL-3.0?

Among the goals of this module is consistency and stability. In other words,
the sheets in this module should be similar to those in the dnd5e system,
while not breaking when that system is updated. In order to achieve these
goals, a lot of the templates and sheets were originally copied from [the
dnd5e system](https://gitlab.com/foundrynet/dnd5e), which due to its license
requires all derived works fall under the same license.
