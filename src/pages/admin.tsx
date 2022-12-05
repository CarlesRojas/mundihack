import Button from '@components/Button';
import useAbly from '@hooks/useAbly';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { styled } from '@styles/stitches.config';
import { ABLY_EVENT, ACTION, ROUTE } from '@utils/constants';
import { trpc } from '@utils/trpc';
import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';
import { useCallback } from 'react';
import { RiMailFill, RiTeamFill } from 'react-icons/ri';

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

  const { data: teamAction, refetch: refatchTeam } = trpc.public.getAction.useQuery({ name: ACTION.TEAM });
  const { data: voteAction, refetch: refatchVote } = trpc.public.getAction.useQuery({ name: ACTION.VOTE });
  const { data: projectAction, refetch: refatchAction } = trpc.public.getAction.useQuery({ name: ACTION.PROJECT });

  const teamActionAllowed = teamAction?.allowed ?? false;
  const voteActionAllowed = voteAction?.allowed ?? false;
  const projectActionAllowed = projectAction?.allowed ?? false;

  const handleUpdateActionsEvent = useCallback(
    (action?: ACTION) => {
      if (action === ACTION.TEAM) refatchTeam();
      else if (action === ACTION.VOTE) refatchVote();
      else if (action === ACTION.PROJECT) refatchAction();
      else {
        refatchTeam();
        refatchVote();
        refatchAction();
      }
    },
    [refatchTeam, refatchVote, refatchAction],
  );

  const { updateActions } = useAbly({
    [ABLY_EVENT.UPDATE_ACTIONS]: handleUpdateActionsEvent,
  });

  const { mutate: updateActionMutation } = trpc.private.setAction.useMutation({
    onSuccess: () => {
      updateActions();
    },
    onMutate: ({ action, allowed }) => {
      if (action === ACTION.TEAM) {
        const prevActionData = utils.public.getAction.getData({ name: ACTION.TEAM });
        if (prevActionData)
          utils.public.getAction.setData({ name: ACTION.TEAM }, () => ({ ...prevActionData, allowed }));
      }

      if (action === ACTION.VOTE) {
        const prevActionData = utils.public.getAction.getData({ name: ACTION.VOTE });
        if (prevActionData)
          utils.public.getAction.setData({ name: ACTION.VOTE }, () => ({ ...prevActionData, allowed }));
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
        label={teamActionAllowed ? 'Stop team building' : 'Start team building'}
        onClick={() => handleSetAction(ACTION.TEAM, !teamActionAllowed)}
      />

      <Button
        icon={<RiMailFill />}
        label={voteActionAllowed ? 'Stop vote' : 'Start vote'}
        onClick={() => handleSetAction(ACTION.VOTE, !voteActionAllowed)}
      />

      <Button
        icon={<RiTeamFill />}
        label={projectActionAllowed ? 'Stop project submitions' : 'Start project submitions'}
        onClick={() => handleSetAction(ACTION.PROJECT, !projectActionAllowed)}
      />
    </Container>
  );
};

export default Admin;
