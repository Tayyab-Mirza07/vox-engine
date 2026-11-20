import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Globe, LonLat} from '../geo';
import {BODY, C, Cues, DISPLAY, W, inOut, lerp, p, rnd, slam} from '../lib';
import {Background, Figure, Headline, Photo, Stamp, Tag} from '../ui';
import {Paper, Typed} from '../dbcooper/parts';

export const HOT = '#ff8a3d';
export const CODE = '#5dff9a';

type SceneProps = {cue: Cues};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const NETHERLANDS: LonLat = [5.3, 52.1];

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 120, color = C.white, style}) => (
  <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1.02, letterSpacing: 3, color, textAlign: 'center', textShadow: '0 8px 40px #000', ...style}}>{children}</div>
);
const H: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: HOT}}>{children}</span>;
const R: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: C.red}}>{children}</span>;

/** Scrolling hex dump, with one highlighted "hidden" block. */
const HexWall: React.FC<{highlight?: number; rows?: number}> = ({highlight = 0, rows = 26}) => {
  const frame = useCurrentFrame();
  const off = Math.floor(frame / 2);
  return (
    <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 34, lineHeight: 1.5, color: CODE, opacity: 0.85, whiteSpace: 'pre'}}>
      {Array.from({length: rows}, (_, r) => {
        const n = r + off;
        const addr = (0x4a3f00 + n * 16).toString(16).toUpperCase().padStart(8, '0');
        const bytes = Array.from({length: 8}, (_, k) => Math.floor(rnd(n * 13 + k) * 256).toString(16).toUpperCase().padStart(2, '0')).join(' ');
        const hot = r >= 11 && r <= 14;
        return (
          <div key={r} style={{color: hot ? HOT : CODE, background: hot ? `rgba(255,138,61,${0.18 * highlight})` : 'transparent', opacity: hot ? 1 : 0.55}}>
            {addr}  {bytes}
          </div>
        );
      })}
    </div>
  );
};

const CoffeeCup: React.FC<{size: number; glow?: number}> = ({size, glow = 1}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" style={{filter: `drop-shadow(0 0 ${40 * glow}px ${HOT})`}}>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${90 + i * 35} 90 Q ${78 + i * 35} ${65 - ((frame + i * 10) % 30)} ${96 + i * 35} ${30 - ((frame + i * 10) % 30)}`} fill="none" stroke={HOT} strokeOpacity={0.6} strokeWidth={8} strokeLinecap="round" />
      ))}
      <path d="M 50 110 L 210 110 Q 200 230 130 230 Q 60 230 50 110 Z" fill="#3a2414" stroke={HOT} strokeWidth={8} />
      <path d="M 205 130 Q 255 130 245 165 Q 238 190 196 185" fill="none" stroke={HOT} strokeWidth={10} />
    </svg>
  );
};

const Disc: React.FC<{size: number; lock?: number; spin?: number}> = ({size, lock = 0, spin = 0}) => (
  <svg width={size} height={size} viewBox="-120 -120 240 240" style={{transform: `rotate(${spin}deg)`}}>
    <defs>
      <radialGradient id="disc" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#e6ecf5" />
        <stop offset="45%" stopColor="#9aa8bd" />
        <stop offset="70%" stopColor="#c9b6ff" />
        <stop offset="100%" stopColor="#7f9cc4" />
      </radialGradient>
    </defs>
    <circle r={112} fill="url(#disc)" stroke="#3a4a5c" strokeWidth={4} />
    <circle r={30} fill="#07090c" stroke="#3a4a5c" strokeWidth={4} />
    <circle r={12} fill="#11161c" />
    <g opacity={lock} transform="translate(0, 4)">
      <path d="M -26 -10 L -26 -38 Q 0 -70 26 -38 L 26 -10" fill="none" stroke={C.red} strokeWidth={10} />
      <rect x={-38} y={-12} width={76} height={60} rx={10} fill={C.red} />
    </g>
  </svg>
);

