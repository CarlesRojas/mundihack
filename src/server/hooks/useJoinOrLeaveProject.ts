import type { RouterOutputs } from '@utils/trpc';
import { trpc } from '@utils/trpc';

interface JoinOrLeaveProjectMutation {
  user?: RouterOutputs['private']['getUser'];
  team: RouterOutputs['public']['getProjects'][0];
  onSuccess: () => void;
}

export const useJoinProject = ({ user, team, onSuccess }: JoinOrLeaveProjectMutation) => {
  const utils = trpc.useContext();

  const {
    mutate: joinProject,
    isLoading: isJoinProjectLoading,
    isError: isJoinProjectError,
  } = trpc.private.joinOrLeaveProject.useMutation({
    onSuccess,
    onMutate: () => {
      if (!user) return;

      const previousUser = utils.private.getUser.getData();
      const previousUsers = utils.public.getUsers.getData();
      const previousProjects = utils.public.getProjects.getData();

      if (previousUser) {
        const newUser = { ...previousUser, projectId: team.id };
        utils.private.getUser.setData(undefined, newUser);
      }

      if (previousUsers) {
        const newUsers = previousUsers.map((previousUser) => {
          return previousUser.id === user.id ? { ...previousUser, projectId: team.id } : previousUser;
        });

        utils.public.getUsers.setData(undefined, newUsers);
      }

      if (previousProjects) {
        const newProjects = previousProjects.map((previousProject) => {
          return previousProject.id === team.id
            ? { ...previousProject, users: [...previousProject.users, { id: user.id, name: user.name }] }
            : previousProject;
        });

        utils.public.getProjects.setData(undefined, newProjects);
      }
    },
  });

  return { joinProject, isJoinProjectLoading, isJoinProjectError };
};

export const useLeaveProject = ({ user, team, onSuccess }: JoinOrLeaveProjectMutation) => {
  const utils = trpc.useContext();

  const {
    mutate: leaveProject,
    isLoading: isLeaveProjectLoading,
    isError: isLeaveProjectError,
  } = trpc.private.joinOrLeaveProject.useMutation({
    onSuccess,
    onMutate: () => {
      if (!user) return;

      const previousUser = utils.private.getUser.getData();
      const previousUsers = utils.public.getUsers.getData();
      const previousProjects = utils.public.getProjects.getData();

      if (previousUser) {
        const newUser = { ...previousUser, projectId: null };
        utils.private.getUser.setData(undefined, newUser);
      }

      if (previousUsers) {
        const newUsers = previousUsers.map((previousUser) => {
          return previousUser.id === user.id ? { ...previousUser, projectId: null } : previousUser;
        });

        utils.public.getUsers.setData(undefined, newUsers);
      }

      if (previousProjects) {
        const newProjects = previousProjects.map((previousProject) => {
          return previousProject.id === team.id
            ? { ...previousProject, users: previousProject.users.filter((projectUser) => projectUser.id !== user.id) }
            : previousProject;
        });

        utils.public.getProjects.setData(undefined, newProjects);
      }
    },
  });

  return { leaveProject, isLeaveProjectLoading, isLeaveProjectError };
};
