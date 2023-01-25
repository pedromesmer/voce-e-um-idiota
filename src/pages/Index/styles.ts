import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

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
