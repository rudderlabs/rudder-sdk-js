export const destinationRouting = {
  All: true,
  'Google Analytics': false,
};

export const sampleUserId = 'nextjs-sample-user-123';
export const sampleAnonymousId = 'nextjs-sample-anonymous-123';

export const eventTypes = ['page', 'identify', 'track', 'group', 'alias'] as const;

export type EventType = (typeof eventTypes)[number];
