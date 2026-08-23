# Piano practice

A sight-reading trainer. Generates eight-bar melodies as real notation, plays
them back with a click, drills note and key-signature reading, and tracks
progress along a twelve-step ladder.

The whole app is one self-contained `index.html` — no build step, no
dependencies, no backend. Open the file and it works.

## Running it

```sh
npm run serve      # http://localhost:8080
```

Opening `index.html` directly with `file://` mostly works, but browsers treat
file URLs as an insecure origin, so audio can behave oddly. Serving it is
better.

## Tests

```sh
npm test
```

The tests load the real script out of `index.html` and run it against a stub
browser, so they exercise the shipped code rather than a copy of it. They cover:

- **Generator** — every bar totals four beats, melodies close on the tonic, the
  motif is restated, a five-finger step never leaves the position, a reaching-out
  step actually requires the reach rather than merely allowing it, one hand
  means one staff, eighth notes only appear where the step allows, the raised
  seventh lands one semitone below each minor tonic, and the score exposes one
  tappable bar per measure when marking a stumble.
- **Audio** — every step produces audible non-clipping playback, both staves
  reach the output, written duration is audible in the sound, and the click
  track holds its beat to under 2ms across tempos.
- **Progress** — steps unlock in order, the directive always names a real tab,
  every tab renders in every state, keys never repeat back to back, and the
  stumble analysis finds real patterns while rarely flagging noise.
- **Solfège** — the movable-do, do-based-minor syllable for a note is its
  letter-distance from the tonic regardless of the key's own sharps and flats,
  minor correctly uses the altered 3rd/6th/7th (me, le, te), and the drill mode
  renders cleanly across every key.
- **Drill staff** — the reading drill redraws the correct staff (signature,
  note, or both) for whichever mode is active after every answer, not just on
  the first render; and the Sight tab's fingering diagram stays hidden, along
  with the key name everywhere it would otherwise appear, until the key
  signature is identified correctly.

## Where your data lives

Progress is kept in `localStorage`, keyed to whatever origin serves the page.
That means it survives refreshes and browser restarts, but it does **not**
follow you between devices or browsers, and clearing site data wipes it.

Use **Progress → Back up or move your progress** to download a JSON file. That
export is the only copy you own outright; take one before changing anything.

For genuine cross-device sync you would need a backend — a table keyed by user
with a JSON blob is enough, and the export format is already the right shape
for it.

## Deploying

Any static host works, since there is nothing to build:

```sh
npx vercel deploy --prod      # or: push and enable GitHub Pages
```

Serving it from a stable domain is worth doing: `localStorage` is scoped to the
origin, so a fixed URL means progress that persists indefinitely.

## Layout

```
index.html      the entire app
PROGRAM.md      the wider practice programme, most of which the app does not cover
test/
  harness.mjs   loads index.html into a stub browser
  *.test.mjs    the suites above
```

## What this is not

The app trains reading. The programme in `PROGRAM.md` — repertoire, scales,
hands-together work, playing from your own choir music — is the larger part of
learning the instrument and mostly happens away from the screen.
