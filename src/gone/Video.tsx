import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {DISPLAY, lerp, p} from '../lib';
import {LightSweep} from '../bakerst/parts';
import {Board, MARKER, PAPER, RED, Stamp2} from '../annabelle/parts';

/**
 * "Gone Without a Trace" — long-form compilation (16:9) of our vanishing Shorts.
 * Each case: a narrated case card, then the mastered Short (CTA trimmed) inside a case-file layout.
 */
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);

type Case = {id: string; title: string; when: string; where: string; missing: string; clue: string; cut: number; vo: number; card: string};
export const CASES: Case[] = [
  {id: 'sodder', title: 'THE SODDER CHILDREN', when: '1945', where: 'Fayetteville, West Virginia', missing: '5 children', clue: 'No remains were ever found in the ashes', cut: 163.45, vo: 6.713, card: 'sodder'},
  {id: 'flight19', title: 'FLIGHT 19', when: '1945', where: 'Off the coast of Florida', missing: '27 men · 6 aircraft', clue: '"Both my compasses are out"', cut: 155.75, vo: 6.06, card: 'flight19'},
  {id: 'flannan', title: 'FLANNAN ISLES LIGHTHOUSE', when: '1900', where: 'Outer Hebrides, Scotland', missing: '3 lighthouse keepers', clue: 'One coat still hanging on its hook', cut: 160.1, vo: 7.027, card: 'flannan'},
  {id: 'celeste', title: 'THE MARY CELESTE', when: '1872', where: 'North Atlantic Ocean', missing: '10 people', clue: 'The lifeboat was gone. The cargo was not.', cut: 158.2, vo: 6.4, card: 'celeste'},
  {id: 'dbcooper', title: 'DB COOPER', when: '1971', where: 'Pacific Northwest, USA', missing: '1 hijacker · $200,000', clue: '$5,800 of the cash found by a river in 1980', cut: 153.5, vo: 9.665, card: 'dbcooper'},
  {id: 'alcatraz', title: 'ESCAPE FROM ALCATRAZ', when: '1962', where: 'San Francisco Bay', missing: '3 inmates', clue: 'Fake heads left sleeping in their beds', cut: 148.75, vo: 5.616, card: 'alcatraz'},
  {id: 'hoffa', title: 'JIMMY HOFFA', when: '1975', where: 'Bloomfield Township, Michigan', missing: '1 man', clue: 'Last seen in a restaurant parking lot', cut: 163.8, vo: 7.288, card: 'hoffa'},
  {id: 'mh370', title: 'MALAYSIA AIRLINES MH370', when: '2014', where: 'Indian Ocean', missing: '239 people · 1 Boeing 777', clue: 'Its transponder went dark mid-flight', cut: 159.6, vo: 8.856, card: 'mh370'},
];
const INTRO = fr(23.48 + 1.5);
const CARD_PAD = fr(1.3);
const OUTRO_VO = 14.71;
const OUTRO = fr(OUTRO_VO + 4);

type Part = {kind: 'intro' | 'card' | 'clip' | 'outro'; i: number; from: number; dur: number};
const PARTS: Part[] = (() => {
  const out: Part[] = [];
  let t = 0;
  out.push({kind: 'intro', i: -1, from: t, dur: INTRO});
  t += INTRO;
  CASES.forEach((c, i) => {
    const cd = fr(c.vo) + CARD_PAD;
    out.push({kind: 'card', i, from: t, dur: cd});
    t += cd;
    const cl = fr(c.cut);
    out.push({kind: 'clip', i, from: t, dur: cl});
    t += cl;
  });
  out.push({kind: 'outro', i: -1, from: t, dur: OUTRO});
  return out;
})();
export const T = {totalFrames: PARTS[PARTS.length - 1].from + OUTRO, parts: PARTS};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: 0.06, backgroundImage: 'radial-gradient(#fff 1px, transparent 1.2px)', backgroundSize: '5px 5px', backgroundPosition: `${(frame * 7) % 5}px ${(frame * 3) % 5}px`, pointerEvents: 'none'}} />;
};
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, transparent 45%, #000000c0 100%)', pointerEvents: 'none'}} />;

