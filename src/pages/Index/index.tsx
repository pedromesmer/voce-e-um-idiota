/* eslint-disable react/button-has-type */
import React, { useCallback, useRef, useState } from 'react';
import { Button } from '../../components/Button';

import { Container } from './styles';

const Index: React.FC = () => {
  const [title, setTitle] = useState('Você é um idiota?');

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
    </Container>
  );
};

export { Index };
