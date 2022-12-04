import parseName from '@utils/parseName';
import { useSession } from 'next-auth/react';

const useSessionUser = () => {
  const { data: sessionData } = useSession();

  if (!sessionData || !sessionData.user) return null;
  const parsedName = parseName(sessionData.user.name);

  return {
    email: sessionData.user.email,
    ...parsedName,
    image: sessionData.user.image,
    id: sessionData.user.id,
  };
};

export default useSessionUser;
