import Button from '@components/Button';
import Input from '@components/Input';
import Text from '@components/Text';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { styled } from '@styles/stitches.config';
import checkUrlIsValid from '@utils/checkUrlIsValid';
import { ROUTE } from '@utils/constants';
import { trpc } from '@utils/trpc';
import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { RiSendPlane2Fill } from 'react-icons/ri';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
});

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) return { redirect: { destination: ROUTE.CALENDAR, permanent: false } };
  return { props: {} };
};

interface YourProjectInputs {
  name: string;
  description: string;
  githubLink: string;
  projectLink: string;
}

const YourProject: NextPage = () => {
  const { data: session } = useSession();

  const { data: user } = trpc.private.getUser.useQuery(undefined, { enabled: !!session });
  const { data: project, isLoading: isGetProjectLoading } = trpc.private.getProject.useQuery(
    { projectId: user?.projectId },
    { enabled: !!user && !!user.projectId },
  );

  const {
    mutate: updateProjectMutation,
    isLoading: isUpdateProjectLoading,
    isError: isUpdateProjectError,
  } = trpc.private.updateProject.useMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<YourProjectInputs>({ mode: 'onChange' });

  useEffect(() => {
    if (project?.name) setValue('name', project.name);
    if (project?.description) setValue('description', project.description);
    if (project?.githubLink) setValue('githubLink', project.githubLink);
    if (project?.projectLink) setValue('projectLink', project.projectLink);
  }, [project, setValue]);

  const onSubmit: SubmitHandler<YourProjectInputs> = (inputsData) => {
    updateProjectMutation({ ...inputsData, projectId: user?.projectId });
  };

  const getFormErrorMessage = (name: keyof YourProjectInputs) => errors[name] && errors[name]?.message;
  const validateLink = (link: string) => (link ? checkUrlIsValid(link) || 'must be a valid url' : true);

  const container = (children: JSX.Element) => <Container>{children}</Container>;
  if (!isGetProjectLoading && !project) return container(<Text>you need to join a team to submit a project</Text>);

  return container(
    <>
      <Text>
        {project?.name
          ? 'all set! you can update this at any point before the time runs out'
          : 'remember to fill your project information before the time runs out'}
      </Text>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id={'name'}
          label={'project name:'}
          focusOnMount
          register={register('name', { required: { value: true, message: 'this field is required' } })}
          error={getFormErrorMessage('name')}
          isLoading={isUpdateProjectLoading}
        />

        <Input
          id={'description'}
          label={'short description:'}
          register={register('description', { required: { value: true, message: 'this field is required' } })}
          error={getFormErrorMessage('description')}
          isLoading={isUpdateProjectLoading}
        />

        <Input
          id={'githubLink'}
          label={'github link:'}
          register={register('githubLink', {
            required: { value: true, message: 'this field is required' },
            validate: validateLink,
          })}
          error={getFormErrorMessage('githubLink')}
          isLoading={isUpdateProjectLoading}
        />

        <Input
          id={'projectLink'}
          label={'project link (optional):'}
          register={register('projectLink', { validate: validateLink })}
          error={getFormErrorMessage('projectLink')}
          isLoading={isUpdateProjectLoading}
        />

        <Button
          label={'submit'}
          isLoading={isUpdateProjectLoading}
          isDisabled={!isDirty || !isValid}
          icon={<RiSendPlane2Fill />}
        />

        {isUpdateProjectError && <Text yellow>there was a problem updating the project information</Text>}
      </Form>
    </>,
  );
};

export default YourProject;