const Shelf: React.FC<{pulled: number}> = ({pulled}) => (
  <svg width={940} height={460} viewBox="0 0 940 460">
    {[0, 1].map((row) => (
      <g key={row} transform={`translate(0, ${row * 220})`}>
        <rect x={0} y={190} width={940} height={20} fill="#3a2a1c" />
        {Array.from({length: 9}, (_, i) => {
          const gone = (i + row * 9) / 18 < pulled;
          return (
            <g key={i} opacity={gone ? 0 : 1} transform={`translate(${30 + i * 100}, ${gone ? -40 : 0})`}>
              <rect x={0} y={40} width={80} height={150} rx={6} fill="#1c2633" stroke={HOT} strokeOpacity={0.5} strokeWidth={3} />
              <rect x={10} y={56} width={60} height={40} fill={HOT} opacity={0.35} />
            </g>
          );
        })}
      </g>
    ))}
  </svg>
);

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [never] = [cue.s(1)];
  const consequences = [
    {at: cue.w('pulled'), label: 'PULLED FROM SHELVES'},
    {at: cue.w('government'), label: 'GOVERNMENT INVESTIGATION'},
    {at: cue.w('millions'), label: 'MILLIONS LOST'},
  ];
  return (
    <AbsoluteFill style={{background: '#050806'}}>
      <div style={{position: 'absolute', top: 150, left: 80, transform: `scale(${lerp(1, 1.1, p(frame, 0, cue.dur))})`, transformOrigin: '50% 40%'}}>
        <HexWall highlight={p(frame, cue.w('hidden') - 4, 10)} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, transparent 30%, #000000e0 100%)'}} />
      <Headline at={0} until={cue.w('pulled') - 1} size={140} y={170} color={HOT}>
        2005
      </Headline>
      {frame >= cue.w('pulled') && frame < never ? (
        <div style={{position: 'absolute', top: 260, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 26}}>
          {consequences.map((c, i) => {
            const s = slam(frame, c.at, 1.8);
            return (
              <div key={c.label} style={{opacity: frame >= c.at ? s.opacity : 0, transform: `scale(${s.scale}) rotate(${(i - 1) * 2}deg)`, background: '#07090cee', border: `6px solid ${C.red}`, borderRadius: 16, padding: '12px 20px'}}>
                <Big size={78} color={C.red}>
                  {c.label}
                </Big>
              </div>
            );
          })}
        </div>
      ) : null}
      {frame >= never ? (
        <Center top={700}>
          <Paper width={900} rotate={-1.5} style={{padding: '30px 36px'}}>
            <Typed text="// this code was never supposed to be found" at={never} cps={24} style={{fontSize: 52, lineHeight: 1.3}} />
          </Paper>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};


/** Generic black game console with a disc tray (drawn, no trademarked artwork). */
const Console: React.FC<{width: number; zoom?: number}> = ({width, zoom = 1}) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 20) % 2 ? 1 : 0.35;
  return (
    <svg width={width} height={(width * 520) / 900} viewBox="0 0 900 520" style={{transform: `scale(${zoom})`, overflow: 'visible', filter: `drop-shadow(0 30px 60px #000) drop-shadow(0 0 40px ${HOT}33)`}}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2f38" />
          <stop offset="100%" stopColor="#0b0d11" />
        </linearGradient>
      </defs>
      <path d="M 80 140 L 820 140 L 860 380 L 40 380 Z" fill="url(#cg)" stroke="#3b4250" strokeWidth={4} />
      <rect x={40} y={380} width={820} height={70} rx={8} fill="#14171d" stroke="#3b4250" strokeWidth={4} />
      {Array.from({length: 14}, (_, i) => (
        <line key={i} x1={120 + i * 48} y1={170} x2={100 + i * 50} y2={350} stroke="#000" strokeOpacity={0.45} strokeWidth={6} />
      ))}
      <rect x={90} y={396} width={460} height={18} rx={9} fill="#050608" />
      <circle cx={700} cy={415} r={16} fill="#050608" stroke="#3b4250" strokeWidth={3} />
      <circle cx={760} cy={415} r={10} fill={CODE} opacity={blink} style={{filter: `drop-shadow(0 0 10px ${CODE})`}} />
      <rect x={600} y={404} width={50} height={22} rx={4} fill="#050608" />
    </svg>
  );
};

