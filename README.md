# vox-engine
AI-powered Vox-style documentary engine built with Claude + Remotion. Script -> Research -> Fact-check -> Map/Chart animations -> Auto-synced video.

## First short: "The Reform School Billionaire"

- `src/script.json` — narration, one entry per scene
- `public/vo/` — voiceover audio per scene; `public/sfx/` — synthesized hits, whooshes and bed
- `npm run timings` — detects pauses in the voiceover and writes word-level caption timings to `src/timings.json`
- `npm run studio` — preview in Remotion Studio
- `npm run render` — renders `out/reform-school-billionaire.mp4` (1080x1920, 30 fps)
