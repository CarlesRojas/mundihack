import BracketText from '@components/BracketText';
import Team from '@components/Team';
import Text from '@components/Text';
import useAbly from '@hooks/useAbly';
import useUser from '@server/hooks/useUser';
import { styled } from '@styles/stitches.config';
import { ABLY_EVENT } from '@utils/constants';
import parseName from '@utils/parseName';
import { trpc } from '@utils/trpc';
import debounce from 'lodash/debounce';

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
});

const Teams = () => {
  const user = useUser();

  const { data: users, refetch: refetchUsers } = trpc.public.getUsers.useQuery();
  const { data: projects, refetch: refetchProjects } = trpc.public.getProjects.useQuery();

  const handleUpdateTeamsEvent = debounce(
    () => {
      refetchUsers();
      refetchProjects();
    },
    1000,
    { leading: true, trailing: true },
  );

  const { updateTeams } = useAbly({ [ABLY_EVENT.UPDATE_TEAMS]: handleUpdateTeamsEvent });

  return (
    <Container>
      <Text>{'click a team to join it'}</Text>

      <Wrap>
        {projects?.map((project, i) => (
          <Team key={project.id} team={project} index={i + 1} updateTeams={updateTeams}></Team>
        ))}
      </Wrap>

      <Text>{'participants without team:'}</Text>

      <Wrap>
        {users?.map(
          ({ id, name, projectId }) =>
            !projectId && <BracketText key={id} red={id === user?.id} text={parseName(name).fullName} />,
        )}
      </Wrap>
    </Container>
  );
};

export default Teams;
