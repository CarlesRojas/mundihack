import useResize from '@hooks/useResize';
import { useRemoveVote, useVote } from '@server/hooks/useVote';
import { tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { CHARACTER_WIDTH } from '@utils/constants';
import getBoxRow from '@utils/getBoxRow';
import parseName from '@utils/parseName';
import type { RouterOutputs } from '@utils/trpc';
import { Fragment, useRef, useState } from 'react';
import { RiCheckFill, RiCloseFill } from 'react-icons/ri';
import Button from './Button';
import Text from './Text';

const Container = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',

  variants: {
    active: {
      true: {
        cursor: 'pointer',
        pointerEvents: 'all',
      },
    },
    blocked: {
      true: {
        cursor: 'not-allowed !important',
      },
    },
    winner: {
      true: {
        marginBottom: '5rem',
      },
    },
  },
});

const ResponsiveContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',

  [tablet]: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: '1rem',
  },

  variants: {
    spaceBetween: {
      true: {
        [tablet]: {
          justifyContent: 'space-between',
        },
      },
    },
    bigGap: {
      true: {
        gap: '1.5rem',
      },
    },
  },
});

const ProjectInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const Padding = styled('div', {
  width: '100%',
  height: '0.5rem',
});

const ExternalLink = styled('a', {
  fontWeight: '500',

  '&:hover': {
    textDecoration: 'underline',
  },
});

const CreatorsContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: '0.7rem',
  rowGap: '0.5rem',
  marginBottom: '1rem',
});

interface ProjectProps {
  project: RouterOutputs['public']['getProjects'][0];
  userId?: string;
  first?: boolean;
  userHasVoted?: boolean;
  canVote?: boolean;
  winner?: boolean;
}

const getSeparatorCharacter = (index: number, length: number) => {
  if (index === length - 1) return '';
  if (index === length - 2) return ' and ';
  return ', ';
};

const Project = ({ project, userId, first, userHasVoted, canVote, winner }: ProjectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barLength, setBarLength] = useState(0);

  useResize(() => {
    const newBarLength = containerRef.current?.offsetWidth;
    if (!newBarLength) return;
    setBarLength(Math.floor(newBarLength / CHARACTER_WIDTH));
  }, true);

  const isUserProject = project.users.some((user) => user.id === userId);
  const userVotedThisOne = project.votes.some((vote) => vote.id === userId);

  const { voteMutation, isVoteError, isVoteLoading } = useVote({ projectId: project.id, userId });
  const { removeVoteMutation, isRemoveVoteError, isRemoveVoteLoading } = useRemoveVote({
    projectId: project.id,
    userId,
  });

  return (
    <Container ref={containerRef} winner={winner}>
      {first && !winner && (
        <Text pre>_{getBoxRow({ first: true, charactersWidth: barLength, startSpace: false }).join('')}_</Text>
      )}
      {first && winner && (
        <Text pre red>
          _
          {getBoxRow({
            first: true,
            charactersWidth: barLength,
            startSpace: false,
            placeText: { text: 'WINNER' },
          }).join('')}
          _
        </Text>
      )}
      <Padding />

      <ResponsiveContainer css={{ width: `${(barLength - 2) * CHARACTER_WIDTH}px` }} spaceBetween bigGap>
        <ProjectInfo>
          <Text red={(canVote && userVotedThisOne) || winner}>{project.name}</Text>

          <Text low>{project.description}</Text>

          <CreatorsContainer>
            <Text>by</Text>

            {project.users.map((user, i) => (
              <Fragment key={user.id}>
                <Text>{`${parseName(user.name).fullName}${getSeparatorCharacter(i, project.users.length)}`}</Text>
              </Fragment>
            ))}
          </CreatorsContainer>

          <ResponsiveContainer>
            {project.projectLink && (
              <ExternalLink href={project.projectLink} target="_blank">
                {'[ view project ]'}
              </ExternalLink>
            )}

            {project.githubLink && (
              <ExternalLink href={project.githubLink} target="_blank">
                {'[ view on github ]'}
              </ExternalLink>
            )}
          </ResponsiveContainer>
        </ProjectInfo>

        {canVote && userId && userVotedThisOne && (
          <Button
            icon={<RiCloseFill />}
            label={'remove vote'}
            onClick={() => removeVoteMutation()}
            isLoading={isRemoveVoteLoading}
            isDisabled={isRemoveVoteError}
          />
        )}

        {canVote && userId && !isUserProject && !userVotedThisOne && !userHasVoted && (
          <Button
            icon={<RiCheckFill />}
            label={'vote'}
            onClick={() => voteMutation()}
            isLoading={isVoteLoading}
            isDisabled={isVoteError}
          />
        )}

        {!canVote && <Text css={{ minWidth: 'fit-content' }}>{`${project.votes.length} votes`}</Text>}
      </ResponsiveContainer>

      {isVoteError && <Text yellow>there was an error when voting</Text>}
      {isRemoveVoteError && <Text yellow>there was an error removing the vote</Text>}

      <Text pre red={winner}>
        _{getBoxRow({ first: true, charactersWidth: barLength, startSpace: false }).join('')}_
      </Text>
    </Container>
  );
};

export default Project;