// ───────────────────────── 1 · The game ─────────────────────────
export const TheGame: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [secret, name] = [cue.s(1), cue.w('Hot')];
  return (
    <AbsoluteFill>
      <Background tint={HOT} />
      {frame < secret ? (
        <>
          <Headline at={2} size={100} y={170}>
            Grand Theft Auto: <H>San Andreas</H>
          </Headline>
          <Center top={470} style={{opacity: p(frame, 4, 8)}}>
            <Console width={900} zoom={lerp(1.05, 1, p(frame, 0, 60))} />
          </Center>
          <Center top={1080} style={{opacity: p(frame, cue.w('best-selling') - 4, 8)}}>
            <Tag color={HOT} style={{fontSize: 44, padding: '12px 26px'}}>Best-selling PS2 game</Tag>
          </Center>
        </>
      ) : (
        <>
          <Headline at={secret} size={96} y={170}>
            The secret had a <H>strange name</H>
          </Headline>
          <Center top={460}>
            <CoffeeCup size={520} glow={p(frame, name - 4, 10)} />
          </Center>
          {frame >= name - 2 ? (
            <Center top={1020} style={{opacity: slam(frame, name - 2, 2).opacity, transform: `scale(${slam(frame, name - 2, 2).scale})`}}>
              <Big size={190} color={HOT} style={{textShadow: `0 0 50px ${HOT}`}}>
                HOT COFFEE
              </Big>
            </Center>
          ) : null}
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Re-hook 1 ─────────────────────────
export const RehookHow: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const fan = cue.s(1);
  const q = slam(frame, 2, 2.4);
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      {frame < fan ? (
        <>
          <Center top={240} style={{opacity: q.opacity, transform: `scale(${q.scale})`}}>
            <Big size={360} color={C.red}>
              ?
            </Big>
          </Center>
          <Center top={760}>
            <Big size={104}>
              How did <H>locked code</H>
              <br />
              nearly take down <R>Rockstar?</R>
            </Big>
          </Center>
        </>
      ) : (
        <>
          <Headline at={fan} size={96} y={150}>
            One curious fan in <H>the Netherlands</H>
          </Headline>
          <div style={{position: 'absolute', top: 330, left: 40}}>
            <Globe width={1000} height={900} center={[5.3, 50]} scale={interpolate(frame, [fan, fan + 40], [700, 2000], {...clamp, easing: inOut})} frame={frame} highlight={['Netherlands']} routes={[]} pins={[{at: NETHERLANDS, label: 'THE NETHERLANDS', show: p(frame, fan + 30, 8), align: 'right'}]} />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · The modder ─────────────────────────
export const Modder: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [digging, finds] = [cue.s(1), cue.s(2)];
  const files = ['gta3.img', 'main.scm', 'script.img', 'player.img', 'unused_scene.dat'];
  return (
    <AbsoluteFill>
      <Background tint={CODE} />
      <Headline at={2} size={110} y={150}>
        <H>June 2005</H>
      </Headline>
      <Center top={340}>
        <div style={{width: 940, height: 640, background: '#0b0f0c', border: `8px solid #3a4a5c`, borderRadius: 20, padding: 34, boxSizing: 'border-box', boxShadow: `0 0 60px ${CODE}33`}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, color: C.dim, letterSpacing: 4, marginBottom: 20}}>C:\GAMES\SAN ANDREAS\DATA</div>
          {files.map((fn, i) => {
            const hit = i === files.length - 1;
            const show = p(frame, digging + i * 6, 6);
            return (
              <div key={fn} style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 48, color: hit && frame >= finds ? HOT : CODE, opacity: show, padding: '6px 14px', borderRadius: 8, background: hit && frame >= finds ? 'rgba(255,138,61,0.18)' : 'transparent', border: hit && frame >= finds ? `3px solid ${HOT}` : '3px solid transparent'}}>
                📄 {fn}
              </div>
            );
          })}
        </div>
      </Center>
      <Center top={1030} style={{opacity: p(frame, 6, 8)}}>
        <Paper width={760} rotate={-1.5} style={{padding: '18px 26px', textAlign: 'center'}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 5, opacity: 0.6}}>DUTCH MODDER</div>
          <div style={{fontFamily: DISPLAY, fontSize: 72}}>PATRICK WILDENBORG</div>
        </Paper>
      </Center>
      {frame >= finds ? (
        <Stamp at={cue.w('never') - 2} y={760} size={100} color={HOT}>
          Cut, but never deleted
        </Stamp>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Locked on every disc ─────────────────────────
export const Locked: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [off] = [cue.s(1)];
  const discs = p(frame, cue.w('every') - 4, 30);
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      <Headline at={2} until={off - 1} size={96} y={170}>
        An unfinished, <R>adults-only</R> mini-game
      </Headline>
      <Headline at={off} size={96} y={170}>
        Switched off, but <H>left on the disc</H>
      </Headline>
      <Center top={460}>
        <Disc size={520} lock={p(frame, cue.w('switched') - 4, 8)} spin={frame * 2} />
      </Center>
      <div style={{position: 'absolute', top: 1040, left: 60, right: 60, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10}}>
        {Array.from({length: 24}, (_, i) => (
          <div key={i} style={{opacity: i / 24 < discs ? 1 : 0}}>
            <Disc size={70} lock={1} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · The name ─────────────────────────
export const TheName: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [named, spread] = [cue.s(1), cue.s(2)];
  const dots = p(frame, spread, 40);
  return (
    <AbsoluteFill>
      <Background tint={HOT} />
      {frame < spread ? (
        <>
          <Headline at={2} size={96} y={170}>
            “Come in for <H>coffee</H>”
          </Headline>
          <Center top={460}>
            <CoffeeCup size={560} glow={p(frame, named, 10)} />
          </Center>
          {frame >= named ? (
            <Center top={1060} style={{opacity: p(frame, named, 8)}}>
              <Big size={150} color={HOT}>
                HOT COFFEE
              </Big>
            </Center>
          ) : null}
        </>
      ) : (
        <>
          <Headline at={spread} size={110} y={170}>
            Within days: <H>everywhere</H>
          </Headline>
          <div style={{position: 'absolute', top: 330, left: 40}}>
            <Globe width={1000} height={900} center={[-30, 35]} scale={460} frame={frame} routes={[]} pins={[]} />
          </div>
          <svg width={W} height={900} style={{position: 'absolute', top: 330}}>
            {Array.from({length: 40}, (_, i) => {
              const show = i / 40 < dots;
              return <circle key={i} cx={260 + rnd(i) * 560} cy={220 + rnd(i + 50) * 480} r={show ? 10 + (frame % 20) / 4 : 0} fill={HOT} opacity={0.8} />;
            })}
          </svg>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Denial ─────────────────────────
export const Denial: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background tint={HOT} />
      <Headline at={2} size={100} y={170}>
        Rockstar's <H>first response</H>
      </Headline>
      <Center top={460} style={{opacity: p(frame, 4, 8)}}>
        <Paper width={900} rotate={-2} style={{padding: '40px 44px'}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, opacity: 0.6}}>PRESS RESPONSE · SUMMARY</div>
          <div style={{fontFamily: DISPLAY, fontSize: 96, lineHeight: 1.1, marginTop: 16}}>
            BLAME THE <span style={{color: '#a3271c'}}>HACKERS</span>
          </div>
          <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 38, marginTop: 16, lineHeight: 1.4}}>The content was made by modders, not by us.</div>
        </Paper>
      </Center>
      <Center top={1060} style={{opacity: p(frame, 30, 8)}}>
        <Tag color={C.white}>Paraphrased</Tag>
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Re-hook 2: the PS2 discs ─────────────────────────
export const RehookProof: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const box = cue.s(1);
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      <Headline at={2} until={box - 1} size={96} y={150}>
        The same scene on <H>PlayStation 2</H>
      </Headline>
      <Headline at={box} size={96} y={150}>
        You can't mod a disc <R>in the box</R>
      </Headline>
      <Center top={420} style={{opacity: p(frame, 2, 8)}}>
        <Console width={900} zoom={lerp(1.1, 1.25, p(frame, 0, 120))} />
      </Center>
      <Center top={980} style={{opacity: p(frame, cue.w('cheat') - 4, 8)}}>
        <div style={{background: '#11161c', border: `4px solid ${CODE}`, borderRadius: 16, padding: '14px 26px', fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 44, color: CODE}}>
          CHEAT DEVICE ▸ UNLOCK HIDDEN SCENE ▸ <span style={{color: HOT}}>FOUND</span>
        </div>
      </Center>
      <Stamp at={box + 6} y={760} size={150}>
        Busted
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · The rating ─────────────────────────
export const Rating: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [shelves] = [cue.s(1)];
  const flip = p(frame, cue.w('Adults') - 4, 14, inOut);
  const box = (label: string, sub: string, color: string) => (
    <div style={{width: 360, height: 460, background: C.white, border: '12px solid #07090c', borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: DISPLAY, fontSize: 260, lineHeight: 1, color}}>{label}</div>
      <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, color: '#07090c', letterSpacing: 4, marginTop: 10}}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      <Headline at={2} until={shelves - 1} size={100} y={150}>
        <H>July 2005</H>: the rating changes
      </Headline>
      <Headline at={shelves} size={96} y={150}>
        Pulled from <R>the shelves</R>
      </Headline>
      {frame < shelves ? (
        <Center top={460}>
          <div style={{transform: `rotateY(${flip * 180}deg)`, transformStyle: 'preserve-3d'}}>
            {flip < 0.5 ? box('M', 'MATURE 17+', '#07090c') : <div style={{transform: 'rotateY(180deg)'}}>{box('AO', 'ADULTS ONLY 18+', C.red)}</div>}
          </div>
        </Center>
      ) : (
        <Center top={480}>
          <Shelf pulled={p(frame, shelves + 4, 60)} />
        </Center>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Investigation ─────────────────────────
export const Investigation: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const ftc = cue.w('Federal');
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      <Headline at={2} size={96} y={140}>
        A senator calls for an <R>investigation</R>
      </Headline>
      <Center top={340} style={{opacity: p(frame, 2, 8)}}>
        <Photo src="coffee/photos/clinton.jpg" width={560} height={680} zoom={lerp(1.08, 1, p(frame, 0, 60))} focus="50% 25%" credit="Sen. Hillary Clinton, official portrait · U.S. Senate, public domain" accent={C.red} />
      </Center>
      <Stamp at={ftc} y={1140} size={110}>
        FTC investigation
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · Lawsuits ─────────────────────────
export const Lawsuits: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [suits] = [cue.s(1)];
  const gran = cue.w('85-year-old') - 4;
  return (
    <AbsoluteFill>
      <Background tint={HOT} />
      <Headline at={2} until={suits - 1} size={100} y={160}>
        Copies <H>sent back</H>
      </Headline>
      <Headline at={suits} size={100} y={160}>
        The <R>lawsuits</R> pile up
      </Headline>
      {frame < suits ? (
        <Center top={480}>
          <Shelf pulled={1} />
        </Center>
      ) : (
        <>
          <svg width={W} height={600} style={{position: 'absolute', top: 360}}>
            {Array.from({length: 10}, (_, i) => (
              <g key={i} opacity={p(frame, suits + i * 3, 5)} transform={`translate(${150 + (i % 5) * 30}, ${380 - i * 26}) rotate(${(rnd(i) - 0.5) * 10})`}>
                <rect width={300} height={60} rx={4} fill="#efe6cf" stroke="#bfae84" strokeWidth={3} />
              </g>
            ))}
            <g opacity={p(frame, gran, 8)}>
              <Figure x={760} y={520} h={300} color={HOT} />
              <text x={760} y={570} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={34} fill={HOT} letterSpacing={3}>
                AGE 85
              </text>
            </g>
          </svg>
          <Center top={1000} style={{opacity: p(frame, gran + 20, 8)}}>
            <Tag color={C.white} style={{fontSize: 40}}>She bought it for her grandson</Tag>
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · Re-hook 3 ─────────────────────────
export const RehookEnd: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const q = slam(frame, 2, 2.4);
  return (
    <AbsoluteFill>
      <Background tint={HOT} />
      <Center top={300} style={{opacity: q.opacity, transform: `scale(${q.scale})`}}>
        <Big size={360} color={HOT}>
          ?
        </Big>
      </Center>
      <Center top={820}>
        <Big size={120}>
          How did it <H>end?</H>
        </Big>
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The settlement ─────────────────────────
export const Settlement: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const few = cue.s(1);
  return (
    <AbsoluteFill>
      <Background tint={HOT} />
      <Headline at={2} size={100} y={160}>
        A <H>class-action</H> settlement
      </Headline>
      <Center top={420} style={{opacity: p(frame, 4, 8), transform: `rotate(-3deg)`}}>
        <div style={{width: 900, background: 'linear-gradient(135deg, #e9f2e3, #cfe0c4)', borderRadius: 16, padding: '34px 40px', boxShadow: '0 30px 80px #000', color: '#14301a'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 4}}>
            <span>SETTLEMENT REFUND</span>
            <span>CLASS ACTION</span>
          </div>
          <div style={{fontFamily: DISPLAY, fontSize: 170, lineHeight: 1.1, marginTop: 10}}>UP TO $35</div>
          <div style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 34, borderTop: '3px solid #14301a', paddingTop: 10}}>per buyer, with proof of purchase</div>
        </div>
      </Center>
      {frame >= few ? (
        <Center top={1000} style={{opacity: p(frame, few, 8)}}>
          <div style={{textAlign: 'center'}}>
            <Big size={70}>People who claimed it:</Big>
            <Big size={130} color={HOT}>
              only a few thousand
            </Big>
          </div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · The FTC ─────────────────────────
export const Warning: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const warn = cue.w('warning');
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      <Headline at={2} size={100} y={160}>
        The <H>FTC</H> settles
      </Headline>
      <Center top={420} style={{opacity: p(frame, 4, 8)}}>
        <Paper width={880} rotate={-2} style={{padding: '40px 44px'}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, opacity: 0.6}}>SETTLEMENT · 2006</div>
          <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 46, marginTop: 18, lineHeight: 1.5}}>
            FINE:
            <br />
            FUTURE VIOLATIONS:
          </div>
        </Paper>
      </Center>
      <Stamp at={cue.w('fine') - 2} y={640} size={110} color="#2e8b3d" rotate={-4}>
        None
      </Stamp>
      <Stamp at={warn} y={1060} size={120}>
        Steep penalties
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · The new rules ─────────────────────────
export const NewRules: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [rule, sold] = [cue.s(1), cue.s(2)];
  const copies = Math.round(interpolate(frame, [sold + 4, sold + 50], [0, 27], {...clamp, easing: inOut}));
  return (
    <AbsoluteFill>
      <Background tint={CODE} />
      <Headline at={2} until={sold - 1} size={100} y={160}>
        The rules <H>changed for good</H>
      </Headline>
      {frame < sold ? (
        <Center top={440} style={{opacity: p(frame, rule - 6, 8)}}>
          <Paper width={900} rotate={-1.5} style={{padding: '40px 44px'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, opacity: 0.6}}>GAME RATING RULES · AFTER HOT COFFEE</div>
            <Typed text="Publishers must disclose ALL content on the disc, including content players can't reach." at={rule} cps={30} style={{fontSize: 50, lineHeight: 1.35}} />
          </Paper>
        </Center>
      ) : (
        <>
          <Headline at={sold} size={96} y={160}>
            The re-released game <H>kept selling</H>
          </Headline>
          <Center top={560}>
            <div style={{textAlign: 'center'}}>
              <Big size={300} color={HOT}>
                {copies}M+
              </Big>
              <Big size={70}>copies sold</Big>
            </div>
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · CTA ─────────────────────────
export const CallToAction: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [ship, both, tap] = [cue.s(1), cue.s(2), cue.s(3)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  const card = (src: string, title: string, at: number, active: boolean) => {
    const s = slam(frame, at, 1.4);
    return (
      <div style={{width: 470, opacity: frame >= at ? s.opacity : 0, transform: `scale(${(frame >= at ? s.scale : 1) * (active ? pulse : 1)})`}}>
        <div style={{position: 'relative', borderRadius: 24, overflow: 'hidden', border: `6px solid ${active ? HOT : C.line}`, boxShadow: active ? `0 0 60px ${HOT}88` : 'none'}}>
          <Img src={staticFile(src)} style={{width: '100%', display: 'block'}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: 120, height: 120, borderRadius: '50%', background: '#000000aa', border: `5px solid ${C.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, color: C.white, paddingLeft: 10}}>▶</div>
          </div>
        </div>
        <div style={{fontFamily: DISPLAY, fontSize: 50, color: C.white, textAlign: 'center', marginTop: 16, lineHeight: 1.05}}>{title}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Background tint={HOT} />
      <Headline at={2} size={120} y={130} color={HOT}>
        Watch next
      </Headline>
      <div style={{position: 'absolute', top: 330, left: 50, right: 50, display: 'flex', justifyContent: 'space-between'}}>
        {card('coffee/cta/dbcooper.jpg', 'THE MAN WHO VANISHED FROM A PLANE', 6, frame < ship)}
        {card('coffee/cta/celeste.jpg', 'THE GHOST SHIP WITH NO ONE ON BOARD', ship, frame >= ship && frame < both)}
      </div>
      {frame >= both ? (
        <Center top={1010} style={{opacity: p(frame, both, 8)}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 36, color: C.dim, letterSpacing: 5}}>BOTH ON THIS CHANNEL</div>
            <div style={{fontFamily: DISPLAY, fontSize: 96, color: C.white, letterSpacing: 3, marginTop: 6}}>CHRONOS GALAXY</div>
          </div>
        </Center>
      ) : null}
      {frame >= tap ? (
        <Center top={1215} style={{transform: `scale(${pulse})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 62, color: '#07090c', background: HOT, padding: '14px 40px', borderRadius: 18, letterSpacing: 2}}>TAP · FOLLOW · WATCH NEXT</div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};
