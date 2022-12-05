import Text from '@components/Text';
import { styled } from '@styles/stitches.config';
import { trpc } from '@utils/trpc';
import type { NextPage } from 'next';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const Projects: NextPage = () => {
  const { data: projects } = trpc.public.getProjects.useQuery();

  const sumbittedProjects = projects?.filter((project) => !!project.name);

  console.log(sumbittedProjects);

  return (
    <Container>
      {sumbittedProjects && sumbittedProjects.length <= 0 && <Text>no projects have been submitted yet</Text>}
    </Container>
  );
};

export default Projects;
