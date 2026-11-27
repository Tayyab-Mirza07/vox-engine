// Renders only the new sections of the "Gone" long video (intro, case cards, outro) as separate MP4s.
// The Shorts themselves are overlaid by ffmpeg (scripts/gone-assemble.sh) — far faster than re-rendering them.
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.tsx')});
const composition = await selectComposition({serveUrl, id: 'Gone', browserExecutable: '/opt/pw-browsers/chromium'});
const segs = JSON.parse(fs.readFileSync('out/gone/segments.json', 'utf8'));
for (const s of segs) {
  if (fs.existsSync(s.out)) continue;
  await renderMedia({serveUrl, composition, codec: 'h264', crf: 18, frameRange: [s.from, s.to], outputLocation: s.out + '.tmp.mp4', browserExecutable: '/opt/pw-browsers/chromium'});
  fs.renameSync(s.out + '.tmp.mp4', s.out);
  console.log('ok', s.out);
}
console.log('DONE');
