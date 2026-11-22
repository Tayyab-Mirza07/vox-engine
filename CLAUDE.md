# vox-engine

Remotion project that turns a script into vertical shorts for the owner's YouTube channel and Facebook page.

## Standing preferences (from the owner, Nov 2026)

- Every video must have sound effects (hits on reveals/stamps, whooshes on map jumps and cuts) AND a music track
  that follows the story (ElevenLabs `eleven_music_v2_5`, instrumental, prompt describes how the energy evolves;
  fit it to the video length with `atempo`, loudnorm it, drop it out just before big reveals and swell back after).
- Voice comes first in the mix: effects and music must never be louder than the narrator. Normalize every voice line
  (loudnorm I=-17), duck effects/music under speech (`src/mix.ts`), and build the final audio with `scripts/mix.sh`
  (sidechain compression on voice). Check with `python3 scripts/check-mix.py out/stems/<name>` before delivering.
- Music: the owner prefers piano-led scores, a bit louder than the first Kemper mix (Mary Celeste settings:
  `musicGain 0.8, musicUnderVoice 0.65`, `MUSIC_GAIN=0.55 MUSIC_THRESHOLD=0.022 MUSIC_RATIO=7 scripts/mix.sh …` → music ≈23 dB under the voice
  while speaking, ≈13 dB in gaps). Ratio 4 / threshold 0.03 made the piano louder than the voice — don't use it.
  Dynamic piano scores (Fitzgerald) also need their peaks tamed first:
  `MUSIC_PRECOMP=acompressor=threshold=0.08:ratio=6:attack=10:release=250 MUSIC_GAIN=0.85 MUSIC_THRESHOLD=0.02 MUSIC_RATIO=8 MUSIC_RELEASE=600`.
  Raising the music further made it louder than the narrator in >1% of moments.
- Hooks: never whispered. The first 3–4 seconds must land the most shocking image/line at normal-to-intense volume
  (open cold on the shock, explain after). Whisper tags are fine later in the story.
- Every script uses a strong hook, re-hooks (roughly every 40–60 s, e.g. a question or "what he did next…"),
  tension → release, a clear payoff, and ends with a CTA that sends viewers to earlier Shorts on the channel
  (show their thumbnails; stills taken from our own rendered videos). 5W1H covered. Record the structure in the episode's `script.json` (`structure` key).
  Shorts must stay under 3:00 — set `gap`/`tail` in `script.json` to tighten pacing if needed.
- Normalize the audio for YouTube and Facebook before delivering: run `npm run master` after `npm run render`
  (targets -14 LUFS integrated, -1.5 dBTP) and deliver the mastered file.
- Show real, properly licensed photos/video of the person the video is about (e.g. Wikimedia Commons CC BY),
  keep the on-screen credit, and record sources in `public/photos/CREDITS.md`. Not just silhouettes/graphics.
- Voiceover: generate with the owner's ElevenLabs connector (paid plan). Voice: "Justin Time"
  (voice_id `uFIXVu9mmnDZ7dTKCBTX`), model Eleven v4, English. Generate one line per scene into `public/vo/lineN.mp3`
  with `generations_count: 1` to save credits. Audio downloads from `elevenlabsusercontent.com`.
  Plan: ElevenLabs Creator (~123K credits/month, from 21 Nov 2026). Budget: 1 short/day (~3K voice) + 1 long/week (~9K);
  reuse the music library instead of generating new music per video; thumbnails ~191 credits per image.
  Only fall back to vidIQ voiceover (limited credits) if ElevenLabs is not connected, and say so.
- The owner often cannot download from the chat preview: also copy the mastered file to `videos/` and push it,
  then give the GitHub link.
- Daily cadence (from 22 Nov 2026): one high-quality ~3-minute Short every day (keep it under 3:00, aim 2:40–2:55).
  Default format = the Annabelle/Flannan recipe: fact-checked script (hook / re-hooks / legend-vs-truth twist / CTA),
  evidence-board graphics + 3–4 AI cinematic stills (labelled "AI illustration") + real CC/PD photos with credits,
  re-used music, and a portrait 1080×1920 thumbnail composition (`<Ep>Thumb`) delivered with the video for the Shorts cover.
  Pick topics from vidIQ data (US/UK audience; "N people vanished / never found" performs best). Budget ≈3.3K ElevenLabs
  credits per Short (voice ~2.6K + 4 stills ~0.8K) → ~100K/month.
- The owner writes in Roman Urdu/Hinglish; reply in the same.

## Episodes

Channel: "Chronos Galaxy" (YouTube + Facebook), US audience, 3-minute-max vertical mystery/history documentaries.
Scripts use a strong hook, re-hooks, 5W1H and tension/release; narration should sound like a storyteller
(Eleven v4 audio tags such as `[whispers]`, `[softly]`, kept out of the caption text).

- `Short` — first reel (Jensen Huang); files at the top level of `src/` and `public/vo`, `public/photos`.
- `DBCooper` — episode 1 of the mystery series; `src/dbcooper/`, `public/dbcooper/{vo,photos}`.
- `Fitz` — episode 4 (Edmund Fitzgerald); `src/fitz/`, `public/fitz/{vo,photos,cta,music.mp3}`.
- `Celeste` — episode 3 (Mary Celeste ghost ship); `src/celeste/`, `public/celeste/{vo,photos,cta,music.mp3}`.
- `Kemper` — episode 2 (Edmund Kemper); `src/kemper/`, `public/kemper/{vo,photos,music.mp3}`. Leaves out the most
  graphic details and victim photos/names on purpose (advertiser-friendly, respectful).
- `Hoffa` — Jimmy Hoffa (1975); `src/hoffa/`, `public/hoffa/{vo,photos,cta,music.mp3}`. Mobsters and O'Brien shown only as
  silhouettes; music re-used from MH370.
- `BakerSt` — Baker Street "walkie-talkie" bank job (1971); `src/bakerst/`, `public/bakerst/{vo,photos,cta,music.mp3}`.
  Minimal flat-silhouette red/blue duotone style with light sweeps; music re-used from Alcatraz.
- `Room1046` — Room 1046 / Artemus Ogletree (1935); `src/room1046/`, `public/room1046/{vo,photos,cta,music.mp3}`. 1930s noir
  motion graphics + Hotel President photos; injuries described, not shown; music re-used from Dyatlov.
- `Annabelle` — the Annabelle doll (1970 / 2025); `src/annabelle/`, `public/annabelle/{vo,ai,photos,cta,music.mp3}`. New
  "evidence board" style (cork board, polaroids, red strings, stamps) + 3 AI cinematic stills; max 2:40 by owner request.
- `Flannan` — Flannan Isles lighthouse keepers (1900); `src/flannan/`, `public/flannan/{vo,ai,photos,cta,music.mp3}`. Evidence-board
  style + 4 AI stills + real geograph photos; portrait Shorts thumbnail via the `FlannanThumb` composition.
- `Flight19` — Flight 19 (1945); `src/flight19/`, `public/flight19/{vo,ai,photos,cta,music.mp3}`. Evidence-board style + 4 AI stills
  + PD Navy photos; music re-used from MH370; portrait thumbnail `Flight19Thumb`.
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
