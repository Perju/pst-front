import { Component, OnInit } from '@angular/core';

import { TwitchPstService } from '../../services/twitch-pst.service';

@Component({
  selector: 'twitch-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class TwitchLoginComponent implements OnInit {
  appToken = 'appToken';
  appSecret = 'appSecret';
  chatToken = 'chatToken';

  constructor(private twitchPstService: TwitchPstService) {}

  ngOnInit() {
    this.read_token('appToken').subscribe({
      next: data => (this.appToken = JSON.parse(data)),
      error: err => console.log(err),
      complete: () => console.log('getCommands() complete'),
    });
  }

  read_token(token: string) {
    return this.twitchPstService.getToken(token);
  }
  addAppToken() {
    console.log(this.appToken);
  }
  addAppSecret() {
    console.log(this.appSecret);
  }
  addChatToken() {
    console.log(this.chatToken);
  }
  createTwitchTokensDB() {
    this.twitchPstService.createTokensDB().subscribe({
      next: data => console.log(data),
      error: err => console.log(err),
      complete: () => console.log('BBDD Tokens creada'),
    });
  }
}
