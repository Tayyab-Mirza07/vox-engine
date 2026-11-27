import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import {DISPLAY, rnd} from '../lib';
import {Faller} from '../dbcooper/parts';

const RED = '#e3172b';

/** Boeing 727 seen from below: swept wings, T-tail, three tail engines, rear airstair hanging open. Nose up. */
const Jet727Below: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="-200 -200 400 400" style={{overflow: 'visible'}}>
    <defs>
      <linearGradient id="belly" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#5d6878" />
        <stop offset="50%" stopColor="#c9d2dd" />
        <stop offset="100%" stopColor="#4a5463" />
      </linearGradient>
      <linearGradient id="wing" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b7c1cd" />
        <stop offset="100%" stopColor="#56606e" />
      </linearGradient>
    </defs>
    {/* wings */}
    <path d="M -14 -30 L -190 50 L -190 66 L -14 22 Z" fill="url(#wing)" />
    <path d="M 14 -30 L 190 50 L 190 66 L 14 22 Z" fill="url(#wing)" />
    {/* fuselage */}
    <rect x={-20} y={-185} width={40} height={330} rx={20} fill="url(#belly)" />
    {/* T-tail stabilizer */}
    <path d="M -6 120 L -78 160 L -78 170 L -6 152 Z M 6 120 L 78 160 L 78 170 L 6 152 Z" fill="url(#wing)" />
    {/* 3 tail engines */}
    <rect x={-40} y={92} width={18} height={44} rx={8} fill="#3c4552" />
    <rect x={22} y={92} width={18} height={44} rx={8} fill="#3c4552" />
    {/* open rear airstair, lit from inside */}
    <path d="M -9 140 L 9 140 L 14 196 L -14 196 Z" fill="#7a6a4a" stroke="#ffd98a" strokeWidth={2} />
    {Array.from({length: 6}, (_, i) => <line key={i} x1={-12} x2={12} y1={148 + i * 8} y2={148 + i * 8} stroke="#ffd98a" strokeWidth={1.5} opacity={0.8} />)}
    <circle cx={0} cy={144} r={22} fill="#ffcf73" opacity={0.25} />
    {/* nav lights */}
    <circle cx={-188} cy={60} r={5} fill="#ff3b3b" />
    <circle cx={188} cy={60} r={5} fill="#3bff7a" />
  </svg>
);

/** Rough red paint-brush banner behind text. */
const Brush: React.FC<{width: number; height: number; children: React.ReactNode}> = ({width, height, children}) => (
  <div style={{position: 'relative', width, height}}>
    <svg width={width} height={height} viewBox="0 0 600 140" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
      <defs>
        <filter id="rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.25" numOctaves={3} seed={4} />
          <feDisplacementMap in="SourceGraphic" scale={18} />
        </filter>
      </defs>
      <g filter="url(#rough)">
        <path d="M 20 30 Q 300 8 585 22 L 575 120 Q 300 134 12 118 Z" fill={RED} />
        <path d="M 0 52 L 40 40 L 30 100 L 4 92 Z M 600 50 L 560 36 L 572 110 L 598 96 Z" fill={RED} opacity={0.85} />
      </g>
    </svg>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
  </div>
);

/** YouTube thumbnail v4 (1280×720): 3D jump render as the background, FBI sketch on the left with red glow, UNSOLVED brush. */
export const CooperThumb2: React.FC = () => (
  <AbsoluteFill style={{background: '#05080f', overflow: 'hidden'}}>
    <Img src={staticFile('cooperlong/photos/jump-3d.png')} style={{position: 'absolute', inset: 0, width: 1280, height: 720, filter: 'contrast(1.12) saturate(1.15) brightness(1.05)'}} />
    {/* FBI sketch on the left, red rim glow */}
    <div style={{position: 'absolute', left: 0, top: 0, width: 520, height: 720, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, #000 70%, transparent 100%)', maskImage: 'linear-gradient(90deg, #000 70%, transparent 100%)'}}>
      <Img src={staticFile('cooperlong/photos/sketch.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%', filter: 'grayscale(1) sepia(0.3) contrast(1.45) brightness(1.05)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 40%, rgba(227,23,43,0.6) 80%)', mixBlendMode: 'multiply'}} />
      <div style={{position: 'absolute', inset: 0, boxShadow: 'inset -50px 0 80px rgba(227,23,43,0.75)'}} />
    </div>
    <div style={{position: 'absolute', left: 20, top: 575, transform: 'rotate(-4deg)'}}>
      <Brush width={560} height={135}>
        <span style={{fontFamily: DISPLAY, fontSize: 104, color: '#fff', letterSpacing: 4, textShadow: '0 5px 0 rgba(0,0,0,0.5)', marginTop: -6}}>UNSOLVED</span>
      </Brush>
    </div>
  </AbsoluteFill>
);
