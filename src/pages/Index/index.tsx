/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

import { Button } from '../../components/Button';

import { Container, Point } from './styles';

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

  const fingerLookupIndices = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  };

  const VIDEO_WIDTH = 640;
  const VIDEO_HEIGHT = 500;

  function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }

  const setupVideo = useCallback(async () => {
    const video = document.getElementById('video') as HTMLVideoElement;
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

    return video;
  }, []);

  const realTime = useCallback(
    async (video: HTMLVideoElement, model: handpose.HandPose) => {
      const point = document.getElementById('point');
      async function frameLandmarks() {
        const predictions = await model.estimateHands(video);
        //
        if (predictions.length > 0) {
          const result = predictions[0].landmarks;
          const points = predictions[0].annotations.indexFinger[3];

          if (point && predictions[0].handInViewConfidence > 0.99998) {
            console.log(predictions);
            const width = window.innerWidth;
            const height = window.innerHeight;

            point.style.right = `${(width / VIDEO_WIDTH) * points[0]}px`;
            point.style.top = `${(height / VIDEO_HEIGHT) * points[1]}px`;
            // console.log(points);
          }
        }
      }
      const timer = setInterval(async () => {
        await frameLandmarks();
      }, 50);

      // clearTimeout(timer);
    },
    [],
  );

  const setup = useCallback(async () => {
    const video = await setupVideo();
    video.play();

    const model = await handpose.load();

    await realTime(video, model);
  }, []);

  useEffect(() => {
    setup();
  }, []);

  const changeTitle = useCallback(() => {
    setTitle('Eu sabia!!');
  }, []);

  return (
    <>
      <Point id="point" />
      <Container>
        {/* <h1>{title}</h1>

        <div>
          <Button text="Sim" onClick={changeTitle} />

          <Button text="Não" noClick />
        </div> */}

        <div id="canvas-wrapper">
          <canvas id="canvas" />
          <video id="video" playsInline />
        </div>
      </Container>
    </>
  );
};

export { Index };
