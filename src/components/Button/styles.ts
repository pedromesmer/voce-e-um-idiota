/* eslint-disable no-shadow */
import styled, { css } from 'styled-components';

interface props {
  newPosition?: boolean;
  pos?: {
    x: number;
    y: number;
  };
}

export const Container = styled.button<props>`
  position: absolute;

  ${props =>
    props.newPosition &&
    css`
      top: ${props.pos?.y}px;
      left: ${props.pos?.x}px;
    `}
`;
