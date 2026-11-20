import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DBCooper, T as dbCooper} from './dbcooper/Video';
import {Celeste, T as celeste} from './celeste/Video';
import {Fitz, T as fitz} from './fitz/Video';
import {Coffee, T as coffee} from './coffee/Video';
import {Dyatlov, T as dyatlov} from './dyatlov/Video';
import {Alcatraz, T as alcatraz} from './alcatraz/Video';
import {Economist, T as economist} from './economist/Video';
import {MH370, T as mh370} from './mh370/Video';
import {CooperLong, T as cooperlong} from './cooperlong/Video';
import {CooperThumb} from './cooperlong/Thumb';
import {Kemper, T as kemper} from './kemper/Video';
import {FPS, H, TOTAL_FRAMES, W} from './lib';
import {Short} from './Video';

const Root: React.FC = () => (
  <>
    <Composition id="Short" component={Short} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="DBCooper" component={DBCooper} durationInFrames={dbCooper.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Kemper" component={Kemper} durationInFrames={kemper.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Celeste" component={Celeste} durationInFrames={celeste.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Fitz" component={Fitz} durationInFrames={fitz.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="CooperThumb" component={CooperThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="CooperLong" component={CooperLong} durationInFrames={cooperlong.totalFrames} fps={FPS} width={1920} height={1080} />
    <Composition id="MH370" component={MH370} durationInFrames={mh370.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Economist" component={Economist} durationInFrames={economist.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Alcatraz" component={Alcatraz} durationInFrames={alcatraz.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Dyatlov" component={Dyatlov} durationInFrames={dyatlov.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Coffee" component={Coffee} durationInFrames={coffee.totalFrames} fps={FPS} width={W} height={H} />
  </>
);

registerRoot(Root);
