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
  const VIDEO_WIDTH = 640;
  const VIDEO_HEIGHT = 500;

  const setupCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available',
      );
    }

    const video = document.getElementById('video') as HTMLMediaElement;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        // Only setting the video to a specified size in order to accommodate a
        // point cloud, so on mobile devices accept the default size.
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
      },
    });

    video.srcObject = stream;

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }, []);

  const loadModel = useCallback(async () => {
    const m = await handpose.load();
    setModel(m);
  }, []);

  const loadVideo = useCallback(async () => {
    const video = (await setupCamera()) as HTMLMediaElement;
    video.play();
    return video;
  }, []);

  // const setupDatGui = useCallback(() => {
  //   const gui = new dat.GUI();
  //   gui.add(state, 'backend', ['webgl', 'wasm']).onChange(async backend => {
  //     window.cancelAnimationFrame(rafID);
  //     await tf.setBackend(backend);
  //     await addFlagLabels();
  //     landmarksRealTime(video);
  //   });

  //   if (renderPointcloud) {
  //     gui.add(state, 'renderPointcloud').onChange(render => {
  //       document.querySelector('#scatter-gl-container').style.display = render
  //         ? 'inline-block'
  //         : 'none';
  //     });
  //   }
  // }, []);

  const main = useCallback(async () => {
    const state = {
      backend: 'webgl',
    };

    await tf.setBackend(state.backend);
    if (
      !tf.env().getAsync('WASM_HAS_SIMD_SUPPORT') &&
      state.backend === 'wasm'
    ) {
      console.warn(
        'The backend is set to WebAssembly and SIMD support is turned off.\nThis could bottleneck your performance greatly, thus to prevent this enable SIMD Support in chrome://flags',
      );
    }
    loadModel();

    let video: any;

    try {
      video = await loadVideo();
    } catch (e) {
      const info = document.getElementById('info');
      // info.textContent = e.message;
      // info.style.display = 'block';
      throw e;
    }

    videoWidth = VIDEO_WIDTH;
    videoHeight = VIDEO_HEIGHT;

    canvas = document.getElementById('output') as any;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    video.width = videoWidth;
    video.height = videoHeight;

    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
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
