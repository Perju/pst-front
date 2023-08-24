import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CONSTANTS {
  static readonly TWITCH_READ_URL = 'http://localhost:5000/api/twitch/read';
}
