import React, {useMemo} from 'react';
import {geoAlbersUsa, geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import us from 'us-atlas/states-10m.json';
import {BODY, C} from './lib';

export type LonLat = [number, number];

export const PLACES = {
  taiwan: [120.6, 23.6] as LonLat,
  thailand: [100.5, 13.75] as LonLat,
  tacoma: [-122.44, 47.25] as LonLat,
  oneida: [-83.65, 37.27] as LonLat,
  portland: [-122.68, 45.52] as LonLat,
  sanJose: [-121.89, 37.34] as LonLat,
};

const countries = (feature(world as any, (world as any).objects.countries) as any).features as any[];
const states = (feature(us as any, (us as any).objects.states) as any).features as any[];

export type Route = {from: LonLat; to: LonLat; progress: number};
export type Pin = {at: LonLat; label: string; show: number; align?: 'left' | 'right'};

const PinMark: React.FC<{x: number; y: number; label: string; show: number; align?: 'left' | 'right'; pulse: number}> = ({
  x,
  y,
  label,
  show,
  align = 'right',
  pulse,
}) => {
  if (show <= 0) return null;
  const w = label.length * 21 + 36;
  const lx = align === 'right' ? 26 : -26 - w;
  return (
    <g transform={`translate(${x}, ${y})`} opacity={show}>
      <circle r={14 + pulse * 40} fill="none" stroke={C.green} strokeWidth={4} opacity={1 - pulse} />
      <circle r={13 * show} fill={C.green} stroke={C.white} strokeWidth={4} />
      <g transform={`translate(${lx}, -27) scale(${0.6 + 0.4 * show})`}>
        <rect width={w} height={54} rx={8} fill={C.white} />
        <text x={w / 2} y={38} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={32} letterSpacing={2} fill={C.bg}>
          {label}
        </text>
      </g>
    </g>
  );
};

/** Dark orthographic globe with animated great-circle routes and pins. */
export const Globe: React.FC<{
  width: number;
  height: number;
  center: LonLat;
  scale: number;
  routes: Route[];
  pins: Pin[];
  highlight?: string[];
  frame: number;
}> = ({width, height, center, scale, routes, pins, highlight = [], frame}) => {
  const projection = geoOrthographic()
    .translate([width / 2, height / 2])
    .scale(scale)
    .rotate([-center[0], -center[1]])
    .clipAngle(90);
  const path = geoPath(projection);
  const pulse = (frame % 30) / 30;
  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="ocean" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#16202b" />
          <stop offset="100%" stopColor="#090d12" />
        </radialGradient>
      </defs>
      <circle cx={width / 2} cy={height / 2} r={scale + 26} fill={C.green} opacity={0.08} />
      <circle cx={width / 2} cy={height / 2} r={scale} fill="url(#ocean)" stroke={C.green} strokeOpacity={0.5} strokeWidth={3} />
      <path d={path(geoGraticule10()) ?? ''} fill="none" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={1} />
      {countries.map((c, i) => {
        const hot = highlight.includes(c.properties.name);
        return (
          <path
            key={i}
            d={path(c) ?? ''}
            fill={hot ? C.green : '#243140'}
            fillOpacity={hot ? 0.55 : 1}
            stroke={hot ? C.green : '#3a4a5c'}
            strokeWidth={hot ? 2.5 : 1}
          />
        );
      })}
      {routes.map((r, i) => {
        if (r.progress <= 0) return null;
        const interp = geoInterpolate(r.from, r.to);
        const n = 48;
        const coords = Array.from({length: Math.max(2, Math.ceil(n * r.progress) + 1)}, (_, k) =>
          interp(Math.min(r.progress, k / n)),
        );
        const line = {type: 'LineString' as const, coordinates: coords};
        const head = projection(interp(r.progress));
        const headVisible = geoDistance(interp(r.progress), center) < Math.PI / 2;
        return (
          <g key={i}>
            <path d={path(line) ?? ''} fill="none" stroke={C.green} strokeWidth={16} strokeOpacity={0.22} strokeLinecap="round" />
            <path d={path(line) ?? ''} fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" />
            {head && headVisible && r.progress < 1 ? <circle cx={head[0]} cy={head[1]} r={12} fill={C.white} /> : null}
          </g>
        );
      })}
      {pins.map((pin, i) => {
        const xy = projection(pin.at);
        if (!xy || geoDistance(pin.at, center) > Math.PI / 2 - 0.1) return null;
        return <PinMark key={i} x={xy[0]} y={xy[1]} label={pin.label} show={pin.show} align={pin.align} pulse={pulse} />;
      })}
    </svg>
  );
};

/** US states map with an optional highlighted state, curved routes and pins. */
export const USMap: React.FC<{
  width: number;
  height: number;
  highlight?: string;
  highlightAmount?: number;
  routes?: Route[];
  pins?: Pin[];
  frame: number;
  /** zoom factor and the place to zoom towards */
  zoom?: number;
  focus?: LonLat;
}> = ({width, height, highlight, highlightAmount = 1, routes = [], pins = [], frame, zoom = 1, focus}) => {
  const {projection, paths} = useMemo(() => {
    const proj = geoAlbersUsa().fitSize([width, height], {type: 'FeatureCollection', features: states} as any);
    const gp = geoPath(proj);
    return {projection: proj, paths: states.map((s) => ({name: s.properties.name as string, d: gp(s) ?? ''}))};
  }, [width, height]);
  const pulse = (frame % 30) / 30;
  const fxy = focus ? projection(focus) : null;
  const tx = fxy ? (width / 2 - fxy[0]) * (1 - 1 / zoom) : 0;
  const ty = fxy ? (height / 2 - fxy[1]) * (1 - 1 / zoom) : 0;
  const origin = fxy ? `${fxy[0]}px ${fxy[1]}px` : 'center';
  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      <g style={{transformOrigin: origin, transform: `translate(${tx}px, ${ty}px) scale(${zoom})`}}>
        {paths.map((s) => {
          const hot = s.name === highlight;
          return (
            <path
              key={s.name}
              d={s.d}
              fill={hot ? C.green : '#1b2530'}
              fillOpacity={hot ? 0.25 + 0.55 * highlightAmount : 1}
              stroke={hot ? C.green : '#3a4a5c'}
              strokeWidth={(hot ? 3 : 1.2) / zoom}
            />
          );
        })}
        {routes.map((r, i) => {
          const a = projection(r.from);
          const b = projection(r.to);
          if (!a || !b || r.progress <= 0) return null;
          const mx = (a[0] + b[0]) / 2;
          const my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.28;
          const d = `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`;
          return (
            <g key={i}>
              <path d={d} pathLength={1} strokeDasharray={`${r.progress} 1`} fill="none" stroke={C.green} strokeOpacity={0.22} strokeWidth={16 / zoom} strokeLinecap="round" />
              <path d={d} pathLength={1} strokeDasharray={`${r.progress} 1`} fill="none" stroke={C.green} strokeWidth={6 / zoom} strokeLinecap="round" />
            </g>
          );
        })}
        {pins.map((pin, i) => {
          const xy = projection(pin.at);
          if (!xy) return null;
          return (
            <g key={i} transform={`translate(${xy[0]}, ${xy[1]}) scale(${1 / zoom}) translate(${-xy[0]}, ${-xy[1]})`}>
              <PinMark x={xy[0]} y={xy[1]} label={pin.label} show={pin.show} align={pin.align} pulse={pulse} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
