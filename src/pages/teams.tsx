import BracketText from '@components/BracketText';
import Team from '@components/Team';
import Text from '@components/Text';
import useAbly from '@hooks/useAbly';
import { styled } from '@styles/stitches.config';
import { ABLY_EVENT } from '@utils/constants';
import parseName from '@utils/parseName';
import { trpc } from '@utils/trpc';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
});

const Wrap = styled('ul', {
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: '2rem',
  rowGap: '0.5rem',

  variants: {
    bigGap: {
      true: {
        rowGap: '1rem',
      },
    },
  },
});

const Teams = () => {
  const { data } = useSession();

  const { data: users, refetch: refetchUsers } = trpc.public.getUsers.useQuery();
  const { data: projects, refetch: refetchProjects } = trpc.public.getProjects.useQuery();
  const { data: user, refetch: refetchUser } = trpc.private.getUser.useQuery(undefined, { enabled: !!data });

  const handleUpdateTeamsEvent = useCallback(() => {
    refetchUsers();
    refetchProjects();
    refetchUser();
  }, [refetchProjects, refetchUsers, refetchUser]);

  const { updateTeams } = useAbly({ [ABLY_EVENT.UPDATE_TEAMS]: handleUpdateTeamsEvent });

  const usersWithoutATeam = users?.filter(({ projectId }) => !projectId);

  return (
    <Container>
      <Wrap bigGap>
        {projects?.map((project, i) => (
          <Team key={project.id} team={project} index={i + 1} updateTeams={updateTeams}></Team>
        ))}
      </Wrap>

      {usersWithoutATeam && usersWithoutATeam.length > 0 && <Text>{'participants without team:'}</Text>}

      <Wrap>
        {usersWithoutATeam?.map(({ id, name }) => (
          <BracketText key={id} red={id === user?.id} text={parseName(name).fullName} />
        ))}
      </Wrap>
    </Container>
  );
};

export default Teams;
