// Builds src/timings.json: per-line, per-sentence and per-word timings for the voiceover.
// Sentence and comma boundaries are snapped to real pauses detected in the audio.
import {execFileSync, spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';

const script = JSON.parse(readFileSync('src/script.json', 'utf8'));
const LEAD = 0.25; // silence before the first line
const GAP = 0.35; // breathing room between lines
const TAIL = 1.6; // hold after the last line

const duration = (file) =>
  parseFloat(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString(),
  );

const silences = (file) => {
  const out = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', 'silencedetect=noise=-32dB:d=0.15', '-f', 'null', '-']).stderr.toString();
  const starts = [...out.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const ends = [...out.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  return starts.map((s, i) => ({start: s, end: ends[i] ?? s}));
};

const weight = (w) => w.replace(/[^a-z0-9]/gi, '').length + 1.5;

// Spread words evenly (by length) over [start, end].
const spread = (words, start, end) => {
  const total = words.reduce((a, w) => a + weight(w), 0);
  let t = start;
  return words.map((w) => {
    const d = ((end - start) * weight(w)) / total;
    const o = {w, start: t, end: t + d};
    t += d;
    return o;
  });
};

let cursor = LEAD;
const lines = script.lines.map((text, i) => {
  const file = `public/vo/line${i}.mp3`;
  const dur = duration(file);
  const all = silences(file);
  const internal = all.filter((s) => s.start > 0.05 && s.end < dur - 0.05);
  const speechEnd = all.length && all.at(-1).end >= dur - 0.05 ? all.at(-1).start : dur;

  const sentenceTexts = text.match(/[^.?!]+[.?!]+/g).map((s) => s.trim());
  // The longest internal pauses are the sentence breaks.
  const breaks = [...internal]
    .sort((a, b) => b.end - b.start - (a.end - a.start))
    .slice(0, sentenceTexts.length - 1)
    .sort((a, b) => a.start - b.start);
  if (breaks.length !== sentenceTexts.length - 1) throw new Error(`line ${i}: not enough pauses`);
  const commaPauses = internal.filter((s) => !breaks.includes(s));

  const sentences = sentenceTexts.map((st, j) => {
    const start = j === 0 ? 0 : breaks[j - 1].end;
    const end = j === sentenceTexts.length - 1 ? speechEnd : breaks[j].start;
    const phrases = st.split(/(?<=,)\s+/).map((p) => p.split(/\s+/));
    // Estimate comma boundaries proportionally, then snap them to detected pauses.
    const totalW = phrases.flat().reduce((a, w) => a + weight(w), 0);
    let acc = 0;
    const bounds = phrases.slice(0, -1).map((p) => {
      acc += p.reduce((a, w) => a + weight(w), 0);
      const t = start + ((end - start) * acc) / totalW;
      return {start: t, end: t};
    });
    for (const p of commaPauses.filter((s) => s.start > start && s.end < end)) {
      let best = -1;
      bounds.forEach((b, k) => {
        if (b.snapped) return;
        if (best < 0 || Math.abs(b.start - p.start) < Math.abs(bounds[best].start - p.start)) best = k;
      });
      if (best >= 0) bounds[best] = {start: p.start, end: p.end, snapped: true};
    }
    bounds.sort((a, b) => a.start - b.start);
    const words = phrases.flatMap((p, k) =>
      spread(p, k === 0 ? start : bounds[k - 1].end, k === phrases.length - 1 ? end : bounds[k].start),
    );
    return {text: st, start, end, words};
  });

  const lineStart = cursor;
  cursor += dur + GAP;
  const shift = (o) => ({...o, start: +(o.start + lineStart).toFixed(3), end: +(o.end + lineStart).toFixed(3)});
  return {
    index: i,
    file: `vo/line${i}.mp3`,
    start: +lineStart.toFixed(3),
    dur: +dur.toFixed(3),
    sentences: sentences.map((s) => ({...shift(s), words: s.words.map(shift)})),
  };
});

const total = +(cursor - GAP + TAIL).toFixed(3);
writeFileSync('src/timings.json', JSON.stringify({total, lines}, null, 1));
console.log(`total ${total}s`);
for (const l of lines) for (const s of l.sentences) console.log(s.start.toFixed(2), s.end.toFixed(2), s.text);
