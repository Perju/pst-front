import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONSTANTS } from '../twitch-constants';

@Injectable({ providedIn: 'root' })
export class TwitchPstService {
  constructor(private http: HttpClient) {}

  getCommands() {
    const body = { service: 'PST_TWITCH_READ_COMMANDS' };
    return this.http.post<any>(CONSTANTS.TWITCH_READ_URL, body);
  }
  getTimers() {
    const body = { service: 'PST_TWITCH_READ_TIMERS' };
    return this.http.post<any>(CONSTANTS.TWITCH_READ_URL, body);
  }
}
