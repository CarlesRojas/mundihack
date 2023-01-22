import BracketText from '@components/BracketText';
import Loading from '@components/Loading';
import Team from '@components/Team';
import Text from '@components/Text';
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
  const { status, data: session } = useSession();

  const { data: teamAction, isError: isTeamActionError } = trpc.public.getAction.useQuery({ name: ACTION.TEAM });
  const { data: users, isError: isUsersError } = trpc.public.getUsers.useQuery();
  const { data: projects, isLoading: isProjectsLoading, isError: isProjectsError } = trpc.public.getProjects.useQuery();
  const {
    data: user,
    isError: isUserError,
    isLoading: isGetUserLoading,
  } = trpc.private.getUser.useQuery(undefined, { enabled: status === AUTH_STATUS.AUTHENTICATED });

  const isError = isTeamActionError || isUsersError || isProjectsError || isUserError;
  const usersWithoutATeam = users?.filter(({ projectId }) => !projectId);

  if ((status !== AUTH_STATUS.UNAUTHENTICATED && isGetUserLoading) || isProjectsLoading)
    return (
      <Container>
        <Loading showLabel />
      </Container>
    );

  const hasStarted = new Date().getTime() - START_TIME > 0;
  const isAdmin = session?.user?.isAdmin ?? false;

  return (
    <Container>
      <Wrap bigGap>
        {(isAdmin || teamAction?.allowed) &&
          projects?.map((project, i) => <Team key={project.id} user={user} team={project} index={i + 1}></Team>)}
      </Wrap>

      {(teamAction?.allowed || !hasStarted) && usersWithoutATeam && usersWithoutATeam.length > 0 && (
        <>
          <Text>{teamAction?.allowed ? 'participants without a team:' : 'participants:'}</Text>

          <Wrap>
            {usersWithoutATeam.map(({ id, name }) => (
              <BracketText key={id} red={id === user?.id} text={parseName(name).fullName} disabled />
            ))}
          </Wrap>
        </>
      )}

      {isError && <Text yellow>there was an error getting the teams</Text>}
    </Container>
  );
};

export default Teams;
