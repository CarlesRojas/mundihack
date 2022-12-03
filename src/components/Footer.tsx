import Text from '@components/Text';
import useResize from '@hooks/useResize';
import { styled } from '@stitches/react';
import { END_TIME, START_TIME } from '@utils/constants';
import { useCallback, useEffect, useRef, useState } from 'react';

const Container = styled('footer', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const ProgressBar = styled('div', {
  width: '100%',
  display: 'flex',
});

const Footer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(100);
  const [barLength, setBarLength] = useState(0);

  const progressBarRef = useRef<HTMLDivElement>(null);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const twoDigitMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const twoDigitSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const recalculateTimeLeft = useCallback(() => {
    const newTimeLeft = END_TIME - new Date().getTime();
    setTimeLeft(Math.max(newTimeLeft, 0));
    setProgress(Math.max(0, Math.min(barLength, (newTimeLeft / (END_TIME - START_TIME)) * barLength)));
  }, [barLength]);

  useEffect(() => {
    recalculateTimeLeft();
    const interval = setInterval(recalculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [recalculateTimeLeft]);

  useResize(() => {
    const newBarLength = progressBarRef.current?.offsetWidth;
    if (!newBarLength) return;
    setBarLength(Math.floor(newBarLength / 11));
  }, true);

  const progressArray = Array.from({ length: barLength }, () => null);

  return (
    <Container>
      <Text>{`time left: ${hours}h ${twoDigitMinutes}m ${twoDigitSeconds}s`}</Text>

      <ProgressBar ref={progressBarRef}>
        <Text as="span">[</Text>

        {progressArray.map((_, index) => (
          <Text key={index} as="span" red={index < progress}>
            {index < progress ? '#' : '_'}
          </Text>
        ))}

        <Text as="span">]</Text>
      </ProgressBar>
    </Container>
  );
};

export default Footer;
