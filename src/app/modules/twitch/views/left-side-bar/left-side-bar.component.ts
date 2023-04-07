import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'twitch-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.sass']
})
export class TwitchLeftSideBarComponent implements OnInit {
  public obsLinks: { label: string; href: string; class?: string }[] = [
    { label: 'Conectar', href: '/twitch/login' },
    { label: 'Temporizadres', href: '/twitch/timers' },
    { label: 'Comandos', href: '/twitch/commands' },
    { label: 'Ayuda', href: '/twitch/help' }
  ]

  constructor(public router: Router) {}

  ngOnInit() {}
}
