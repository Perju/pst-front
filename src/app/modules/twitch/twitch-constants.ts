import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CONSTANTS {
  static readonly PORT = '5000';
  static readonly TWITCH_DB_CREATE = `http://127.0.0.1:${CONSTANTS.PORT}/api/twitch/create_db`;
  static readonly TWITCH_DB_TOKENS_CREATE = `http://127.0.0.1:${CONSTANTS.PORT}/api/twitch/create_tokens_db`;
  static readonly TWITCH_READ_URL = `http://127.0.0.1:${CONSTANTS.PORT}/api/twitch/read`;
  static readonly TWITCH_CREATE_URL = `http://127.0.0.1:${CONSTANTS.PORT}/api/twitch/create`;
  static readonly TWITCH_COMMANDS = `twitch_commands`;
  static readonly TWITCH_TIMERS = `twitch_timers`;
  static readonly TWITCH_READ_TOKEN = `http://127.0.0.1:${CONSTANTS.PORT}/api/twitch/token/read`;
  static readonly TWITCH_CREATE_TOKEN = `http://127.0.0.1:${CONSTANTS.PORT}/api/twitch/token/create`;
}
