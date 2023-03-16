import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  #canvas-wrapper {
    position: relative;
    border: 1px solid black;

    width: 640px;
    height: 500px;
  }

  /*  */
  canvas,
  video {
    position: absolute;

    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
    /* visibility: hidden; */
    width: 640px;
    height: 500px;
    /* border: 1px solid black; */

    z-index: -1;
  }

  div {
    width: 100%;
    display: flex;
    justify-content: center;

    button {
      position: relative;

      margin: 0 20px;
    }
  }
`;

export const Point = styled.span`
  position: absolute;
  width: 10px;
  height: 10px;

  border-radius: 50%;

  background-color: black;
`;
