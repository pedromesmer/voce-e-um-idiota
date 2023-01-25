import React, {
  HtmlHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Container } from './styles';

interface componentprops extends HtmlHTMLAttributes<HTMLButtonElement> {
  noClick?: boolean;
  text: string;
}

const Button: React.FC<componentprops> = ({ noClick, text, ...rest }) => {
  const [mousePos, setMousePos] = useState({});
  const [newPos, setNewPos] = useState({ x: 0, y: 0 });
  const [dimensionScreen, setDimensionScreen] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      setDimensionScreen({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  const getRandom = useCallback((max: number) => {
    return Math.floor(Math.random() * max);
  }, []);

  const newPositions = useCallback(() => {
    const newTop = getRandom(dimensionScreen.height) * 0.5;
    let newLeft = getRandom(dimensionScreen.width) * 0.4;

    if (getRandom(1000) % 2 === 0) {
      newLeft *= -1;
    }

    setNewPos({
      x: newLeft,
      y: newTop,
    });
  }, []);

  return (
    <Container
      onMouseEnter={newPositions}
      newPosition={noClick}
      pos={newPos}
      {...rest}
    >
      {text}
    </Container>
  );
};

export { Button };
