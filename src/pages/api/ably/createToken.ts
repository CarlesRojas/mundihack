import { env } from '@env/server.mjs';
import Ably from 'ably/promises';
import type { NextApiHandler } from 'next';
import uuid from 'react-uuid';

const handler: NextApiHandler = async (_, res) => {
  const client = new Ably.Realtime(env.ABLY_CLIENT_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: uuid() });
  res.status(200).json(tokenRequestData);
};

export default handler;