/** A vertical Short inside a pinned paper frame. */
const Frame: React.FC<{x: number; y: number; h: number; r?: number; children: React.ReactNode; show?: number}> = ({x, y, h, r = 0, children, show = 1}) => {
  const w = (h * 9) / 16;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w + 24, height: h + 24, padding: 12, boxSizing: 'border-box', background: PAPER, boxShadow: '0 30px 60px #000d', transform: `rotate(${r}deg) scale(${lerp(1.08, 1, show)})`, opacity: show}}>
      <div style={{position: 'absolute', top: -16, left: '50%', marginLeft: -16, width: 32, height: 32, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, #fff8, ${RED} 45%, #3a0008)`, boxShadow: '0 6px 8px #000a', zIndex: 3}} />
      <div style={{width: w, height: h, overflow: 'hidden', background: '#000', position: 'relative'}}>{children}</div>
    </div>
  );
};

const clipVol = (dur: number) => (f: number) => Math.min(1, f / 6, Math.max(0, (dur - f) / 14));

// ───────────────────────── Intro ─────────────────────────
const MONTAGE: {at: number; ids: [string, string, string]; offs: [number, number, number]}[] = [
  {at: 0, ids: ['flight19', 'flight19', 'flight19'], offs: [1, 40, 95]},
  {at: 3.3, ids: ['sodder', 'sodder', 'sodder'], offs: [2, 40, 75]},
  {at: 7.3, ids: ['mh370', 'mh370', 'mh370'], offs: [9, 30, 60]},
  {at: 11.7, ids: ['flannan', 'celeste', 'alcatraz'], offs: [3, 3, 3]},
  {at: 15.25, ids: ['dbcooper', 'hoffa', 'flannan'], offs: [3, 3, 40]},
  {at: 17.8, ids: ['mh370', 'flight19', 'sodder'], offs: [20, 20, 20]},
];
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let k = 0;
  while (k + 1 < MONTAGE.length && t >= MONTAGE[k + 1].at) k++;
  const m = MONTAGE[k];
  const segStart = fr(m.at);
  const big = (txt: React.ReactNode, a: number, b: number, size = 170) =>
    t >= a && t < b ? (
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: DISPLAY, fontSize: size, color: '#fff', textShadow: '0 10px 0 #000, 0 0 50px #000', transform: `scale(${lerp(1.3, 1, p(frame, fr(a), 8))})`, opacity: p(frame, fr(a), 6)}}>{txt}</div>
    ) : null;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {m.ids.map((id, j) => (
        <div key={`${k}-${j}`} style={{position: 'absolute', left: j * 640, top: 0, width: 640, height: 1080, overflow: 'hidden', borderRight: j < 2 ? '4px solid #000' : 'none'}}>
          <Sequence from={segStart} layout="none">
            <OffthreadVideo src={staticFile(`gone/clips/${id}.mp4`)} startFrom={fr(m.offs[j])} muted style={{width: 640, height: 1138, objectFit: 'cover', marginTop: -29}} />
          </Sequence>
        </div>
      ))}
      <AbsoluteFill style={{background: '#000', opacity: t >= 11.7 ? 0.55 : 0.35}} />
      {big(<>27 MEN <span style={{color: RED}}>GONE</span></>, 0, 3.3)}
      {big(<>5 CHILDREN. <span style={{color: RED}}>NO BONES.</span></>, 3.3, 7.3, 140)}
      {big(<>239 PEOPLE. <span style={{color: RED}}>1 AIRLINER.</span></>, 7.3, 11.7, 140)}
      {t >= 11.7 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: DISPLAY, color: '#fff', textShadow: '0 10px 0 #000, 0 0 50px #000', opacity: p(frame, fr(11.7), 10)}}>
          <div style={{fontSize: 210, lineHeight: 0.95}}>
            8 DISAPPEARANCES
          </div>
          <div style={{fontSize: 130, color: RED, marginTop: 10}}>NEVER SOLVED</div>
          {t >= 15.25 ? <div style={{fontFamily: MARKER, fontSize: 64, color: '#ffd76a', marginTop: 30, opacity: p(frame, fr(15.25), 10)}}>Every one left behind a clue…</div> : null}
        </div>
      ) : null}
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── Case card ─────────────────────────
const CaseCard: React.FC<{i: number; dur: number}> = ({i, dur}) => {
  const frame = useCurrentFrame();
  const c = CASES[i];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={staticFile(`gone/cards/${c.card}.jpg`)} style={{position: 'absolute', inset: -40, width: 2000, height: 1160, objectFit: 'cover', filter: 'blur(26px) brightness(0.4)'}} />
      <Board dim={0.55} />
      <Frame x={180} y={90} h={860} r={-2} show={p(frame, 0, 10)}>
        <Img src={staticFile(`gone/cards/${c.card}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.05, 1.15, p(frame, 0, dur, (n) => n))})`}} />
      </Frame>
      <div style={{position: 'absolute', left: 820, top: 200, right: 80}}>
        <div style={{fontFamily: MARKER, fontSize: 70, color: RED, opacity: p(frame, 2, 8)}}>CASE {String(i + 1).padStart(2, '0')} / 08</div>
        <div style={{fontFamily: DISPLAY, fontSize: c.title.length > 18 ? 104 : 140, lineHeight: 0.95, color: '#fff', textShadow: '0 8px 0 #000', marginTop: 10, transform: `translateX(${(1 - p(frame, 6, 10)) * 60}px)`, opacity: p(frame, 6, 10)}}>{c.title}</div>
        <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 44, color: '#ffd76a', marginTop: 24, opacity: p(frame, 12, 10)}}>
          {c.when} · {c.where}
        </div>
      </div>
      {frame >= 18 ? <Stamp2 at={18} x={1340} y={820} size={110} solid>UNSOLVED</Stamp2> : null}
      <LightSweep at={0} dur={30} color="#ffe0b0" strength={0.25} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── Clip in case-file layout ─────────────────────────
