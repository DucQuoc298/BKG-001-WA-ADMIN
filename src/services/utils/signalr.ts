import {
  HubConnection,
  HubConnectionBuilder,  
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { KEY_CONTEXT } from 'themes/config';

const HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL as string;

let connection: HubConnection | null = null;

const getToken = (): string => {
  try {
    const raw = localStorage.getItem(KEY_CONTEXT.AUTH);
    return JSON.parse(raw ?? '{}')?.token ?? '';
  } catch {
    return '';
  }
};

export const buildConnection = (): HubConnection => {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: getToken,
    })
    .withAutomaticReconnect()
    .configureLogging(
      import.meta.env.DEV ? LogLevel.Information : LogLevel.Warning,
    )
    .build();

  return connection;
};

export const startConnection = async (): Promise<void> => {
  const conn = buildConnection();
  if (conn.state === HubConnectionState.Disconnected) {
    await conn.start();
  }
};

export const stopConnection = async (): Promise<void> => {
  if (connection && connection.state !== HubConnectionState.Disconnected) {
    await connection.stop();
    connection = null;
  }
};

export const getConnection = (): HubConnection | null => connection;
