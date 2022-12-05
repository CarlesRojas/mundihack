import { useJoinProject, useLeaveProject } from '@server/hooks/useJoinOrLeaveProject';
import useSessionUser from '@server/hooks/useSessionUser';
import useUser from '@server/hooks/useUser';
import { styled } from '@styles/stitches.config';
import { MAX_TEAM_SIZE } from '@utils/constants';
import getBoxRow from '@utils/getBoxRow';
import parseName from '@utils/parseName';
import type { RouterOutputs } from '@utils/trpc';
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
  const userSession = useSessionUser();
  const user = useUser();

  const isUserTeam = user?.projectId === team.id;

  const { joinProject } = useJoinProject({ user, team, onSuccess: updateTeams });
  const { leaveProject } = useLeaveProject({ user, team, onSuccess: updateTeams });

  const handleProjectClick = () => {
    if (isUserTeam) leaveProject({ projectId: team.id });
    else if (team.users.length < MAX_TEAM_SIZE) joinProject({ projectId: team.id });
  };

  const teamText = { text: `Team ${index}` };
  const usersText = team.users.map(({ name }) => ({ text: `[ ${parseName(name).fullName} ]` }));

  return (
    <Container active={!!userSession} onClick={handleProjectClick}>
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
