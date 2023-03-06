/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/button-has-type */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs-core';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-webgl';

import { Coords3D } from '@tensorflow-models/handpose/dist/pipeline';
import { Button } from '../../components/Button';

import { Container } from './styles';

interface fingerNames {
  thumb: number[];
  indexFinger: number[];
  middleFinger: number[];
  ringFinger: number[];
  pinky: number[];
}

// interface fingersName {

// }

const Index: React.FC = () => {
  const [title, setTitle] = useState('Você é um idiota?');

  const [model, setModel] = useState<handpose.HandPose>();
  const [video, setVideo] = useState<HTMLVideoElement>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const [fingerLookupIndices, setFingerLookupIndices] = useState<fingerNames>({
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  });

  // tfjsWasm.setWasmPaths({
  //   'tfjs-backend-wasm.wasm': `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm.wasm`,
  //   'tfjs-backend-wasm-simd.wasm': `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm-simd.wasm`,
  //   'tfjs-backend-wasm-threaded-simd.wasm': `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm-threaded-simd.wasm`,
  // });

  // let videoWidth;
  // let videoHeight;
  let rafID: number;
  // let ctx;
  // let canvas;
  // let ANCHOR_POINTS;
  const scatterGLHasInitialized = false;
  // let scatterGL;
  const renderPointcloud = true;

  const VIDEO_WIDTH = 640;
  const VIDEO_HEIGHT = 500;

  const state = {
    backend: 'webgl',
  };

  const drawPoint = useCallback(
    (y: number, x: number, r: number) => {
      if (!ctx) {
        return;
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
    },
    [ctx],
  );

  const drawPath = useCallback(
    (points: number[][], closePath: boolean) => {
      const region = new Path2D();
      region.moveTo(points[0][0], points[0][1]);

      points.forEach(point => {
        region.lineTo(point[0], point[1]);
      });

      if (closePath) {
        region.closePath();
      }

      if (!ctx) {
        return;
      }
      ctx.stroke(region);
    },
    [ctx],
  );

  const drawKeypoints = useCallback(
    (keypoints: Coords3D) => {
      const keypointsArray = keypoints;

      keypoints.forEach((cords, i) => {
        const y = keypointsArray[i][0];
        const x = keypointsArray[i][1];
        drawPoint(x - 2, y - 2, 3);
      });

      Object.keys(fingerLookupIndices).forEach(key => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const points = fingerLookupIndices[key].map(
          (idx: number) => keypoints[idx],
        );

        drawPath(points, false);
      });
    },
    [drawPath, drawPoint, fingerLookupIndices],
  );

  const loadModel = useCallback(async () => {
    const m = await handpose.load();
    setModel(m);
  }, []);

  const setupCamera = useCallback(async (): Promise<any> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available',
      );
    }

    const videoElement = document.getElementById('video') as HTMLVideoElement;
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

    videoElement.srcObject = stream;

    if (videoElement === undefined || videoElement === null) {
      setupCamera();
    }

    setVideo(videoElement);

    return new Promise(resolve => {
      videoElement.onloadedmetadata = () => {
        resolve(videoElement);
      };
    });
  }, []);

  const loadVideo = useCallback(async () => {
    const videoElement = await setupCamera();

    if (videoElement === undefined) {
      await setupCamera();
    }

    videoElement.play();

    return videoElement;
  }, [setupCamera]);

  const initCanvas = useCallback(async () => {
    const canvasElement = document.getElementById(
      'canvas',
    ) as HTMLCanvasElement;
    canvasElement.width = VIDEO_WIDTH;
    canvasElement.height = VIDEO_HEIGHT;

    setCanvas(canvasElement);
  }, []);

  const initCtx = useCallback(() => {
    if (!canvas) {
      return;
    }
    setCtx(canvas.getContext('2d') as CanvasRenderingContext2D);
  }, [canvas]);

  useEffect(() => {
    console.log('model');
    loadModel();
  }, []);

  useEffect(() => {
    console.log('video');
    loadVideo();
  }, [model]);

  useEffect(() => {
    console.log('canvas');
    initCanvas();
  }, [video]);

  useEffect(() => {
    console.log('ctx');
    initCtx();
  }, [canvas]);

  useEffect(() => {
    loadModel();
    loadVideo();
    initCanvas();
    initCtx();
  }, []);

  const main = useCallback(async () => {
    if (!ctx) {
      console.log('context é nulo');
      return;
    }

    if (!video) {
      console.log('video é nulo');
      return;
    }

    if (!canvas) {
      console.log('canvas é nulo');
      return;
    }

    if (!model) {
      console.log('model é nulo');
      return;
    }

    ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';

    ctx.translate(canvas?.width as number, 0);
    ctx.scale(-1, 1);

    const ANCHOR_POINTS = [
      [0, 0, 0],
      [0, -VIDEO_HEIGHT, 0],
      [-VIDEO_WIDTH, 0, 0],
      [-VIDEO_WIDTH, -VIDEO_HEIGHT, 0],
    ];

    const videoElement = await setupCamera();

    const frameLandmarks = async () => {
      ctx.drawImage(
        videoElement,
        0,
        0,
        VIDEO_WIDTH,
        VIDEO_HEIGHT,
        0,
        0,
        VIDEO_WIDTH,
        VIDEO_HEIGHT,
      );

      console.log('here');
      const predictions = await model.estimateHands(video);

      if (predictions.length > 0) {
        const result = predictions[0].landmarks;
        drawKeypoints(result);

        // if (renderPointcloud === true && scatterGL != null) {
        //   const pointsData = result.map(point => {
        //     return [-point[0], -point[1], -point[2]];
        //   });

        //   const dataset = new ScatterGL.Dataset([
        //     ...pointsData,
        //     ...ANCHOR_POINTS,
        //   ]);

        //   if (!scatterGLHasInitialized) {
        //     scatterGL.render(dataset);

        //     const fingers = Object.keys(fingerLookupIndices);

        //     scatterGL.setSequences(
        //       fingers.map(finger => ({
        //         indices: fingerLookupIndices[finger],
        //       })),
        //     );
        //     scatterGL.setPointColorer(index => {
        //       if (index < pointsData.length) {
        //         return 'steelblue';
        //       }
        //       return 'white'; // Hide.
        //     });
        //   } else {
        //     scatterGL.updateDataset(dataset);
        //   }
        //   scatterGLHasInitialized = true;
        // }
      }
      // stats.end();
      rafID = requestAnimationFrame(frameLandmarks);
    };

    frameLandmarks();
  }, [ctx]);

  useEffect(() => {
    console.log({
      model,
      video,
      canvas,
      ctx,
    });

    if (
      video !== undefined &&
      ctx !== undefined &&
      model !== undefined &&
      canvas !== undefined
    ) {
      console.log('é hora do show');
      main();
    }
  }, [video, ctx, model, canvas]);

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
        <canvas id="canvas" />
        <video id="video" playsInline />
      </div>
    </Container>
  );
};

export { Index };
