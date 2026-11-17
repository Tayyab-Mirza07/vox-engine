// Builds per-line, per-sentence and per-word caption timings for an episode's voiceover.
//   node scripts/build-timings.mjs            -> legacy episode (src/script.json, public/vo)
//   node scripts/build-timings.mjs dbcooper   -> src/dbcooper/script.json, public/dbcooper/vo
// Sentence and comma boundaries are snapped to real pauses detected in the audio.
import {execFileSync, spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';

const ep = process.argv[2];
const srcDir = ep ? `src/${ep}` : 'src';
const voDir = ep ? `${ep}/vo` : 'vo';
const script = JSON.parse(readFileSync(`${srcDir}/script.json`, 'utf8'));
const spoken = script.spoken ?? {};
const LEAD = 0.25; // silence before the first line
const GAP = 0.35; // breathing room between lines
const TAIL = 1.6; // hold after the last line

const duration = (file) =>
  parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString());

const silences = (file) => {
  const out = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', 'silencedetect=noise=-32dB:d=0.15', '-f', 'null', '-']).stderr.toString();
  const starts = [...out.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const ends = [...out.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  return starts.map((s, i) => ({start: s, end: ends[i] ?? s}));
};

// How long a word takes to say, in letters. Numbers are weighted by their spoken form.
const weight = (w) => {
  const bare = w.replace(/[.,?!:;]+$/, '');
  const say = spoken[bare] ?? bare;
  return say.replace(/[^a-z0-9]/gi, '').length + 1.5;
};
const sum = (words) => words.reduce((a, w) => a + weight(w), 0);

const spread = (words, start, end) => {
  const total = sum(words);
  let t = start;
  return words.map((w) => {
    const d = ((end - start) * weight(w)) / total;
    const o = {w, start: t, end: t + d};
    t += d;
    return o;
  });
};

// Match k boundary estimates to pauses, in order, preferring long pauses near the estimate.
// Returns an array of pause indexes (or -1 when a boundary gets no pause).
const matchPauses = (ests, pauses) => {
  const k = ests.length;
  const m = pauses.length;
  const score = (i, j) => pauses[j].end - pauses[j].start - 0.15 * Math.abs((pauses[j].start + pauses[j].end) / 2 - ests[i]);
  const SKIP = -0.25;
  // best[i][j]: best score assigning boundaries i.. using pauses j..
  const best = Array.from({length: k + 1}, () => Array(m + 1).fill(0));
  const pick = Array.from({length: k + 1}, () => Array(m + 1).fill('end'));
  for (let i = k - 1; i >= 0; i--) {
    for (let j = m; j >= 0; j--) {
      let b = SKIP + best[i + 1][j];
      let p = 'skip';
      if (j < m) {
        const use = score(i, j) + best[i + 1][j + 1];
        if (use > b) [b, p] = [use, 'use'];
        if (best[i][j + 1] > b) [b, p] = [best[i][j + 1], 'next'];
      }
      best[i][j] = b;
      pick[i][j] = p;
    }
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < k) {
    const p = pick[i][j];
    if (p === 'use') (out.push(j), i++, j++);
    else if (p === 'next') j++;
    else (out.push(-1), i++);
  }
  return out;
};

let cursor = LEAD;
const lines = script.lines.map((text, i) => {
  const file = `public/${voDir}/line${i}.mp3`;
  const dur = duration(file);
  const all = silences(file);
  const internal = all.filter((s) => s.start > 0.05 && s.end < dur - 0.05);
  const speechStart = all.length && all[0].start <= 0.05 ? all[0].end : 0;
  const speechEnd = all.length && all.at(-1).end >= dur - 0.05 ? all.at(-1).start : dur;

  const sentenceTexts = text.match(/[^.?!]+[.?!]+/g).map((s) => s.trim());
  const sentenceWords = sentenceTexts.map((s) => s.split(/\s+/));
  // Estimate where each sentence ends if speech were evenly paced, then snap to pauses.
  const pauseTotal = internal.reduce((a, s) => a + (s.end - s.start), 0);
  const speakRate = (speechEnd - speechStart - pauseTotal) / sum(sentenceWords.flat());
  // Every punctuation mark is expected to carry an equal share of the total pause time.
  const marks = (words) => words.filter((w) => /[.,?!:;]$/.test(w)).length;
  const perPause = pauseTotal / Math.max(1, marks(sentenceWords.flat()) - 1);
  let units = 0;
  let seen = 0;
  const ests = sentenceWords.slice(0, -1).map((w) => {
    units += sum(w);
    seen += marks(w);
    return speechStart + units * speakRate + (seen - 0.5) * perPause;
  });
  const matched = matchPauses(ests, internal);
  const breaks = ests.map((e, k) => (matched[k] >= 0 ? internal[matched[k]] : {start: e, end: e, guessed: true}));
  if (breaks.some((b) => b.guessed)) console.warn(`line ${i}: ${breaks.filter((b) => b.guessed).length} sentence break(s) estimated`);
  const commaPauses = internal.filter((s, idx) => !matched.includes(idx));

  const sentences = sentenceTexts.map((st, j) => {
    const start = j === 0 ? speechStart : breaks[j - 1].end;
    const end = j === sentenceTexts.length - 1 ? speechEnd : breaks[j].start;
    const phrases = st.split(/(?<=[,:])\s+/).map((p) => p.split(/\s+/));
    const totalW = sum(phrases.flat());
    let a = 0;
    const bounds = phrases.slice(0, -1).map((p) => {
      a += sum(p);
      const t = start + ((end - start) * a) / totalW;
      return {start: t, end: t};
    });
    for (const p of commaPauses.filter((s) => s.start > start && s.end < end)) {
      let bestK = -1;
      bounds.forEach((b, k) => {
        if (b.snapped) return;
        if (bestK < 0 || Math.abs(b.start - p.start) < Math.abs(bounds[bestK].start - p.start)) bestK = k;
      });
      if (bestK >= 0) bounds[bestK] = {start: p.start, end: p.end, snapped: true};
    }
    bounds.sort((x, y) => x.start - y.start);
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
    file: `${voDir}/line${i}.mp3`,
    start: +lineStart.toFixed(3),
    dur: +dur.toFixed(3),
    sentences: sentences.map((s) => ({...shift(s), words: s.words.map(shift)})),
  };
});

const total = +(cursor - GAP + TAIL).toFixed(3);
writeFileSync(`${srcDir}/timings.json`, JSON.stringify({total, lines}, null, 1));
console.log(`total ${total}s`);
for (const l of lines) for (const s of l.sentences) console.log(s.start.toFixed(2), s.end.toFixed(2), (s.end - s.start).toFixed(2), s.text);
