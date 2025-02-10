import { Component, OnInit } from '@angular/core';

import { TwitchPstService } from '../../services/twitch-pst.service';

@Component({
  selector: 'twitch-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class TwitchLoginComponent implements OnInit {
  appToken = 'appToken';
  appSecret = 'appSecret';
  chatToken = 'chatToken';

  constructor(private twitchPstService: TwitchPstService) {}

  ngOnInit() {
    this.read_token('appToken').subscribe({
      next: data => (this.appToken = JSON.parse(data).value),
      error: err => console.log(err),
      complete: () => console.log('appToken recivido'),
    });
    this.read_token('appSecret').subscribe({
      next: data => (this.appSecret = JSON.parse(data).value),
      error: err => console.log(err),
      complete: () => console.log('appSecret recivido'),
    });
    this.read_token('appChatToken').subscribe({
      next: data => (this.chatToken = JSON.parse(data).value),
      error: err => console.log(err),
      complete: () => console.log('chatToken recivido'),
    });
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
  createTwitchTokensDB() {
    this.twitchPstService.createTokensDB().subscribe({
      next: data => console.log(data),
      error: err => console.log(err),
      complete: () => console.log('BBDD Tokens creada'),
    });
  }
}
