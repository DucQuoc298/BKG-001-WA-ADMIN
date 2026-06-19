export interface BroadcastMessage<T = any> {
  type: string;
  payload?: T;
  senderId?: string;
}

export const BROADCAST_CHANNEL_NAME = 'app_global_channel';

export const BroadcastEventTypes = {
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_LOGIN: 'AUTH_LOGIN',
  THEME_CHANGE: 'THEME_CHANGE',
  NOTIFICATION_RECEIVE: 'NOTIFICATION_RECEIVE',
  CUSTOM_EVENT: 'CUSTOM_EVENT',
} as const;

export type BroadcastEventType = typeof BroadcastEventTypes[keyof typeof BroadcastEventTypes];

// Generate a random ID for the current session/tab to identify senders
const generateSessionId = () => Math.random().toString(36).substring(2, 11);
export const CURRENT_SESSION_ID = generateSessionId();

/**
 * Safely creates a BroadcastChannel instance if supported by the browser.
 */
export const createSafeBroadcastChannel = (channelName: string = BROADCAST_CHANNEL_NAME): BroadcastChannel | null => {
  if (typeof window === 'undefined' || typeof window.BroadcastChannel === 'undefined') {
    console.warn('BroadcastChannel is not supported in this environment.');
    return null;
  }
  try {
    return new window.BroadcastChannel(channelName);
  } catch (error) {
    console.error('Failed to create BroadcastChannel:', error);
    return null;
  }
};

/**
 * Safely posts a message to a BroadcastChannel.
 */
export const postBroadcastMessage = <T = any>(
  type: string,
  payload?: T,
  channelName: string = BROADCAST_CHANNEL_NAME
): void => {
  const channel = createSafeBroadcastChannel(channelName);
  if (!channel) return;

  try {
    const message: BroadcastMessage<T> = {
      type,
      payload,
      senderId: CURRENT_SESSION_ID,
    };
    channel.postMessage(message);
  } catch (error) {
    console.error('Failed to post message to BroadcastChannel:', error);
  } finally {
    try {
      channel.close();
    } catch {
      // ignore close errors
    }
  }
};
