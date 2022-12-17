import Text from '@components/Text';
import useAutoResetState from '@hooks/useAutoResetState';
import useResize from '@hooks/useResize';
import { keyframes } from '@stitches/react';
import { desktop, laptop, tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { CHARACTER_WIDTH, END_TIME, START_TIME } from '@utils/constants';
import { useCallback, useEffect, useRef, useState } from 'react';

const Container = styled('footer', {
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  touchAction: 'none',
});

const ProgressBar = styled('div', {
  width: '100%',
  display: 'flex',
});

const Road = styled('div', {
  position: 'absolute',
  bottom: 'calc(100% + 1rem)',
  left: '0',
  right: '0',
  height: '100vh',
  pointerEvents: 'none',
});

const motoAnimation = keyframes({
  '100%': { translate: '-100vw 0' },
});

const willyMotoAnimation = keyframes({
  '30%': { rotate: '0deg' },
  '35%': { rotate: '45deg' },
  '100%': { translate: '-100vw 0', rotate: '45deg' },
});

const Moto = styled('div', {
  position: 'absolute',
  bottom: 0,
  right: 0,
  display: 'flex',
  height: 'fit-content',
  width: 'fit-content',
  flexDirection: 'column',
  animationFillMode: 'forwards',
  transformOrigin: '42% 80%',

  translate: 'calc(100% + 3rem) 0',
  [tablet]: { translate: 'calc(100% + 6rem) 0' },
  [laptop]: { translate: 'calc(100% + 12rem) 0' },
  [desktop]: { translate: 'calc(100% + 18rem) 0' },

  variants: {
    animated: {
      true: {
        animation: `${motoAnimation} 3s linear`,
      },
    },
    animatedWilly: {
      true: {
        animation: `${willyMotoAnimation} 3s linear`,
      },
    },
  },
});

const Gas = styled('div', {
  position: 'absolute',
  bottom: 0,
  right: 0,
  display: 'flex',
  height: 'fit-content',
  width: 'fit-content',
  flexDirection: 'column',
  animationFillMode: 'forwards',

  translate: 'calc(100% + 3rem) 0',
  [tablet]: { translate: 'calc(100% + 6rem) 0' },
  [laptop]: { translate: 'calc(100% + 12rem) 0' },
  [desktop]: { translate: 'calc(100% + 18rem) 0' },

  variants: {
    animated: {
      true: {
        animation: `${motoAnimation} 3s linear`,
      },
    },
  },
});

const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
    setBarLength(Math.floor(newBarLength / CHARACTER_WIDTH) - 2);
  }, true);

  const progressArray = Array.from({ length: barLength }, () => null);

  const [gas, setGas] = useAutoResetState(false, 4000);
  const [willy, setWilly] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const turnOnGas = () => {
      setGas(true);
      setWilly(Math.random() > 0.6);
      timeout = setTimeout(turnOnGas, Math.random() * 60000 + 4000);
    };

    timeout = setTimeout(turnOnGas, Math.random() * 60000 + 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, [setGas]);

  const moto = [
    '     _                       ',
    '  |>/--.    __               ',
    ' __/`---\\--__/              ',
    '/  \\ #0_\\\\/  "            ',
    "\\__/  '   \\__/             ",
  ];

  const gasTrail = [
    '                             ',
    '                             ',
    '                            ',
    '                   GAS    ',
    '                GAS    GAAS',
  ];

  const hasStarted = new Date().getTime() - START_TIME > 0;
  const startTime = new Date(START_TIME);

  return (
    <Container>
      <Text>
        {hasStarted
          ? `time left: ${hours}h ${twoDigitMinutes}m ${twoDigitSeconds}s`
          : `start time: ${startTime.getDate()} ${
              shortMonths[startTime.getMonth()]
            } ${startTime.getFullYear()} at ${startTime.getHours()}:${
              startTime.getMinutes() < 10 ? `0${startTime.getMinutes()}` : startTime.getMinutes()
            }`}
      </Text>

      <ProgressBar ref={progressBarRef}>
        <Text as="span">[</Text>

        {progressArray.map((_, index) => (
          <Text key={index} as="span" red={index < progress}>
            {index < progress ? '#' : '_'}
          </Text>
        ))}

        <Text as="span">]</Text>
      </ProgressBar>

      <Road>
        <Moto animated={gas && !willy} animatedWilly={gas && willy}>
          {moto.map((line, index) => (
            <Text key={index} pre>
              {line}
            </Text>
          ))}
        </Moto>

        <Gas animated={gas}>
          {gasTrail.map((line, index) => (
            <Text key={index} pre>
              {line}
            </Text>
          ))}
        </Gas>
      </Road>
    </Container>
  );
};

export default Footer;
