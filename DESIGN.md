# DESIGN

## Modes

- Running a game
- Reviewing a game:
  - move back and forth amongst the played moves
  - resume the game from the displayed move
- Setting a game
  - reset to standard positions, initial turn player and credit counter
  - remove all cube from the board
  - freely select, remove, move and stack any cube, respecting the stacking rules.
  - set the player turn
  - set the credit counter

## General layout

The following layout should be convenient for a desktop browser and a smart-phone screen:

![](./pictures/general-layout.png)

Hereafter is a detail on the layout of the "captured cubes" zones -- when a kind of cube is no capture, then the picture of that kind is not displayed:

![](./pictures/captured-cubes-layout.png)

## Setting mode layout

Hereafter some passive items becomes active for changing the active player and the credit counter:

![](./pictures/setting-mode-layout.png)

As depicted hereafter, one reset/clear button appears in each captured/cleared cubes zone : either all cubes are removed out of the board or the cubes are reset to their standard position.

![](./pictures/captured-cubes-layout-in-setting-mode.png)