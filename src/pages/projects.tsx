import Loading from '@components/Loading';
import Project from '@components/Project';
import Text from '@components/Text';
import { styled } from '@styles/stitches.config';
import { AUTH_STATUS, SHORT_MONTHS, START_TIME } from '@utils/constants';
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
const sortWinner = (a: ProjectToSort) => (a.winner ? -1 : 1);

const Projects: NextPage = () => {
  const { status } = useSession();
  const { data: projects, isError: isGetProjectsError } = trpc.public.getProjects.useQuery();

  const sumbittedProjects = projects?.filter((project) => !!project.name);

  const container = (children: JSX.Element) => <Container>{children}</Container>;

  if (isGetProjectsError) return container(<Text yellow>{'there was an error getting the projects'}</Text>);

  if (sumbittedProjects && sumbittedProjects.length <= 0) {
    const hasStarted = new Date().getTime() - START_TIME > 0;
    const startTime = new Date(START_TIME);

    return container(
      <>
        <Text>{'no projects have been submitted yet'}</Text>
        {!hasStarted && (
          <Text>{`<mundi>hack starts on ${startTime.getDate()} ${
            SHORT_MONTHS[startTime.getMonth()]
          } ${startTime.getFullYear()} at ${startTime.getHours()}:${
            startTime.getMinutes() < 10 ? `0${startTime.getMinutes()}` : startTime.getMinutes()
          }`}</Text>
        )}
      </>,
    );
  }

  if (status === AUTH_STATUS.LOADING) return container(<Loading showLabel />);

  const hasWinner = sumbittedProjects?.some((project) => project.winner);

  return container(
    <>
      {sumbittedProjects &&
        sumbittedProjects
          .sort(sortWinner)
          .map((project, i) => <Project key={project.id} project={project} first={hasWinner ? i <= 1 : i <= 0} />)}
    </>,
  );
};

export default Projects;
