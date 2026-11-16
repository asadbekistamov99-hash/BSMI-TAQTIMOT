# Recon: speedanatomy.app (core loop only)

Scope: the bone-typing practice loop. Sources: the public home and play pages, read at human pace.
Screenshots of the original are kept in replica/screens/ and are never committed.

## Core loop
A bone is highlighted on a 3D skeleton. The user types its name. Rounds get harder: name shown,
then first letter only, then no hint. Each session ends with a score.

## Screens
| id | screen | route | purpose |
| --- | --- | --- | --- |
| S01 | Home | / | Pitch, start button, bone of the day |
| S02 | Play | /play | 3D skeleton, typing game, body map, levels |
| S03 | Tour | overlay on /play | 12-step intro, skippable |

## Flows
F01 Learn a region: S02 pick level -> type bone name x3 rounds -> score.

## Rebuilt here (clean-room)
- Typing drill with 3 rounds (name shown, first letter plus clue, from memory). Route /skelet-mashq.
- Region picker, results screen, personal best kept in localStorage.
- Bone list and hints written in this project. No site assets, copy or 3D models are used.

## Not rebuilt
- 3D skeleton (the original's model is CC BY-SA and would need its own licence review).
- Bone of the day, body map unlocks, muscles, sign-in progress, languages other than Uzbek.
