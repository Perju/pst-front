import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CONSTANTS {
  static readonly TWITCH_READ_URL = 'http://127.0.0.1:5000/api/twitch/read';
  static readonly TWITCH_CREATE_URL = 'http://127.0.0.1:5000/api/twitch/create';
  static readonly TWITCH_COMMANDS = 'twitch_commands';
  static readonly TWITCH_TIMERS = 'twitch_timers';
}
