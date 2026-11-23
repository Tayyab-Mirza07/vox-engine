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
import {Hoffa, T as hoffa} from './hoffa/Video';
import {BakerSt, T as bakerst} from './bakerst/Video';
import {Room1046, T as room1046} from './room1046/Video';
import {Annabelle, T as annabelle} from './annabelle/Video';
import {Flannan, T as flannan} from './flannan/Video';
import {FlannanThumb} from './flannan/scenes';
import {Flight19, T as flight19} from './flight19/Video';
import {Flight19Thumb} from './flight19/scenes';
import {Sodder, T as sodder} from './sodder/Video';
import {SodderThumb} from './sodder/scenes';
import {Gone, GoneThumb, T as gone} from './gone/Video';
import {CooperLong, T as cooperlong} from './cooperlong/Video';
import {CooperThumb} from './cooperlong/Thumb';
import {CooperThumb2} from './cooperlong/Thumb2';
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
    <Composition id="CooperThumb2" component={CooperThumb2} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="CooperLong" component={CooperLong} durationInFrames={cooperlong.totalFrames} fps={FPS} width={1920} height={1080} />
    <Composition id="MH370" component={MH370} durationInFrames={mh370.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Hoffa" component={Hoffa} durationInFrames={hoffa.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="BakerSt" component={BakerSt} durationInFrames={bakerst.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Room1046" component={Room1046} durationInFrames={room1046.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Annabelle" component={Annabelle} durationInFrames={annabelle.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Flannan" component={Flannan} durationInFrames={flannan.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="FlannanThumb" component={FlannanThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="Flight19" component={Flight19} durationInFrames={flight19.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Flight19Thumb" component={Flight19Thumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="Sodder" component={Sodder} durationInFrames={sodder.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="SodderThumb" component={SodderThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="Gone" component={Gone} durationInFrames={gone.totalFrames} fps={FPS} width={1920} height={1080} />
    <Composition id="GoneThumb" component={GoneThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Economist" component={Economist} durationInFrames={economist.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Alcatraz" component={Alcatraz} durationInFrames={alcatraz.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Dyatlov" component={Dyatlov} durationInFrames={dyatlov.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Coffee" component={Coffee} durationInFrames={coffee.totalFrames} fps={FPS} width={W} height={H} />
  </>
);

registerRoot(Root);
