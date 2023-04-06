import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'obs-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.sass']
})
export class ObsLeftSideBarComponent implements OnInit {
  public obsLinks: { label: string; href: string; class?: string }[] = [
    { label: 'Conectar', href: '/obs/login' },
    { label: 'Controlador', href: '/obs/controller' },
    { label: 'Ayuda', href: '/obs/help' }
  ]

  constructor() {}

  ngOnInit() {}
}
