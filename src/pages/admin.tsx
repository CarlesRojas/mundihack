import BracketText from '@components/BracketText';
import Button from '@components/Button';
import Loading from '@components/Loading';
import Text from '@components/Text';
import useAbly from '@hooks/useAbly';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { styled } from '@styles/stitches.config';
import { ACTION, ROUTE } from '@utils/constants';
import { trpc } from '@utils/trpc';
import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';
import { RiSendPlane2Fill, RiTeamFill } from 'react-icons/ri';

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

const ButtonStyle = styled('button', {
  variants: {
    isDisabled: {
      true: {
        pointerEvents: 'none',
        opacity: 0.5,
      },
    },
  },
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session || !session.user?.isAdmin) return { redirect: { destination: ROUTE.CALENDAR, permanent: false } };
  return { props: {} };
};

const Admin: NextPage = () => {
  const utils = trpc.useContext();

  const { data: teamAction, isError: isTeamActionError } = trpc.public.getAction.useQuery({ name: ACTION.TEAM });
  const { data: projectAction, isError: isProjectActionError } = trpc.public.getAction.useQuery({
    name: ACTION.PROJECT,
  });
  const { data: projects, isError: isGetProjectsError } = trpc.public.getProjects.useQuery();

  const isError = isTeamActionError || isProjectActionError;

  const teamActionAllowed = teamAction?.allowed ?? false;
  const projectActionAllowed = projectAction?.allowed ?? false;

  const { updateActions, updateTeams } = useAbly();

  const {
    mutate: toggleWinnerMutation,
    isError: isToggleWinnerError,
    isLoading: isToggleWinnerLoading,
  } = trpc.private.toggleWinner.useMutation({
    onSuccess: () => {
      updateTeams();
    },
    onMutate: ({ projectId }) => {
      const prevActionData = utils.public.getProjects.getData();

      if (prevActionData) {
        const prevValue = prevActionData.find((project) => project.id === projectId)?.winner;
        if (typeof prevValue !== 'boolean') return;

        const newData = prevActionData.map((project) => {
          if (project.id === projectId) return { ...project, winner: !prevValue };
          else return { ...project, winner: false };
        });

        utils.public.getProjects.setData(undefined, () => newData);
      }
    },
  });

  const {
    mutate: updateActionMutation,
    isLoading: isUpdateActionLoading,
    isError: isUpdateActionError,
  } = trpc.private.setAction.useMutation({
    onSuccess: () => {
      updateActions();
    },
    onMutate: ({ action, allowed }) => {
      if (action === ACTION.TEAM) {
        const prevActionData = utils.public.getAction.getData({ name: ACTION.TEAM });
        if (prevActionData)
          utils.public.getAction.setData({ name: ACTION.TEAM }, () => ({ ...prevActionData, allowed }));
      }

      if (action === ACTION.PROJECT) {
        const prevActionData = utils.public.getAction.getData({ name: ACTION.PROJECT });
        if (prevActionData)
          utils.public.getAction.setData({ name: ACTION.PROJECT }, () => ({ ...prevActionData, allowed }));
      }
    },
  });

  const handleSetAction = (action: ACTION, allowed: boolean) => {
    updateActionMutation({ action, allowed });
  };

  const handleToggleWinner = (projectId: string) => {
    console.log('click');
    toggleWinnerMutation({ projectId });
  };

  return (
    <Container>
      <Button
        icon={<RiTeamFill />}
        isDisabled={isUpdateActionLoading || isToggleWinnerLoading}
        label={teamActionAllowed ? 'Stop team building' : 'Start team building'}
        onClick={() => handleSetAction(ACTION.TEAM, !teamActionAllowed)}
      />

      <Button
        icon={<RiSendPlane2Fill />}
        isDisabled={isUpdateActionLoading || isToggleWinnerLoading}
        label={projectActionAllowed ? 'Stop project submitions' : 'Start project submitions'}
        onClick={() => handleSetAction(ACTION.PROJECT, !projectActionAllowed)}
      />

      <Text>Select Winner</Text>
      <Wrap>
        {projects?.map(
          (project) =>
            project.name && (
              <ButtonStyle
                key={project.id}
                disabled={isToggleWinnerLoading}
                isDisabled={isToggleWinnerLoading}
                onClick={() => handleToggleWinner(project.id)}
              >
                <BracketText text={project.name} red={project.winner} hover={!isToggleWinnerLoading} />
              </ButtonStyle>
            ),
        )}
      </Wrap>

      {isUpdateActionLoading && <Loading />}
      {isError && <Text yellow>there was an error getting the actions</Text>}
      {isUpdateActionError && <Text yellow>there was an error updating the action</Text>}
      {isGetProjectsError && <Text yellow>there was an error getting the projects</Text>}
      {isToggleWinnerError && <Text yellow>there was an error toggling the winner</Text>}
    </Container>
  );
};

export default Admin;
