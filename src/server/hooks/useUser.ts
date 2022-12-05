import parseName from '@utils/parseName';
import { trpc } from '@utils/trpc';
import { useSession } from 'next-auth/react';

const useUser = () => {
  const { data } = useSession();
  const { data: userData } = trpc.private.getUser.useQuery(undefined, { enabled: !!data });

  if (!userData) return null;
  const parsedName = parseName(userData.name);

  return {
    ...userData,
    ...parsedName,
  };
};

export default useUser;
