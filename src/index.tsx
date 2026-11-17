import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DBCooper, T as dbCooper} from './dbcooper/Video';
import {Kemper, T as kemper} from './kemper/Video';
import {FPS, H, TOTAL_FRAMES, W} from './lib';
import {Short} from './Video';

const Root: React.FC = () => (
  <>
    <Composition id="Short" component={Short} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="DBCooper" component={DBCooper} durationInFrames={dbCooper.totalFrames} fps={FPS} width={W} height={H} />
    <Composition id="Kemper" component={Kemper} durationInFrames={kemper.totalFrames} fps={FPS} width={W} height={H} />
  </>
);

registerRoot(Root);
