/* eslint-disable react/button-has-type */
import React, { useCallback, useRef } from 'react';
import { Button } from '../../components/Button';

import { Container } from './styles';

const Index: React.FC = () => {
  return (
    <Container>
      <h1>Você é um idiota?</h1>

      <div>
        <Button text="Sim" />

        <Button text="Não" noClick />
      </div>
    </Container>
  );
};

export { Index };