const CaseClip: React.FC<{i: number; dur: number; bg?: boolean}> = ({i, dur, bg}) => {
  const frame = useCurrentFrame();
  const c = CASES[i];
  const row = (label: string, val: string, at: number) => (
    <div style={{marginTop: 26, opacity: p(frame, at, 10)}}>
      <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 28, color: '#7a5a3a', letterSpacing: 2}}>{label}</div>
      <div style={{fontFamily: MARKER, fontSize: 46, color: '#15110c', lineHeight: 1.15}}>{val}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Board light={[0.3, 0.4]} />
      <Frame x={170} y={28} h={1000} r={bg ? 0 : -1.2}>
        {bg ? <div style={{width: '100%', height: '100%', background: '#00ff00'}} /> : <OffthreadVideo src={staticFile(`gone/clips/${c.id}.mp4`)} endAt={dur} volume={clipVol(dur)} style={{width: '100%', height: '100%'}} />}
      </Frame>
      <div style={{position: 'absolute', left: 860, top: 70, width: 960, height: 760, background: PAPER, boxShadow: '0 30px 60px #000c', transform: 'rotate(1deg)', padding: '40px 56px', boxSizing: 'border-box'}}>
        <div style={{position: 'absolute', top: -16, left: '50%', marginLeft: -16, width: 32, height: 32, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, #fff8, ${RED} 45%, #3a0008)`, boxShadow: '0 6px 8px #000a'}} />
        <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 30, color: RED, letterSpacing: 3}}>CASE FILE {String(i + 1).padStart(2, '0')} / 08</div>
        <div style={{fontFamily: DISPLAY, fontSize: c.title.length > 18 ? 76 : 96, color: '#15110c', lineHeight: 1, marginTop: 8}}>{c.title}</div>
        {row('WHEN · WHERE', `${c.when} · ${c.where}`, 20)}
        {row('MISSING', c.missing, 40)}
        {row('THE CLUE', c.clue, 60)}
        {frame >= 90 ? <Stamp2 at={90} x={700} y={640} size={84} r={-8}>UNSOLVED</Stamp2> : null}
      </div>
      {/* case progress */}
      <div style={{position: 'absolute', left: 860, top: 880, width: 960, display: 'flex', gap: 14}}>
        {CASES.map((q, k) => (
          <div key={q.id} style={{flex: 1, height: 150, position: 'relative', border: `5px solid ${k === i ? RED : PAPER}`, opacity: k === i ? 1 : k < i ? 0.35 : 0.7, boxShadow: k === i ? `0 0 24px ${RED}` : '0 8px 14px #000a', overflow: 'hidden', background: '#000'}}>
            <Img src={staticFile(`gone/cards/${q.card}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: '#000000b0', fontFamily: DISPLAY, fontSize: 26, color: '#fff', textAlign: 'center'}}>{String(k + 1).padStart(2, '0')}</div>
          </div>
        ))}
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/** Still background for a case (video area left as a placeholder; ffmpeg overlays the Short at x=182 y=40, 562x1000). */
export const GoneClipBg: React.FC<{i: number}> = ({i}) => <CaseClip i={i} dur={9999} bg />;

// ───────────────────────── Outro ─────────────────────────
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sub = fr(8.07);
  const pulse = 1 + 0.04 * Math.sin(frame / 5);
  return (
    <AbsoluteFill>
      <Board dim={0.25} />
      {CASES.map((c, k) => {
        const col = k % 4;
        const rowI = Math.floor(k / 4);
        return (
          <div key={c.id} style={{position: 'absolute', left: 130 + col * 430, top: 70 + rowI * 470, width: 250, padding: 10, paddingBottom: 46, background: PAPER, boxShadow: '0 16px 30px #000c', transform: `rotate(${(k % 2 ? 1 : -1) * (2 + (k % 3))}deg) scale(${lerp(1.3, 1, p(frame, k * 4, 8))})`, opacity: p(frame, k * 4, 8)}}>
            <div style={{height: 330, overflow: 'hidden'}}>
              <Img src={staticFile(`gone/cards/${c.card}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.4)'}} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', fontFamily: MARKER, fontSize: 24, color: '#15110c'}}>{c.title.length > 16 ? c.title.split(' ').slice(-1)[0] : c.title}</div>
          </div>
        );
      })}
      <AbsoluteFill style={{background: '#000', opacity: t >= 4.4 ? 0.55 : 0}} />
      {t >= 4.4 && t < 8.07 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: DISPLAY, fontSize: 120, color: '#fff', textShadow: '0 8px 0 #000', opacity: p(frame, fr(4.4), 8)}}>
          WHICH ONE GETS <span style={{color: RED}}>SOLVED FIRST?</span>
          <div style={{fontFamily: MARKER, fontSize: 60, color: '#ffd76a'}}>👇 tell me in the comments</div>
        </div>
      ) : null}
      {frame >= sub ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: p(frame, sub, 8)}}>
          <div style={{fontFamily: DISPLAY, fontSize: 96, color: '#fff', textShadow: '0 8px 0 #000'}}>A NEW UNSOLVED MYSTERY EVERY DAY</div>
          <div style={{marginTop: 40, transform: `scale(${pulse})`, background: '#e00', color: '#fff', fontFamily: 'Inter', fontWeight: 800, fontSize: 72, padding: '18px 70px', borderRadius: 60, boxShadow: '0 12px 30px #000'}}>SUBSCRIBE</div>
          <div style={{marginTop: 26, fontFamily: MARKER, fontSize: 60, color: '#ffd76a'}}>Chronos Galaxy</div>
        </div>
      ) : null}
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── Thumbnail (1280×720) ─────────────────────────
export const GoneThumb: React.FC = () => {
  const picks: [string, string, string][] = [
    ['flight19/ai/formation.png', '30% 50%', '27 MEN'],
    ['sodder/ai/fire.png', '52% 50%', '5 KIDS'],
    ['flannan/ai/storm.png', '61% 50%', '3 KEEPERS'],
    ['mh370/photos/plane.jpg', '50% 50%', '239 PEOPLE'],
  ];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Board dim={0.35} />
      {picks.map(([src, pos, label], k) => (
        <div key={src} style={{position: 'absolute', left: 40 + k * 300, top: 250 + (k % 2) * 30, width: 260, padding: 8, paddingBottom: 8, background: PAPER, transform: `rotate(${[-6, 4, -3, 6][k]}deg)`, boxShadow: '0 16px 30px #000d'}}>
          <div style={{height: 380, overflow: 'hidden', position: 'relative'}}>
            <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center', fontFamily: DISPLAY, fontSize: 52, color: '#fff', textShadow: '0 4px 0 #000, 0 0 20px #000', zIndex: 2}}>{label}</div>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
              <path d="M 8 8 L 92 92 M 92 8 L 8 92" stroke={RED} strokeWidth={4} opacity={0.75} />
            </svg>
          </div>
        </div>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 20, textAlign: 'center', fontFamily: DISPLAY, fontSize: 124, whiteSpace: 'nowrap', lineHeight: 1, color: '#fff', textShadow: '0 10px 0 #000, 0 0 40px #000'}}>
        8 VANISHED. <span style={{color: RED}}>0 ANSWERS.</span>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── Main ─────────────────────────
export const Gone: React.FC = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([document.fonts.load('400 80px Anton'), document.fonts.load('800 40px Inter')])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);
  const bed = (from: number, dur: number, off: number, vol: number) => (
    <Sequence from={from} durationInFrames={dur}>
      <Audio src={staticFile('dyatlov/music-src.mp3')} startFrom={fr(off)} volume={(f) => vol * Math.min(1, f / 15, Math.max(0, (dur - f) / 20))} />
    </Sequence>
  );
  return (
    <AbsoluteFill style={{background: '#07090c'}}>
      {PARTS.map((pt, k) => (
        <Sequence key={k} from={pt.from} durationInFrames={pt.dur}>
          {pt.kind === 'intro' ? <Intro /> : pt.kind === 'card' ? <CaseCard i={pt.i} dur={pt.dur} /> : pt.kind === 'clip' ? <CaseClip i={pt.i} dur={pt.dur} /> : <Outro />}
        </Sequence>
      ))}
      {/* narration */}
      <Sequence from={6}>
        <Audio src={staticFile('gone/vo/intro.mp3')} />
      </Sequence>
      {PARTS.filter((x) => x.kind === 'card').map((x) => (
        <Sequence key={`v${x.i}`} from={x.from + 8}>
          <Audio src={staticFile(`gone/vo/c${x.i + 1}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={PARTS[PARTS.length - 1].from + 10}>
        <Audio src={staticFile('gone/vo/outro.mp3')} />
      </Sequence>
      {/* music bed + sfx under the new sections only (the Shorts carry their own mix) */}
      {bed(0, INTRO, 0, 0.16)}
      {PARTS.filter((x) => x.kind === 'card').map((x) => (
        <React.Fragment key={`b${x.i}`}>
          {bed(x.from, x.dur, 20 + x.i * 15, 0.12)}
          <Sequence from={x.from} durationInFrames={40}>
            <Audio src={staticFile('sfx/whoosh2.wav')} volume={0.45} />
          </Sequence>
          <Sequence from={x.from + 18} durationInFrames={40}>
            <Audio src={staticFile('sfx/impact.wav')} volume={0.5} />
          </Sequence>
        </React.Fragment>
      ))}
      {bed(PARTS[PARTS.length - 1].from, OUTRO, 120, 0.14)}
      <Sequence from={0} durationInFrames={40}>
        <Audio src={staticFile('sfx/impact.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={fr(11.7)} durationInFrames={40}>
        <Audio src={staticFile('sfx/impact.wav')} volume={0.55} />
      </Sequence>
    </AbsoluteFill>
  );
};
