import { useEffect, useRef, useCallback } from 'react';
import {
  createSafeBroadcastChannel,
  BroadcastMessage,
  BROADCAST_CHANNEL_NAME,
  CURRENT_SESSION_ID,
} from 'services/utils/broadcast';

export interface UseBroadcastChannelOptions {
  channelName?: string;
  enabled?: boolean;
}

/**
 * React hook to listen for and publish messages via the BroadcastChannel API.
 * 
 * @param onMessage Callback function invoked when a message is received from another tab.
 * @param options Configuration options for channel name and activation.
 * @returns An object containing the current session/tab ID and a stable postMessage function.
 */
export const useBroadcastChannel = (
  onMessage?: (message: BroadcastMessage) => void,
  options: UseBroadcastChannelOptions = {}
) => {
  const { channelName = BROADCAST_CHANNEL_NAME, enabled = true } = options;

  const onMessageRef = useRef(onMessage);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Keep callback reference updated without triggering re-subscriptions
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Subscribe to channel messages
  useEffect(() => {
    if (!enabled) return;

    const channel = createSafeBroadcastChannel(channelName);
    if (!channel) return;

    channelRef.current = channel;

    const handleMessage = (event: MessageEvent) => {
      const message = event.data as BroadcastMessage;

      // Safety check to ensure message is in expected format
      if (message && message.type) {
        // Exclude messages sent from this exact session/tab (BroadcastChannel natively does this,
        // but it's a good fail-safe/decorator)
        if (message.senderId !== CURRENT_SESSION_ID) {
          onMessageRef.current?.(message);
        }
      }
    };

    if (onMessage) {
      channel.addEventListener('message', handleMessage);
    }

    return () => {
      if (onMessage) {
        channel.removeEventListener('message', handleMessage);
      }
      try {
        channel.close();
      } catch (error) {
        console.error('Error closing BroadcastChannel:', error);
      }
      channelRef.current = null;
    };
  }, [channelName, enabled, Boolean(onMessage)]);

  // Stable postMessage function
  const postMessage = useCallback(
    <T = any>(type: string, payload?: T) => {
      const message: BroadcastMessage<T> = {
        type,
        payload,
        senderId: CURRENT_SESSION_ID,
      };

      // If active channel exists, use it. Otherwise, create a temporary one.
      if (channelRef.current) {
        try {
          channelRef.current.postMessage(message);
        } catch (error) {
          console.error('Failed to post message on active BroadcastChannel:', error);
        }
      } else {
        const tempChannel = createSafeBroadcastChannel(channelName);
        if (!tempChannel) return;
        try {
          tempChannel.postMessage(message);
        } catch (error) {
          console.error('Failed to post message on temporary BroadcastChannel:', error);
        } finally {
          try {
            tempChannel.close();
          } catch {
            // ignore close errors
          }
        }
      }
    },
    [channelName]
  );

  return {
    sessionId: CURRENT_SESSION_ID,
    postMessage,
  };
};
