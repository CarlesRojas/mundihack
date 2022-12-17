import Button from '@components/Button';
import Input from '@components/Input';
import Loading from '@components/Loading';
import Text from '@components/Text';
import useAbly from '@hooks/useAbly';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { styled } from '@styles/stitches.config';
import checkUrlIsValid from '@utils/checkUrlIsValid';
import { ACTION, AUTH_STATUS, ROUTE } from '@utils/constants';
import { trpc } from '@utils/trpc';
import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { RiSave2Fill } from 'react-icons/ri';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
});

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  pointerEvents: 'none',
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
  const { status } = useSession();

  const { data: submitAction, isError: isSubmitActionError } = trpc.public.getAction.useQuery({ name: ACTION.PROJECT });
  const {
    data: user,
    isLoading: isGetUserLoading,
    isError: isGetUserError,
  } = trpc.private.getUser.useQuery(undefined, {
    enabled: status === AUTH_STATUS.AUTHENTICATED,
  });
  const {
    data: project,
    isLoading: isGetProjectLoading,
    isError: isGetProjectError,
  } = trpc.private.getProject.useQuery({ projectId: user?.projectId }, { enabled: !!user && !!user.projectId });

  const isError = isGetUserError || isGetProjectError;
  const isLoading = isGetUserLoading || isGetProjectLoading;
  const canSumbit = status === AUTH_STATUS.AUTHENTICATED && submitAction?.allowed && !isSubmitActionError;

  const { updateTeamProject } = useAbly();

  const {
    mutate: updateProjectMutation,
    isLoading: isUpdateProjectLoading,
    isError: isUpdateProjectError,
  } = trpc.private.updateProject.useMutation({
    onSuccess: () => {
      updateTeamProject();
    },
  });

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
  const validateLinkFromGithub = (link: string) =>
    link ? checkUrlIsValid(link, true) || 'must be a valid github url' : true;

  const container = (children: JSX.Element) => <Container>{children}</Container>;

  if (user && !user.projectId) return container(<Text>{"looks like you haven't joined a project yet"}</Text>);
  if (isLoading) return container(<Loading showLabel />);
  if (isError) return container(<Text yellow>{'there was an error getting the project information'}</Text>);

  if (!canSumbit) return container(<Text>{'submissions are closed'}</Text>);

  return container(
    <>
      <Text>
        {project?.name
          ? 'all set! you can update this at any point before the time runs out'
          : 'remember to fill your project information before the time runs out'}
      </Text>

      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Input
          id={'name'}
          label={'project name:'}
          focusOnMount
          register={register('name', { required: { value: true, message: 'this field is required' } })}
          error={getFormErrorMessage('name')}
          isLoading={isUpdateProjectLoading}
          maxLength={20}
        />

        <Input
          id={'description'}
          label={'short description:'}
          register={register('description', { required: { value: true, message: 'this field is required' } })}
          error={getFormErrorMessage('description')}
          isLoading={isUpdateProjectLoading}
          maxLength={200}
        />

        <Input
          id={'githubLink'}
          label={'github link:'}
          register={register('githubLink', {
            required: { value: true, message: 'this field is required' },
            validate: validateLinkFromGithub,
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

        <div />

        <Button
          label={project?.name ? 'update' : 'save'}
          isLoading={isUpdateProjectLoading}
          isDisabled={!isDirty || !isValid}
          icon={<RiSave2Fill />}
        />

        {isUpdateProjectError && <Text yellow>{'there was an error updating the project information'}</Text>}
      </Form>
    </>,
  );
};

export default YourProject;
