import { Component, OnInit } from '@angular/core';

import { TwitchPstService } from '../../services/twitch-pst.service';

@Component({
  selector: 'twitch-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class TwitchLoginComponent implements OnInit {
  botConfig: any = {
    appToken: 'appToken',
    appSecret: 'appSecret',
    appChatToken: 'appChatToken',
    chatChannel: 'chatChannel',
  };

  constructor(private twitchPstService: TwitchPstService) {}

  ngOnInit() {
    const tokens = ['appToken', 'appSecret', 'appChatToken', 'chatChannel'];
    tokens.forEach(t => {
      this.read_token(t).subscribe({
        next: data => (this.botConfig[t] = JSON.parse(data).value),
        error: err => console.log(err),
        complete: () => console.log('appToken recivido'),
      });
    });
    console.log(this.botConfig);
  }

  read_token(token: string) {
    return this.twitchPstService.getToken(token);
  }
  add_token(name: string, value: string) {
    const token = { name: name, value: value };
    this.twitchPstService.addToken(token);
  }
  addAppToken(token: string) {
    this.add_token('appToken', token);
  }
  addAppSecret(token: string) {
    this.add_token('appSecret', token);
  }
  addChatToken(token: string) {
    this.add_token('appChatToken', token);
  }
  addChatChannel(token: string) {
    this.add_token('chatChannel', token);
  }

  createTwitchTokensDB() {
    this.twitchPstService.createTokensDB().subscribe({
      next: data => console.log(data),
      error: err => console.log(err),
      complete: () => console.log('BBDD Twitch Tokens creada'),
    });
  }

  createTwitchDB() {
    this.twitchPstService.createDB().subscribe({
      next: data => console.log(data),
      error: err => console.log(err),
      complete: () => console.log('BBDD Twitch commands&timers creada'),
    });
  }
}
