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
- `Sodder` — the Sodder children (1945); `src/sodder/`, `public/sodder/{vo,ai,photos,cta,music.mp3}`. Evidence-board style +
  4 AI stills; children shown only as silhouettes (no licensed photos); music re-used from Mary Celeste; thumbnail `SodderThumb`.
- `Zodiac` — the Zodiac Killer (1968–1974); `src/zodiac/`, `public/zodiac/{vo,ai,photos,cta,music.mp3}`. Evidence-board style + 3 AI stills,
  SFPD wanted poster + suspect DMV photo (PD); victims not named or shown; music re-used from Kemper; first Short with the
  "follow for a new unsolved mystery every day" line; thumbnail `ZodiacThumb`.
- `Dunbar` — Bobby Dunbar (1912 / DNA 2004); `src/dunbar/`, `public/dunbar/{vo,ai,photos,music.mp3}`. First "viral short" format
  (~67 s, one reveal, loop ending, on-screen FOLLOW button); 3 PD photos + 2 AI stills; music re-used from Sodder; thumbnail `DunbarThumb`.
- `Somerton` — the Somerton Man / Tamám Shud (1948 / named 2022); `src/somerton/`, `public/somerton/{vo,ai,photos,cta,music.mp3}`.
  2:39 deep-dive, evidence board + 5 PD police photos + 3 AI stills; nurse not named, her son only a silhouette;
  music re-used from Fitzgerald; CTA to Zodiac; thumbnail `SomertonThumb`.
- `Dillinger` — John Dillinger's wooden-gun escape (1934); `src/dillinger/`, `public/dillinger/{vo,photos,cta,music.mp3}`. New
  flat cartoon-silhouette poster style (cream/ink/red/gold, `src/dillinger/parts.tsx`) with every scene cut and camera
  move locked to the music beat (`scripts/beats.py <music> <beats.json>`); original piano-noir track; 3 PD FBI photos;
  CTA to Alcatraz; thumbnail `DillingerThumb`.
- `Magee` — Alan Magee, fell ~22,000 ft without a parachute (1943); `src/magee/`, `public/magee/{vo,photos,music.mp3}`. ~68 s viral
  format in the Dillinger cartoon style but softer (no cut flash, small beat punch, new framing every 8 beats);
  2 PD B-17 photos; music re-used from Flight 19; loop ending + on-screen FOLLOW; thumbnail `MageeThumb`.
- `Isdal` — the Isdal Woman (1970, still unidentified); `src/isdal/`, `public/isdal/{vo,photos,cta,music.mp3}`. First episode in the
  new **vintage collage** style (owner's favourite: Vox/Fing-like) built from the reusable kit `src/collage/parts.tsx`
  (paper texture, torn-edge cut-out photos with tape + halftone, typewriter `Typed`, marker `Circle`/`Arrow`, highlighter `Hi`,
  `Redact`, `Stamp`, `Headline`, 12 fps `jitter`, paper-slide page transitions, fonts Playfair Display + Special Elite);
  4 real place photos; 2:42; CTA to Somerton; thumbnail `IsdalThumb`. Use this kit for new episodes.
- `Mcnair` — ESCAPED #2: Richard Lee McNair (1987 / 1992 / 2006 escapes); `src/mcnair/`, `public/mcnair/{vo,photos,cta,music.mp3}`.
  Dillinger cartoon beat-synced style (parts from `src/dillinger/parts.tsx`, milder camera: max scale 1.16, punch 0.016, softer cut
  flash) + new props (dash-cam overlay, railroad tracks, patrol car, mailbag pod, fence, Mountie); 2 PD photos (US Marshals mugshot,
  BOP USP Pollock); Dillinger music re-fitted (atempo 1.0497); victim not named; CTA to Dillinger (ESCAPED #1); thumbnail `McnairThumb`.
- Viral cuts of finished Shorts: `scripts/cut-short.py <in> <out> a-b c-d …` (covers the progress bar, loudnorms) →
  `videos/mh370-cut.mp4`, `videos/sodder-cut.mp4`.
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
