import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONSTANTS } from '../twitch-constants';
import {
  TwitchCommand,
  TwitchTimer,
  TwitchToken,
} from '../models/twitch.models';

@Injectable({ providedIn: 'root' })
export class TwitchPstService {
  constructor(private http: HttpClient) {}
  // Create DB
  createDB() {
    return this.http.get<any>(CONSTANTS.TWITCH_DB_CREATE);
  }
  createTokensDB() {
    return this.http.get<any>(CONSTANTS.TWITCH_DB_TOKENS_CREATE);
  }

  // Commands
  getCommands() {
    const body = { table: CONSTANTS.TWITCH_COMMANDS };
    return this.http.post<any>(CONSTANTS.TWITCH_READ_URL, body);
  }
  addCommand(command: TwitchCommand) {
    const data: any = { ...command };
    data.usr_lvl = parseInt(data.usr_lvl);
    // ID de un antes de insertarse en BBDD
    data.id = -1;
    const body = { table: CONSTANTS.TWITCH_COMMANDS, data: data };
    return this.http.post<any>(CONSTANTS.TWITCH_CREATE_URL, body).subscribe({
      next: data => {
        console.log(data);
      },
    });
  }

  // Timers
  getTimers() {
    const body = { table: CONSTANTS.TWITCH_TIMERS };
    return this.http.post<any>(CONSTANTS.TWITCH_READ_URL, body);
  }
  addTimer(timer: TwitchTimer) {
    const data: any = { ...timer };
    // ID de un antes de insertarse en BBDD
    data.id = -1;
    const body = { table: CONSTANTS.TWITCH_TIMERS, data: data };
    return this.http.post<any>(CONSTANTS.TWITCH_CREATE_URL, body).subscribe({
      next: data => console.log(data),
    });
  }

  // Tokens
  getToken(token_name: string) {
    const body = { name: token_name };
    return this.http.post<any>(CONSTANTS.TWITCH_READ_TOKEN, body);
  }
  addToken(token: TwitchToken) {
    const body = { name: token.name, value: token.value };
    return this.http.post<any>(CONSTANTS.TWITCH_CREATE_TOKEN, body).subscribe({
      next: data => console.log('next addToken', data),
    });
  }
}
