import { UserData } from '../pages';

export type SocketRoom = Record<string, { roomId: string; user: UserData }>;