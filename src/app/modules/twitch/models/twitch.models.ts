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
  active: boolean;
  name: string;
  colddown: number;
  response: string;
  usr_lvl: UserLevel;
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
  VIEWER = 0,
  FOLLOWER = 1,
  SUB = 2,
  VIP = 3,
  MOD = 4,
  STREAMER = 5,
}
