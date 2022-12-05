import useHover from '@hooks/useHover';
import { useJoinProject, useLeaveProject } from '@server/hooks/useJoinOrLeaveProject';
import { styled } from '@styles/stitches.config';
import { MAX_TEAM_SIZE } from '@utils/constants';
import getBoxRow from '@utils/getBoxRow';
import parseName from '@utils/parseName';
import type { RouterOutputs } from '@utils/trpc';
import { trpc } from '@utils/trpc';
import { useSession } from 'next-auth/react';
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
    blocked: {
      true: {
        cursor: 'not-allowed',
      },
    },
  },
});

interface TeamProps {
  team: RouterOutputs['public']['getProjects'][0];
  index: number;
  updateTeams: () => void;
  active?: boolean;
}

const getTeamText = (index: number, isUserTeam: boolean, isTeamFull: boolean, isHovered: boolean) => {
  if (!isHovered) return `Team ${index}`;
  if (isUserTeam) return `Team ${index}________LEAVE`;
  if (isTeamFull) return `Team ${index}________FULL`;
  return `Team ${index}________JOIN`;
};

const Team = ({ team, index, updateTeams, active }: TeamProps) => {
  const { data: session } = useSession();
  const { data: user } = trpc.private.getUser.useQuery(undefined, { enabled: !!session });

  const { hoverRef, isHovered } = useHover();
  const isUserTeam = user?.projectId === team.id;
  const isTeamFull = team.users.length >= MAX_TEAM_SIZE;

  const { joinProject } = useJoinProject({ user, team, onSuccess: updateTeams });
  const { leaveProject } = useLeaveProject({ user, team, onSuccess: updateTeams });

  const handleProjectClick = () => {
    if (isUserTeam) leaveProject({ projectId: team.id });
    else if (team.users.length < MAX_TEAM_SIZE) joinProject({ projectId: team.id });
  };

  const teamText = { text: getTeamText(index, isUserTeam, isTeamFull, isHovered) };
  const usersText = team.users.map(({ name }) => ({ text: `[ ${parseName(name).fullName} ]` }));

  return (
    <Container
      active={active && !!session}
      blocked={isTeamFull && !isUserTeam}
      onClick={handleProjectClick}
      ref={hoverRef}
    >
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
