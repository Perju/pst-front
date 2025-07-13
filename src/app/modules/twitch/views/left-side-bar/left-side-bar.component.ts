import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'twitch-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss'],
  standalone: false,
})
export class TwitchLeftSideBarComponent {
  public obsLinks: { label: string; href: string; class?: string }[] = [
    { label: 'Conectar', href: '/twitch' },
    { label: 'Temporizadres', href: '/twitch/timers' },
    { label: 'Comandos', href: '/twitch/commands' },
    { label: 'Ayuda', href: '/twitch/help' },
  ];

  constructor(public router: Router) {}
}
