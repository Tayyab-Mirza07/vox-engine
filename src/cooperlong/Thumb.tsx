import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import {DISPLAY, rnd} from '../lib';
import {Faller, Forest, Jet} from '../dbcooper/parts';

const RED = '#e63946';

/** YouTube thumbnail (1280×720): FBI sketch face, jet + falling silhouette below, "WHERE DID HE GO?". */
export const CooperThumb: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #05070c 0%, #0c1626 70%, #101a2a 100%)', overflow: 'hidden'}}>
    {/* rain + clouds */}
    <svg width={1280} height={720} style={{position: 'absolute'}}>
      {Array.from({length: 6}, (_, i) => <ellipse key={i} cx={rnd(i) * 1280} cy={120 + rnd(i + 9) * 380} rx={260} ry={50} fill="#1b2638" opacity={0.55} />)}
      {Array.from({length: 140}, (_, i) => {
        const x = rnd(i + 3) * 1300;
        const y = rnd(i + 70) * 720;
        return <line key={`r${i}`} x1={x} y1={y} x2={x - 10} y2={y + 40} stroke="#9fb4cf" strokeWidth={2} opacity={0.25} />;
      })}
    </svg>
    {/* the face: FBI composite sketch (public domain), big on the right */}
    <div style={{position: 'absolute', right: -30, top: -10, width: 600, height: 740, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 28%, #000 100%)', maskImage: 'linear-gradient(90deg, transparent 0%, #000 28%, #000 100%)'}}>
      <Img src={staticFile('cooperlong/photos/sketch.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', filter: 'grayscale(1) contrast(1.35) brightness(0.95)'}} />
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 55%, #0c1626 100%)`}} />
    </div>
    {/* jet with open stairs and a falling man below */}
    <div style={{position: 'absolute', left: 40, top: 330, transform: 'rotate(-6deg)'}}>
      <Jet width={520} stairs={1} lights={false} />
    </div>
    <div style={{position: 'absolute', left: 150, top: 470, transform: 'rotate(35deg)', filter: `drop-shadow(0 0 18px ${RED})`}}>
      <Faller size={120} color="#000" />
    </div>
    <svg width={400} height={260} style={{position: 'absolute', left: 120, top: 420}}>
      <path d="M 40 20 Q 70 90 90 160" stroke={RED} strokeWidth={6} strokeDasharray="14 12" fill="none" />
    </svg>
    <div style={{position: 'absolute', left: 0, top: 590}}>
      <Forest width={1280} height={140} color="#020406" seed={4} />
    </div>
    {/* headline */}
    <div style={{position: 'absolute', left: 36, top: 26, fontFamily: DISPLAY, fontSize: 132, lineHeight: 0.95, color: RED, letterSpacing: 2, textShadow: '0 6px 0 #000, 0 0 40px #000', WebkitTextStroke: '6px #000', paintOrder: 'stroke fill'}}>
      WHERE DID
      <br />
      HE GO?
    </div>
    <div style={{position: 'absolute', right: 30, bottom: 26, fontFamily: DISPLAY, fontSize: 64, color: '#f2c94c', WebkitTextStroke: '5px #000', paintOrder: 'stroke fill', textShadow: '0 4px 0 #000'}}>$200,000</div>
  </AbsoluteFill>
);
