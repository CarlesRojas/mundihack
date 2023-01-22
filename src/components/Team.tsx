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
});

interface TeamProps {
  team: RouterOutputs['public']['getProjects'][0];
  index: number;
  user?: RouterOutputs['private']['getUser'];
}

const Team = ({ team, index, user }: TeamProps) => {
  const isUserTeam = user?.projectId === team.id;

  const teamText = { text: team.name ?? `Team ${index}` };
  const usersText = team.users.map(({ name }) => ({ text: `[ ${parseName(name).fullName} ]` }));

  return (
    <Container>
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
