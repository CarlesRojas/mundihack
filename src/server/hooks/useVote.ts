import { trpc } from '@utils/trpc';
import uuid from 'react-uuid';

interface VoteMutation {
  projectId: string;
  userId?: string;
}

export const useVote = ({ projectId, userId }: VoteMutation) => {
  const utils = trpc.useContext();

  const {
    mutate,
    isLoading: isVoteLoading,
    isError: isVoteError,
  } = trpc.private.vote.useMutation({
    onMutate: () => {
      const previousProjects = utils.public.getProjects.getData();

      if (previousProjects) {
        const newProjects = previousProjects.map((previousProject) => {
          return previousProject.id === projectId
            ? { ...previousProject, votes: [...previousProject.votes, { id: userId ?? uuid(), name: null }] }
            : previousProject;
        });

        utils.public.getProjects.setData(undefined, newProjects);
      }
    },
  });

  const voteMutation = () => mutate({ projectId });

  return { voteMutation, isVoteLoading, isVoteError };
};

export const useRemoveVote = ({ projectId, userId }: VoteMutation) => {
  const utils = trpc.useContext();

  const {
    mutate,
    isLoading: isRemoveVoteLoading,
    isError: isRemoveVoteError,
  } = trpc.private.vote.useMutation({
    onMutate: () => {
      const previousProjects = utils.public.getProjects.getData();

      if (previousProjects) {
        const newProjects = previousProjects.map((previousProject) => {
          return previousProject.id === projectId
            ? { ...previousProject, votes: previousProject.votes.filter((projectVote) => projectVote.id !== userId) }
            : previousProject;
        });

        utils.public.getProjects.setData(undefined, newProjects);
      }
    },
  });

  const removeVoteMutation = () => {
    console.log('unvote' + ' ' + projectId + ' ' + userId);
    mutate({ projectId, remove: true });
  };

  return { removeVoteMutation, isRemoveVoteLoading, isRemoveVoteError };
};
