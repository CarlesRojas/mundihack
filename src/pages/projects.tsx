import Loading from '@components/Loading';
import Project from '@components/Project';
import Text from '@components/Text';
import { styled } from '@styles/stitches.config';
import { ACTION, AUTH_STATUS } from '@utils/constants';
import type { RouterOutputs } from '@utils/trpc';
import { trpc } from '@utils/trpc';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';

const Container = styled('div', {
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

type ProjectToSort = RouterOutputs['public']['getProjects'][0];
const sortByMostVotes = (a: ProjectToSort, b: ProjectToSort) => b.votes.length - a.votes.length;

const Projects: NextPage = () => {
  const { status, data: session } = useSession();
  const { data: projects, isError: isGetProjectsError } = trpc.public.getProjects.useQuery();
  const { data: voteAction, isError: isVoteActionError } = trpc.public.getAction.useQuery({ name: ACTION.VOTE });

  const canVote = status === AUTH_STATUS.AUTHENTICATED && voteAction?.allowed && !isVoteActionError;
  const sumbittedProjects = projects?.filter((project) => !!project.name);

  const container = (children: JSX.Element) => <Container>{children}</Container>;

  if (isGetProjectsError) return container(<Text yellow>{'there was an error getting the projects'}</Text>);

  if (sumbittedProjects && sumbittedProjects.length <= 0)
    return container(<Text>{'no projects have been submitted yet'}</Text>);

  if (status === AUTH_STATUS.LOADING) return container(<Loading showLabel />);

  const userHasVoted =
    projects?.some((project) => project.votes?.find((vote) => vote.id === session?.user?.id)) ?? false;

  if (canVote)
    return container(
      <>
        {canVote && <Text>{'cast your vote!'}</Text>}

        {sumbittedProjects &&
          sumbittedProjects.map((project, i) => (
            <Project
              key={project.id}
              project={project}
              userId={session?.user?.id}
              userHasVoted={userHasVoted}
              first={i === 0}
              canVote={canVote}
            />
          ))}
      </>,
    );

  return container(
    <>
      {sumbittedProjects &&
        sumbittedProjects
          .sort(sortByMostVotes)
          .map((project, i) => (
            <Project
              key={project.id}
              project={project}
              userId={session?.user?.id}
              userHasVoted={userHasVoted}
              first={i <= 1}
              canVote={canVote}
              winner={i === 0}
            />
          ))}
    </>,
  );
};

export default Projects;
