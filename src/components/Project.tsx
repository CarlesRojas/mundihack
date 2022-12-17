import useResize from '@hooks/useResize';
import { tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { CHARACTER_WIDTH } from '@utils/constants';
import getBoxRow from '@utils/getBoxRow';
import parseName from '@utils/parseName';
import type { RouterOutputs } from '@utils/trpc';
import { Fragment, useRef, useState } from 'react';
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
        marginBottom: '3rem',
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
  first?: boolean;
}

const getSeparatorCharacter = (index: number, length: number) => {
  if (index === length - 1) return '';
  if (index === length - 2) return ' and ';
  return ', ';
};

const Project = ({ project, first }: ProjectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barLength, setBarLength] = useState(0);

  useResize(() => {
    const newBarLength = containerRef.current?.offsetWidth;
    if (!newBarLength) return;
    setBarLength(Math.floor(newBarLength / CHARACTER_WIDTH));
  }, true);

  return (
    <Container ref={containerRef} winner={project.winner}>
      {first && !project.winner && (
        <Text pre>{getBoxRow({ first: true, charactersWidth: barLength, startSpace: false }).join('')}</Text>
      )}
      {first && project.winner && (
        <Text pre red>
          {getBoxRow({
            first: true,
            charactersWidth: barLength,
            startSpace: false,
            placeText: { text: 'WINNER' },
          }).join('')}
        </Text>
      )}
      <Padding />

      <ResponsiveContainer css={{ width: `${barLength * CHARACTER_WIDTH}px` }} spaceBetween bigGap>
        <ProjectInfo>
          <Text red={project.winner}>{project.name}</Text>

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
      </ResponsiveContainer>

      <Text css={{ width: 'fit-content' }} pre red={project.winner}>
        {getBoxRow({ first: true, charactersWidth: barLength, startSpace: false }).join('')}
      </Text>
    </Container>
  );
};

export default Project;
