import Button from '@components/Button';
import useAbly from '@hooks/useAbly';
import { styled } from '@styles/stitches.config';
import { ABLY_EVENT } from '@utils/constants';
import { useCallback } from 'react';
import { RiAddFill } from 'react-icons/ri';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const Teams = () => {
  const handleUpdateTeamsEvent = useCallback(() => {
    console.log('update teams');
  }, []);

  const { updateTeams } = useAbly({ [ABLY_EVENT.UPDATE_TEAMS]: handleUpdateTeamsEvent });

  return (
    <Container>
      <Button icon={<RiAddFill />} label={'Send event'} onClick={updateTeams} />
    </Container>
  );
};

export default Teams;
