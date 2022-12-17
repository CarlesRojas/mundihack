import BracketText from '@components/BracketText';
import Loading from '@components/Loading';
import Team from '@components/Team';
import Text from '@components/Text';
import useAbly from '@hooks/useAbly';
import { styled } from '@styles/stitches.config';
import { ACTION, AUTH_STATUS, START_TIME } from '@utils/constants';
import parseName from '@utils/parseName';
import { trpc } from '@utils/trpc';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';

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

const Teams: NextPage = () => {
  const { status } = useSession();

  const { data: teamAction, isError: isTeamActionError } = trpc.public.getAction.useQuery({ name: ACTION.TEAM });
  const { data: users, isError: isUsersError } = trpc.public.getUsers.useQuery();
  const { data: projects, isError: isProjectsError } = trpc.public.getProjects.useQuery();
  const {
    data: user,
    isError: isUserError,
    isLoading: isGetUserLoading,
  } = trpc.private.getUser.useQuery(undefined, { enabled: status === AUTH_STATUS.AUTHENTICATED });

  const isError = isTeamActionError || isUsersError || isProjectsError || isUserError;

  const { updateTeams } = useAbly();
  const usersWithoutATeam = users?.filter(({ projectId }) => !projectId);

  if (status !== AUTH_STATUS.UNAUTHENTICATED && isGetUserLoading)
    return (
      <Container>
        <Loading showLabel />
      </Container>
    );

  const hasStarted = new Date().getTime() - START_TIME > 0;

  return (
    <Container>
      <Wrap bigGap>
        {projects?.map((project, i) => (
          <Team
            user={user}
            key={project.id}
            active={teamAction?.allowed}
            team={project}
            index={i + 1}
            updateTeams={updateTeams}
          ></Team>
        ))}
      </Wrap>

      {(teamAction?.allowed || !hasStarted) && usersWithoutATeam && usersWithoutATeam.length > 0 && (
        <>
          <Text>{teamAction?.allowed ? 'participants without a team:' : 'participants:'}</Text>

          <Wrap>
            {usersWithoutATeam.map(({ id, name }) => (
              <BracketText key={id} red={id === user?.id} text={parseName(name).fullName} />
            ))}
          </Wrap>
        </>
      )}

      {isError && <Text yellow>there was an error getting the teams</Text>}
    </Container>
  );
};

export default Teams;
