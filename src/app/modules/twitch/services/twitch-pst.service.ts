import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONSTANTS } from '../twitch-constants';
import { TwitchTimer } from '../models/twitch.models';

@Injectable({ providedIn: 'root' })
export class TwitchPstService {
  constructor(private http: HttpClient) {}

  getCommands() {
    const body = { table: CONSTANTS.TWITCH_COMMANDS };
    return this.http.post<any>(CONSTANTS.TWITCH_READ_URL, body);
  }
  getTimers() {
    const body = { table: CONSTANTS.TWITCH_TIMERS };
    return this.http.post<any>(CONSTANTS.TWITCH_READ_URL, body);
  }

  addTimer(timer: TwitchTimer) {
    const data: any = { ...timer };
    data.active = data.active ? 1 : 0;
    const body = { table: CONSTANTS.TWITCH_TIMERS, data: data };
    return this.http.post<any>(CONSTANTS.TWITCH_CREATE_URL, body).subscribe({
      next: (data) => {
        console.log(data);
      }
    });
  }
}
