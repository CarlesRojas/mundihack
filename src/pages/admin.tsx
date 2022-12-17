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

  const isError = isTeamActionError || isProjectActionError;

  const teamActionAllowed = teamAction?.allowed ?? false;
  const projectActionAllowed = projectAction?.allowed ?? false;

  const { updateActions } = useAbly();

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

  return (
    <Container>
      <Button
        icon={<RiTeamFill />}
        isDisabled={isUpdateActionLoading}
        label={teamActionAllowed ? 'Stop team building' : 'Start team building'}
        onClick={() => handleSetAction(ACTION.TEAM, !teamActionAllowed)}
      />

      <Button
        icon={<RiSendPlane2Fill />}
        isDisabled={isUpdateActionLoading}
        label={projectActionAllowed ? 'Stop project submitions' : 'Start project submitions'}
        onClick={() => handleSetAction(ACTION.PROJECT, !projectActionAllowed)}
      />

      {isUpdateActionLoading && <Loading />}
      {isError && <Text yellow>there was an error getting the actions</Text>}
      {isUpdateActionError && <Text yellow>there was an error updating the action</Text>}
    </Container>
  );
};

export default Admin;
