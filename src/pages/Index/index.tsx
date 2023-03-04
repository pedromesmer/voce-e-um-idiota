/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/button-has-type */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs-core';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-webgl';

import { Button } from '../../components/Button';

import { Container } from './styles';

const Index: React.FC = () => {
  const [title, setTitle] = useState('Você é um idiota?');
  const [model, setModel] = useState<handpose.HandPose>();

  tfjsWasm.setWasmPaths({
    'tfjs-backend-wasm.wasm': `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm.wasm`,
    'tfjs-backend-wasm-simd.wasm': `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm-simd.wasm`,
    'tfjs-backend-wasm-threaded-simd.wasm': `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm-threaded-simd.wasm`,
  });

  let videoWidth;
  let videoHeight;
  let rafID;
  let ctx;
  let canvas;
  let ANCHOR_POINTS;
  const scatterGLHasInitialized = false;
  let scatterGL;
  const fingerLookupIndices = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  }; // for rendering each finger as a polyline

  useCallback(async () => {
    const m = await handpose.load();
    setModel(m);
  }, []);

  const loadVideo = useCallback(async () => {
    const video = await setupCamera();
    video.play();
    return video;
  }, []);

  const changeTitle = useCallback(() => {
    setTitle('Eu sabia!!');
  }, []);

  return (
    <Container>
      <h1>{title}</h1>

      <div>
        <Button text="Sim" onClick={changeTitle} />

        <Button text="Não" noClick />
      </div>

      <div id="canvas-wrapper">
        <canvas id="output" />
        <video id="video" playsInline />
      </div>
    </Container>
  );
};

export { Index };
