# vox-engine

Remotion project that turns a script into vertical shorts for the owner's YouTube channel and Facebook page.

## Standing preferences (from the owner, Nov 2026)

- Every video must have sound effects (hits on reveals/stamps, whooshes on map jumps and cuts) AND a music track
  that follows the story (ElevenLabs `eleven_music_v2_5`, instrumental, prompt describes how the energy evolves;
  fit it to the video length with `atempo`, loudnorm it, drop it out just before big reveals and swell back after).
- Voice comes first in the mix: effects and music must never be louder than the narrator. Normalize every voice line
  (loudnorm I=-17), duck effects/music under speech (`src/mix.ts`), and build the final audio with `scripts/mix.sh`
  (sidechain compression on voice). Check with `python3 scripts/check-mix.py out/stems/<name>` before delivering.
- Every script uses a strong hook, re-hooks (roughly every 40–60 s, e.g. a question or "what he did next…") and
  tension → release, with 5W1H covered. Record the structure in the episode's `script.json` (`structure` key).
  Shorts must stay under 3:00 — set `gap`/`tail` in `script.json` to tighten pacing if needed.
- Normalize the audio for YouTube and Facebook before delivering: run `npm run master` after `npm run render`
  (targets -14 LUFS integrated, -1.5 dBTP) and deliver the mastered file.
- Show real, properly licensed photos/video of the person the video is about (e.g. Wikimedia Commons CC BY),
  keep the on-screen credit, and record sources in `public/photos/CREDITS.md`. Not just silhouettes/graphics.
- Voiceover: generate with the owner's ElevenLabs connector (paid plan). Voice: "Justin Time"
  (voice_id `uFIXVu9mmnDZ7dTKCBTX`), model Eleven v4, English. Generate one line per scene into `public/vo/lineN.mp3`
  with `generations_count: 1` to save credits. Audio downloads from `elevenlabsusercontent.com`.
  Only fall back to vidIQ voiceover (limited credits) if ElevenLabs is not connected, and say so.
- The owner often cannot download from the chat preview: also copy the mastered file to `videos/` and push it,
  then give the GitHub link.
- The owner writes in Roman Urdu/Hinglish; reply in the same.

## Episodes

Channel: "Chronos Galaxy" (YouTube + Facebook), US audience, 3-minute-max vertical mystery/history documentaries.
Scripts use a strong hook, re-hooks, 5W1H and tension/release; narration should sound like a storyteller
(Eleven v4 audio tags such as `[whispers]`, `[softly]`, kept out of the caption text).

- `Short` — first reel (Jensen Huang); files at the top level of `src/` and `public/vo`, `public/photos`.
- `DBCooper` — episode 1 of the mystery series; `src/dbcooper/`, `public/dbcooper/{vo,photos}`.
- `Kemper` — episode 2 (Edmund Kemper); `src/kemper/`, `public/kemper/{vo,photos,music.mp3}`. Leaves out the most
  graphic details and victim photos/names on purpose (advertiser-friendly, respectful).
  New episodes follow this layout: `src/<ep>/{script.json,timings.json,scenes.tsx,Video.tsx}`.

## Commands

- `node scripts/build-timings.mjs <ep>` — rebuild an episode's caption timings (no argument = first reel)
- `scripts/mix.sh <Composition> <name>` — render muted video + voice/fx/music stems, mix with ducking → `out/<name>-final.mp4`
  (episodes need a `stem` prop; see `src/kemper/Video.tsx`)
- `npm run render:dbcooper` then `npm run master:dbcooper` — older single-pass render for D.B. Cooper
- A 3-minute render takes ~12 minutes: run it in the background.
- Wikimedia rate-limits this environment hard (HTTP 429): fetch files one at a time via
  `commons.wikimedia.org/wiki/Special:FilePath/<name>` with long pauses.

- `npm run timings` — rebuild caption timings from the voiceover in `public/vo/`
- `npm run render` — render `out/reform-school-billionaire.mp4`
- `npm run master` — loudness-normalize to `out/reform-school-billionaire-final.mp4`
- In cloud sessions pass `--browser-executable=/opt/pw-browsers/chromium` to Remotion.
