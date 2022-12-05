import { env } from '@env/server.mjs';
import { ABLY_CHANNEL, ABLY_EVENT } from '@utils/constants';
import Ably from 'ably/promises';
import type { NextApiHandler } from 'next';

const ably = new Ably.Rest(env.ABLY_SERVER_API_KEY);
const channel = ably.channels.get(ABLY_CHANNEL);

const handler: NextApiHandler = async (req, res) => {
  channel.publish(ABLY_EVENT.UPDATE_ACTIONS, { author: req.body.author });
  res.status(200).json({ success: true });
};

export default handler;
