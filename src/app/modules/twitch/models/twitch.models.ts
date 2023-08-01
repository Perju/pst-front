interface User {}
interface Token {}
interface Timer {}
interface Command {}

export interface ChatBot {
  userBot: User;
  tokens: Token[];
  timers: Timer[];
  commands: Command[];
}

export interface TwitchCommand {
  id?: number;
  name: string;
  response: string;
  active: boolean;
  usrLvl: UserLevel;
}

export interface TwitchTimer {
  id?: string;
  name: string;
  message: string;
  period: number;
  active: boolean;
}

export interface Usuario {
  id: string;
  name: string;
  usrLvl: UserLevel;
}

export enum UserLevel {
  VIEWER,
  FOLLOWER,
  SUB,
  VIP,
  MOD,
  STREAMER,
}
