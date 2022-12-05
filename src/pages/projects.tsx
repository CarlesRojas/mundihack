import { styled } from '@styles/stitches.config';
import { trpc } from '@utils/trpc';
import type { NextPage } from 'next';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const Projects: NextPage = () => {
  const { data: projects, refetch: refetchProjects } = trpc.public.getProjects.useQuery();

  return <Container></Container>;
};

export default Projects;
