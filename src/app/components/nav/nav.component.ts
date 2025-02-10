import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
    standalone: false
})
export class NavComponent implements OnInit {
  public twitchLink = ['', { outlets: { leftBar: 'twitch/leftBar', primary: 'twitch/login' } }];
  public obsLink = ['', { outlets: { leftBar: 'obs/leftBar', primary: 'obs/login' } }];
  public obsweb = false;

  ngOnInit(): void {
    if (environment.obsweb) {
      this.obsweb = true;
    }
  }
}
