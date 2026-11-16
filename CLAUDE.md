# vox-engine

Remotion project that turns a script into vertical shorts for the owner's YouTube channel and Facebook page.

## Standing preferences (from the owner, Nov 2026)

- Every video must have sound effects (hits on reveals/stamps, whooshes on map jumps and cuts, a low bed).
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

## Commands

- `npm run timings` — rebuild caption timings from the voiceover in `public/vo/`
- `npm run render` — render `out/reform-school-billionaire.mp4`
- `npm run master` — loudness-normalize to `out/reform-school-billionaire-final.mp4`
- In cloud sessions pass `--browser-executable=/opt/pw-browsers/chromium` to Remotion.
