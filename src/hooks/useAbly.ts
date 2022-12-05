import type { AblyMessageCallback } from '@ably-labs/react-hooks';
import { useChannel } from '@ably-labs/react-hooks';
import type { ABLY_EVENT } from '@utils/constants';
import { ABLY_CHANNEL } from '@utils/constants';
import { useCallback } from 'react';

type AblyCallbacks = { [key in ABLY_EVENT]?: () => void };

const useAbly = (callbacks?: AblyCallbacks) => {
  const ablyCallback = useCallback<AblyMessageCallback>(
    (message) => {
      const event = message.name as ABLY_EVENT;
      callbacks && callbacks[event]?.();
    },
    [callbacks],
  );

  const [, ably] = useChannel(ABLY_CHANNEL, ablyCallback);

  const updateTeams = useCallback(async () => {
    await fetch('/api/ably/updateTeams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: ably.auth.clientId }),
    });
  }, [ably]);

  const updateActions = useCallback(async () => {
    await fetch('/api/ably/updateActions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: ably.auth.clientId }),
    });
  }, [ably]);

  const updateTeamProject = useCallback(async () => {
    await fetch('/api/ably/updateTeamProject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: ably.auth.clientId }),
    });
  }, [ably]);

  return { updateTeams, updateActions, updateTeamProject };
};

export default useAbly;
