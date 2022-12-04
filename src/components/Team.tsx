import useSessionUser from '@hooks/useSessionUser';
import useUser from '@hooks/useUser';
import { styled } from '@styles/stitches.config';
import { MAX_TEAM_SIZE } from '@utils/constants';
import getBoxRow from '@utils/getBoxRow';
import parseName from '@utils/parseName';
import type { RouterOutputs } from '@utils/trpc';
import { trpc } from '@utils/trpc';
import Text from './Text';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'none',

  variants: {
    active: {
      true: {
        cursor: 'pointer',
        pointerEvents: 'all',
      },
    },
  },
});

interface TeamProps {
  team: RouterOutputs['public']['getProjects'][0];
  index: number;
  updateTeams: () => void;
}

const Team = ({ team, index, updateTeams }: TeamProps) => {
  const utils = trpc.useContext();
  const userSession = useSessionUser();
  const user = useUser();

  const isUserTeam = user?.projectId === team.id;

  const { mutate } = trpc.private.joinOrLeaveProject.useMutation({
    onSuccess: updateTeams,
    onMutate: () => {
      if (!user) return;

      const previousUser = utils.private.getUser.getData();
      if (previousUser) {
        const newUser = { ...previousUser, projectId: isUserTeam ? null : team.id };
        utils.private.getUser.setData(undefined, newUser);
      }

      const previousUsers = utils.public.getUsers.getData();
      if (previousUsers) {
        const newUsers = previousUsers.map((previousUser) => {
          return previousUser.id === user.id
            ? { ...previousUser, projectId: isUserTeam ? null : team.id }
            : previousUser;
        });

        utils.public.getUsers.setData(undefined, newUsers);
      }

      const previousProjects = utils.public.getProjects.getData();
      if (previousProjects) {
        const newProjects = previousProjects.map((previousProject) => {
          return previousProject.id === team.id
            ? {
                ...previousProject,
                users: isUserTeam
                  ? previousProject.users.filter((projectUser) => projectUser.id !== user.id)
                  : [...previousProject.users, { id: user.id, name: user.name }],
              }
            : previousProject;
        });

        utils.public.getProjects.setData(undefined, newProjects);
      }
    },
  });

  const teamText = { text: `Team ${index}` };
  const usersText = team.users.map(({ name }) => ({ text: `[ ${parseName(name).fullName} ]` }));

  return (
    <Container active={!!userSession} onClick={() => mutate({ projectId: team.id })}>
      <Text red={isUserTeam} pre>
        {getBoxRow({ first: true, placeText: teamText }).join('')}
      </Text>
      <Text red={isUserTeam} pre>
        {getBoxRow({}).join('')}
      </Text>

      {Array.from({ length: MAX_TEAM_SIZE }).map((_, i) => (
        <Text red={isUserTeam} key={i} pre>
          {getBoxRow({ placeText: i < usersText.length ? usersText[i] : undefined }).join('')}
        </Text>
      ))}

      <Text red={isUserTeam} pre>
        {getBoxRow({ last: true }).join('')}
      </Text>
    </Container>
  );
};

export default Team;
