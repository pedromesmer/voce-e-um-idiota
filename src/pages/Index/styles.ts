import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  video {
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
    visibility: hidden;
    width: auto;
    height: auto;
    position: absolute;
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
