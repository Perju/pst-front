import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  standalone: false,
})
export class NavComponent implements OnInit {
  public twitchLink = [
    '',
    { outlets: { menu: 'twitch/menu', primary: 'twitch' } },
  ];
  public obsLink = ['', { outlets: { menu: 'obs/menu', primary: 'obs' } }];
  public obsweb = false;

  ngOnInit(): void {
    if (environment.obsweb) {
      this.obsweb = true;
    }
  }
}
