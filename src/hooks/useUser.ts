import { useSession } from 'next-auth/react';

const useUser = () => {
  const { data: sessionData } = useSession();

  if (!sessionData || !sessionData.user) return null;

  const name = sessionData.user.name?.split(' ');
  const firstName = name && name.length > 0 ? name[0] : 'anonymous';
  const lastName = name && name.length > 1 ? name[1] : '';

  return {
    email: sessionData.user.email,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    image: sessionData.user.image,
    id: sessionData.user.id,
  };
};

export default useUser;
