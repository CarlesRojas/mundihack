import { assertConfiguration, usePresence } from '@ably-labs/react-hooks';
import { ABLY_CHANNEL } from '@utils/constants';

const Participants = () => {
  const ably = assertConfiguration();
  const [presenceData] = usePresence(ABLY_CHANNEL);

  const presenceList = presenceData.map((member) => {
    const isItMe = member.clientId === ably.auth.clientId ? '(me)' : '';

    return (
      <li key={member.clientId}>
        <span>{member.clientId}</span>
        <span>{isItMe}</span>
      </li>
    );
  });

  return <ul>{presenceList}</ul>;
};

export default Participants;
