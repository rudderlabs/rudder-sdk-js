import type { NextApiRequest, NextApiResponse } from 'next';
import type { EventType } from '@/lib/rudderstack-config';
import { RudderStackConfigurationError, sendServerEvent } from '@/lib/rudderstack-server';

const supportedEvents: EventType[] = ['page', 'identify', 'track', 'group', 'alias'];

type ApiResponse = {
  message: string;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse>,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ message: 'Use POST for this endpoint.' });
    return;
  }

  if (
    process.env.NODE_ENV === 'production' &&
    process.env.RUDDERSTACK_ALLOW_SERVER_EVENTS_API !== 'true'
  ) {
    response.status(403).json({ message: 'The server event demo is disabled in production.' });
    return;
  }

  const type = request.body?.type;
  if (typeof type !== 'string' || !supportedEvents.includes(type as EventType)) {
    response.status(400).json({ message: 'The event type is not supported.' });
    return;
  }

  try {
    await sendServerEvent(type as EventType);
    response.status(200).json({ message: `The server sent a ${type} event.` });
  } catch (error) {
    console.error('Failed to send a server event.', error);
    const message =
      error instanceof RudderStackConfigurationError
        ? error.message
        : 'The server could not send the event.';
    response.status(500).json({ message });
  }
}
